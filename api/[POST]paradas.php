<?php

/* Dependencies
* php file responsible for loading dependencies
*/
require_once '../vendor/autoload.php';
require '../business/dbSet.php';
require '../business/mapFactory.php';

/* Required headers
*/
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

/* Main()
* make the stack to be executed
*/

$end = $_POST['endereco'];
$iniLat = $_POST['latitude'];
$iniLong = $_POST['longitude'];

// Calc lat and long min and max
// raio de busca/~raio da terra, raio de 2km
$r = 2/6371; 

$latMin = $iniLat - rad2deg($r);
$latMax = $iniLat + rad2deg($r);

$longMin = $iniLong - rad2deg(asin(sin($r)/cos(deg2rad($iniLat))));
$longMax = $iniLong + rad2deg(asin(sin($r)/cos(deg2rad($iniLat))));

$dbset = new DbSet();

$conn = $dbset->connect();
$result = $dbset->doSqlQuery($conn, 
"SELECT * 
    FROM Paradas 
    WHERE latitude > $latMin AND latitude < $latMax
        AND longitude > $longMin AND longitude < $longMax");
$dbset->closeConnection($conn);

$mapFactory = new MapFactory();

$jsonRes = $mapFactory->makeStopsLayer($result);

echo $jsonRes;

?>