<?php
require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
                     Spróbuj jeszcze raz później.</p>';
    exit;
}
if (isset($_REQUEST['name']) && !empty($_REQUEST['name'])) {
    $basicName = htmlspecialchars($_REQUEST['name']);
    if (in_array(substr($_REQUEST['name'], 1, 1), ["'", "`"])) {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", substr($_REQUEST['name'], 2)));
    } else {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $_REQUEST['name']));
    }
    $fullname =
        str_replace(".", "", $fullname);
    $fullname = preg_replace("/(^| |')\w{0,2}($| |')/", "", $fullname);
    $fullname = str_replace("-", " ", $fullname);
    $fullname = "+" . str_replace(" ", " +", $fullname);
} else {
    die("Brak zawodnika do wyszukania");
}
$basicName =
    str_replace(".", "", $basicName);
$query = "SELECT max(WhiteElo) as maxElo, min(Year) as minYear, max(Year) as maxYear 
            FROM $table 
            inner join $players_table as t1 on WhiteID = t1.id 
            WHERE MATCH(t1.fullname) against(? in boolean mode) 
            AND t1.fullname like ? 
            UNION 
            SELECT max(BlackElo) as maxElo, min(Year) as minYear, max(Year) as maxYear
            FROM $table 
            inner join $players_table as t1 on BlackID = t1.id 
            WHERE MATCH(t1.fullname) against(? in boolean mode) 
            AND t1.fullname like ? ";
$searching = $db->prepare($query);
$searching->bind_param("ssss", $fullname, $_REQUEST["name"], $fullname, $_REQUEST["name"]);
$searching->execute();
$result = $searching->get_result();
echo json_encode($result->fetch_assoc());
