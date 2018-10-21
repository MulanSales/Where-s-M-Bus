<?php

    class MapFactory
    {
        public function __construct() {}

        public function makePositionLayerJson($linhas, $latMin, $latMax, $longMin, $longMax)
        {
            $points = "[";

            foreach($linhas['l'] as $linha)
            {
                if($linha['qv'] == 0)
                {
                    $lineCode =  $linha['c'];
                    $lineName0 = $linha['lt0'];
                    $lineName1 = $linha['lt1'];
                }
                else
                {
                    $lineCode =  $linha['c'];
                    $lineName0 = $linha['lt1'];
                    $lineName1 = $linha['lt0'];
                }

                foreach($linha['vs'] as $point)
                {
                    $lat = $point['py'];
                    $lon = $point['px'];
    
                    if(($latMin < $lat && $lat < $latMax) && ($longMin < $lon && $lon < $longMax))
                    {
                        $points .= "{
                            \"properties\": {
                                \"lineCode\": \"$lineCode\",
                                \"lineName0\": \"$lineName0\",
                                \"lineName1\": \"$lineName1\"
                            },
                            \"type\": \"Feature\",
                            \"geometry\": {
                                \"type\": \"Point\",
                                \"coordinates\": [$lon, $lat]
                            }
                        },";
                    }
                }
            }

            $points = substr($points, 0, -1);
            $points .= "]";

            $jsonRes = "{ \"id\": \"bus\",
                \"type\": \"symbol\",
                \"source\": {
                    \"type\": \"geojson\",
                    \"data\": {
                        \"type\": \"FeatureCollection\",
                        \"features\": $points
                    }
                },
                \"layout\": {
                    \"icon-image\": \"bus\",
                    \"icon-size\": 0.10
                }
            }";

            return json_encode($jsonRes); 
        }

        public function makeBusLayerJson($pointsObject, $jsonLinha)
        {
            $lineCode =  $jsonLinha['lt'];
            $lineName0 = $jsonLinha['tp'];
            $lineName1 = $jsonLinha['ts'];

            $points = "[";

            foreach($pointsObject['vs'] as $point)
            {
                $lat = $point['py'];
                $lon = $point['px'];

                $points .= "{
                    \"properties\": {
                        \"lineCode\": \"$lineCode\",
                        \"lineName0\": \"$lineName0\",
                        \"lineName1\": \"$lineName1\"
                    },
                    \"type\": \"Feature\",
                    \"geometry\": {
                        \"type\": \"Point\",
                        \"coordinates\": [$lon, $lat]
                    }
                },";
            
            }

            $points = substr($points, 0, -1);
            $points .= "]";

            $jsonRes = "{ \"id\": \"points\",
                \"type\": \"symbol\",
                \"source\": {
                    \"type\": \"geojson\",
                    \"data\": {
                        \"type\": \"FeatureCollection\",
                        \"features\": $points
                    }
                },
                \"layout\": {
                    \"icon-image\": \"bus\",
                    \"icon-size\": 0.01
                }
            }";

            return json_encode($jsonRes); 
        }

        public function makeStopsLayer($stopsList)
        {

            $points = "[";

            foreach($stopsList as $stop)
            {
                $lat = $stop['latitude'];
                $lon = $stop['longitude'];
                $cod = $stop['codigo'];
                $end = $stop['endereco'];
                $ref = $stop['referencia'];

                $points .= "{
                    \"properties\": {
                        \"codigo\": \"$cod\",
                        \"endereco\": \"$end\",
                        \"referencia\": \"$ref\"
                    },
                    \"type\": \"Feature\",
                    \"geometry\": {
                        \"type\": \"Point\",
                        \"coordinates\": [$lon, $lat]
                    }
                },";
            }

            $points = substr($points, 0, -1);
            $points .= "]";

            $jsonRes = "{ \"id\": \"stops\",
                \"type\": \"symbol\",
                \"source\": {
                    \"type\": \"geojson\",
                    \"data\": {
                        \"type\": \"FeatureCollection\",
                        \"features\": $points
                    }
                },
                \"layout\": {
                    \"icon-image\": \"stops\",
                    \"icon-size\": 0.03
                }
            }";

            return json_encode($jsonRes); 
        }
    }

?>