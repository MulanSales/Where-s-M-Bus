<?php

    class SpTransClient
    {
        public $apiEndpoint = 'http://api.olhovivo.sptrans.com.br/v2.1';
        public $token = 'cf815efb99213e49c8ee1892288cd7fbf592cb46da11d2e4f555ba12e61baa5f';

        public function __construct() {}
        
        public function login($client)
        {           
            $url = "$this->apiEndpoint/Login/Autenticar?token=$this->token";

            $response = $client->request('POST', $url);
        }

        public function getLinha($client, $param)
        {
            $url = "$this->apiEndpoint/Linha/Buscar?termosBusca=$param";

            $response = $client->request('GET', $url);
            return $response;
        }

        public function getLinhas($client)
        {
            $url = "$this->apiEndpoint/Posicao";

            $response = $client->request('GET', $url);
            return $response;
        }

        public function getEnderecos($client, $end)
        {
            $url = "$this->apiEndpoint/Parada/Buscar?termosBusca=\"$end\"";

            $response = $client->request('GET', $url);
            return $response;
        }

        public function getLinhaTempoReal($client, $param)
        {
            $url = "$this->apiEndpoint/Posicao/Linha?codigoLinha=$param";

            $response = $client->request('GET', $url);
            return $response;
        }

    }
 ?>