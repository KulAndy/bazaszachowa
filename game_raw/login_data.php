<?php
if (basename(__FILE__) == basename(["SCRIPT_FILENAME"])) {
    die("Plik tylko do załączania");
}
$host = "";
$user = "";
$password = "";
if (@$_GET["table"] == "poland" || @$_GET["table"] == "all") {
    $base = "";
    $table =  "";
    $players_table =  "";
    $events_table = "";
    $sites_table = "";
    $rounds_table = "";
    $results_table = "";
    $eco_table = "";
} else {
    die("zła baza danych");
}
