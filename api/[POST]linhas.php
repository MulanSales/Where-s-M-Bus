<?php

/* Dependencies
* php file responsible for loading dependencies
*/
require_once '../vendor/autoload.php';
require '../business/httpClient.php';
require '../business/mapFactory.php';

/* Required headers
*/
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

/* Main()
* make the stack to be executed
*/

$iniLat = $_POST['latitude'];
$iniLong = $_POST['longitude'];

/* GET
* Retrieves data from get request
*/

$httpClient = new SpTransClient();
$client = new \GuzzleHttp\Client([
    'cookies' => true,
]);

// Calc lat and long min and max
// raio de busca/~raio da terra, raio de 2km
$r = 2/6371; 

$latMin = $iniLat - rad2deg($r);
$latMax = $iniLat + rad2deg($r);

$longMin = $iniLong - rad2deg(asin(sin($r)/cos(deg2rad($iniLat))));
$longMax = $iniLong + rad2deg(asin(sin($r)/cos(deg2rad($iniLat))));

$httpClient->login($client);

$reslinha = $httpClient->getLinhas($client);
$linhas = $reslinha->getBody();
$linhas = json_decode($linhas, true);

$mapFactory = new MapFactory();
$jsonResp = $mapFactory->makePositionLayerJson($linhas, $latMin, $latMax, $longMin, $longMax);

/* Return
* Retorna os pontos com os onibus presentes no mapa no momento
*/

http_response_code(200); 
echo $jsonResp;

?>