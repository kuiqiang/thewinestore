<?php

require_once 'includes/config.php';

$query = "SELECT
	region.region_name as regionName
FROM
	region";

$result = $mysqli->query($query) or die($mysqli->error . __LINE__);

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
