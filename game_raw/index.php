<?php
header('Content-type: text/plain');
require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
$table = $_REQUEST["table"];
$id = (int) $_REQUEST["id"];
$rows = get_game($conn, $table, $id);
if (sizeof($rows) > 0) {
    echo row_to_pgn($rows[0]);
} else {
    echo row_to_pgn([]);
}

close_connection($conn);
