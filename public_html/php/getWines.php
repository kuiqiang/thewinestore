<?php

require_once 'includes/config.php';

$wineName = filter_input(INPUT_GET, 'wineName', FILTER_SANITIZE_STRING);
$regionName = filter_input(INPUT_GET, 'regionName', FILTER_SANITIZE_STRING);
$wineryName = filter_input(INPUT_GET, 'wineryName', FILTER_SANITIZE_STRING);
$startingYear = filter_input(INPUT_GET, 'startingYear', FILTER_VALIDATE_INT);
$endingYear = filter_input(INPUT_GET, 'endingYear', FILTER_VALIDATE_INT);
$minCost = filter_input(INPUT_GET, 'minCost', FILTER_VALIDATE_FLOAT);
$maxCost = filter_input(INPUT_GET, 'maxCost', FILTER_VALIDATE_FLOAT);
$minInStock = filter_input(INPUT_GET, 'minInStock', FILTER_VALIDATE_INT);
$minPurchases = filter_input(INPUT_GET, 'minPurchases', FILTER_VALIDATE_INT);
$whereClause = "WHERE wine.wine_name LIKE \"%" . $wineName . "%\"";

if ($regionName !== "" && $regionName !== "All") {
  $whereClause .= " AND region.region_name = \"" . $regionName . "\"";
}

if ($wineryName !== "") {
  $whereClause .= " AND winery.winery_name LIKE \"%" . $wineryName . "%\"";
}

if ($startingYear && !$endingYear) {
  $whereClause .= " AND wine.`year` >=" . $startingYear;
} else if (!$startingYear && $endingYear) {
  $whereClause .= " AND wine.`year` <= " . $endingYear;
} else if ($startingYear && $endingYear && $startingYear <= $endingYear) {
  $whereClause .= " AND wine.`year` BETWEEN " . $startingYear . " AND " . $endingYear;
}

if ($minCost && !$maxCost) {
  $whereClause .= " AND inventory.cost >=" . $minCost;
} else if (!$startingYear && $endingYear) {
  $whereClause .= " AND inventory.cost <= " . $maxCost;
} else if ($minCost && $maxCost && $minCost <= $maxCost) {
  $whereClause .= " AND inventory.cost BETWEEN " . $minCost . " AND " . $maxCost;
}

if ($minInStock) {
  $whereClause .= " AND inventory.on_hand >= " . $minInStock;
}

$query = "SELECT
	wine.wine_name AS wineName,
	GROUP_CONCAT(DISTINCT grape_variety.variety ORDER BY grape_variety.variety ASC SEPARATOR ', ') AS varieties,
	wine.`year` AS `year`,
	winery.winery_name AS winery,
	region.region_name AS region,
	inventory.cost AS price,
	inventory.on_hand AS inStock,
	COUNT(items.order_id) AS numberOfPurchases
FROM
	wine
INNER JOIN wine_variety ON wine.wine_id = wine_variety.wine_id
INNER JOIN grape_variety ON grape_variety.variety_id = wine_variety.variety_id
INNER JOIN winery ON wine.winery_id = winery.winery_id
INNER JOIN region ON winery.region_id = region.region_id
INNER JOIN inventory ON inventory.wine_id = wine.winery_id
INNER JOIN items ON wine.wine_id = items.wine_id
$whereClause
GROUP BY
	wine.wine_name,
	wine.`year`,
	winery.winery_name,
	region.region_name,
	inventory.cost,
	inventory.on_hand";


if ($minPurchases) {
  $query .= " HAVING COUNT(items.order_id) >= " . $minPurchases . " ORDER BY wine.wine_name ASC";
}

$result = $mysqli->query($query) or die($mysqli->error . __LINE__);

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
