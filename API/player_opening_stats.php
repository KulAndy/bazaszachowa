<?php
require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
echo json_encode(player_opening_stats($conn, $_REQUEST["name"]));
close_connection($conn);
