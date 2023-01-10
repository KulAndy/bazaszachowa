<?php
require 'login_data.php';
// $data = array();
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}
if (isset($_REQUEST['fullname']) && !empty($_REQUEST['fullname'])) {
    $basicName = htmlspecialchars($_REQUEST['fullname']);
    if (substr($_REQUEST['fullname'], 1, 1) == "'") {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", substr($_REQUEST['fullname'], 2)));
    } else {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $_REQUEST['fullname']));
    }
    $fullname =
        str_replace(".", "", $fullname);
    $fullname = preg_replace("/(^| |')\w{0,2}($| |')/", "", $fullname);
    $fullname = "+" . str_replace(" ", " +", $fullname);
    $basicName =
        str_replace(".", "", $basicName) . "%";
} else {
    die("Brak zawodnika do wyszukania");
}

$data = array(
    "whites" => [],
    "blacks" => []
);

$query = 'SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, "1/2","0.5"),"-",1))/COUNT(*) *100,2) as percent
FROM `all_games` 
INNER JOIN eco
on all_games.ECO = eco.ECO
WHERE MATCH(White) against(? in boolean mode) AND White like ?
GROUP BY opening
ORDER by COUNT(*) DESC, opening';
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $_REQUEST['fullname']);
$searching->execute();
$searching->store_result();
$searching->bind_result($opening, $count, $percent);
while ($searching->fetch()) {
    array_push($data["whites"], [$opening, $count, $percent]);
}

$query = 'SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, "1/2","0.5"),"-",1))/COUNT(*) *100,2) as percent
FROM `all_games` 
INNER JOIN eco
on all_games.ECO = eco.ECO
WHERE MATCH(Black) against(? in boolean mode) AND Black like ?
GROUP BY opening
ORDER by COUNT(*) DESC, opening';
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $_REQUEST['fullname']);
$searching->execute();
$searching->store_result();
$searching->bind_result($opening, $count, $percent);
while ($searching->fetch()) {
    array_push($data["blacks"], [$opening, $count, $percent]);
}

echo json_encode($data);