<?php

function start_connection(): PDO

{
    $host = $GLOBALS["database"]["host"];
    $user = $GLOBALS["database"]["user"];
    $pass = $GLOBALS["database"]["pass"];
    $db = $GLOBALS["database"]["base"];
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
}
