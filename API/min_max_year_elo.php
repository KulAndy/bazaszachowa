<?php
require_once(__DIR__ . "/../php_functions/functions.php");
$conn = start_connection();
$rows = min_max_year_elo($conn, $_REQUEST["name"]);
if (sizeof($rows) == 0) {
    echo "{}";
} else {
    echo json_encode($rows[0]);
}
close_connection($conn);
