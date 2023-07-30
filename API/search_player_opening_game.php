<?php

require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
echo json_encode(search_opening_game($conn, $_REQUEST["name"], $_REQUEST["color"] ?? null, $_REQUEST["opening"] ?? null));
close_connection($conn);
