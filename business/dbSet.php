<?php

require '../config.php';
class DbSet
{
    public function __construct() {}

    public function connect()
    {
        $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);

        if (mysqli_connect_errno()) {
            echo "Connect failed: %s\n", mysqli_connect_error();
            exit();
        }

            mysqli_set_charset($conn, "utf8");
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