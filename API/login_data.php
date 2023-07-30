<?php
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    die("Plik tylko do załączania");
}
$host = "";
$user = "";
$password = "";
if (@($_POST[base] == "poland" || $_POST[base] == "all")) {
    $base = "";
    $table = $_POST[base] . "_games";
    $players_table = "";
    $events_table = "";
    $sites_table = "";
    $rounds_table = "";
    $results_table = "";
    $eco_table = "eco";
    $whole_players_table = "";
    $fide_table = "";
} else if (@($_GET[base] == "poland" || $_GET[base] == "all")) {
    $base = "";
    $table = "";
    $players_table = "";
    $events_table = "";
    $sites_table = "";
    $rounds_table = "";
    $results_table = "";
    $eco_table = "";
    $whole_players_table = "";
    $fide_table = "";
} else {
    die("zła baza danych");
}

require_once("./connector.php");

// @$db = new mysqli($host, $user, $password, $base);
@$db = new Connector($host, $user, $password, $base);
$db->set_charset("utf8");
