<?php
require(__DIR__ . "/../php_functions/functions.php");
ob_clean();
header("Content-type: image/jpeg");
$conn = start_connection();
imagejpeg(jpeg($conn, $_REQUEST["name"]));
close_connection($conn);