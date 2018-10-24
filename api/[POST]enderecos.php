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

/* GET
* Retrieves data from get request
*/

/*Error Log
* error_log(print_r($value, true));
*/

$end = $_POST['endereco'];

$dbset = new DbSet();

$conn = $dbset->connect();

$result = $dbset->doSqlQuery($conn, 
"SELECT endereco, latitude, longitude
    FROM Paradas 
    WHERE endereco LIKE '%$end%'");
$dbset->closeConnection($conn);

$array_values = array();

$jsonRes = "[";

foreach($result as $value)
{
    $end = trim($value['endereco']);
    $lat = trim($value['latitude']+0.00001);
    $lng = trim($value['longitude']);

    if(in_array($end, $array_values) == false)
        $jsonRes .= "{ \"endereco\": \"$end\", \"latitude\": \"$lat\", \"longitude\": \"$lng\" },";

    array_push($array_values, $end);
}

$jsonRes = substr($jsonRes, 0, -1);
$jsonRes .= "]";

http_response_code(200);
$jsonRes = json_encode($jsonRes);

echo $jsonRes;

?>