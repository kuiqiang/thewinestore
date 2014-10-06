<?php

require_once 'includes/config.php';

$query = "SELECT
	region.region_name as regionName
FROM
	region";

// PEAR DB
$result = $db->getAll($query);

echo json_encode($result);