<?php
require(__DIR__ . "/../php_functions/functions.php");

$conn = start_connection();

echo json_encode(
    search_games(
        $conn,
        $_REQUEST["base"],
        $_REQUEST["white"],
        $_REQUEST["black"],
        $_REQUEST["ignore"] == "true",
        (int)$_REQUEST["minYear"],
        (int)$_REQUEST["maxYear"],
        $_REQUEST["event"],
        (int)$_REQUEST["minEco"],
        (int)$_REQUEST["maxEco"],
        $_REQUEST["searching"]
    )
);

close_connection($conn);
