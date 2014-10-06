<?php

require_once 'includes/config.php';

$query = "SELECT
	region.region_name as regionName
FROM
	region";

// PEAR DB
$result = $connection->query($query) or die($connection->getMessage());

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
