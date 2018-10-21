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

/* GET
* Retrieves data from get request
*/

$linhaOnibus = $_GET['linha'];

$httpClient = new SpTransClient();
$client = new \GuzzleHttp\Client([
    'cookies' => true,
]);

$httpClient->login($client);

$reslinha = $httpClient->getLinha($client, $linhaOnibus);
$jsonLinha = $reslinha->getBody();
$jsonLinha = json_decode($jsonLinha, true);

$jsonLinha = $jsonLinha[0];

$resTempoReal = $httpClient->getLinhaTempoReal($client, $jsonLinha['cl']);
$pontosObj = $resTempoReal->getBody();

$pontosObj = json_decode($pontosObj, true);

$mapFactory = new MapFactory();
$points = $mapFactory->makeBusLayerJson($pontosObj, $jsonLinha);

http_response_code(200);
 
/* Return
* Retorna os pontos com os onibus presentes no mapa no momento
*/
echo $points;

?>