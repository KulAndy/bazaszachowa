<?php
header('Content-Type: application/x-chess-pgn');
header('Content-Disposition: attachment; filename="games.pgn"');
require_once(__DIR__ . "/php_functions/functions.php");
$conn = start_connection();
$table = $_REQUEST["table"] ?? "all";

$offset_size = 1000;
$i = 0;
$rows = get_ids($conn, $table, $offset_size, $offset_size * $i++);
while (sizeof($rows) > 0) {
    $chunk = "";
    foreach ($rows as $row) {
        $game_row = get_game($conn, $table, $row["id"]);
        $chunk .= row_to_pgn($game_row[0]);
    }
    echo $chunk;
    $rows = get_ids($conn, $table, $offset_size, $offset_size * $i++);
    flush();
}

ob_flush();
flush();
close_connection($conn);
