<?php
require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
$table = $_REQUEST["table"];
$id = (int) $_REQUEST["id"];
$rows = get_game($conn, $table, $id);
if (sizeof($rows) > 0) {
    echo json_encode($rows[0]);
} else {
    echo json_encode([
        "id" => null,
        "moves" => "1. *",
        "Event" => null,
        "Year" => null,
        "Month" => null,
        "Day" => null,
        "Round" => null,
        "White" => null,
        "Black" => null,
        "Result" => null,
        "WhiteElo" => null,
        "BlackElo" => null,
        "ECO" => null
    ]);
}

close_connection($conn);
