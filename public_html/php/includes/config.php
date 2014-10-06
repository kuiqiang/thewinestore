<?php

// PEAR DB
require_once 'C:/Program Files/wamp/bin/php/php5.5.12/pear/DB.php';
set_include_path("C:/Program Files/wamp/bin/php/php5.5.12/pear");


$hostname = 'localhost';
$username = 'root';
$password = 'toor';
$databaseName = 'winestore';

$dsn = "mysqli://$username:$password@$hostname/$databaseName";

$db = DB::connect($dsn);
if (DB::isError($db)) {
  die($db->getMessage());
}
$db->setFetchMode(DB_FETCHMODE_ASSOC);
