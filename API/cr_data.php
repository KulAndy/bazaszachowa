<?php
require_once(__DIR__."/../php_functions/functions.php");
if (isset($_REQUEST['name']) && !empty($_REQUEST['name'])) {
    $fullname = $_REQUEST['name'];
} else {
    exit;
}

echo json_encode(cr_data($fullname));