<?php

    class DbSet
    {
        public function __construct() {}

        public function connect()
        {
            $conn = mysqli_connect('localhost', 'root', 'password', 'SpTrans');

            if (mysqli_connect_errno()) {
                echo "Connect failed: %s\n", mysqli_connect_error();
                exit();
            }

            return $conn;
        }

        public function doSqlQuery($conn, $query)
        {
            return mysqli_query($conn, $query);
        }

        public function closeConnection($conn)
        {
            mysqli_close($conn);
        }
    }
        
?>