<?php

require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
echo json_encode(search_players($conn, $_REQUEST["name"], "all"));
close_connection($conn);
