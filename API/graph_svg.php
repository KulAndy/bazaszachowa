<?php
require(__DIR__ . "/../php_functions/functions.php");
header("Content-Type: image/svg+xml");
$conn = start_connection();
echo svg($conn, $_REQUEST["name"]);
close_connection($conn);
