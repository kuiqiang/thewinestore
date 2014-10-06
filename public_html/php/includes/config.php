<?php

// PEAR DB
require_once 'C:/Program Files/wamp/bin/php/php5.5.12/pear/DB.php';


$hostname = 'localhost';
$username = 'root';
$password = 'toor';
$databaseName = 'winestore';

$dsn = "mysqli://$username:$password@$hostname/$databaseName";

$connection = DB::connect($dsn);
if (DB::isError($connection)) {
  die($connection->getMessage());
}
