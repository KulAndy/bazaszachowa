<?php
require 'login_data.php';
// $data = array();
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
    $basicName =
        str_replace(".", "", $basicName) . "_";
} else {
    die("Brak zawodnika do wyszukania");
}

$data = array(
    "whites" => [],
    "blacks" => []
);

$query = "SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
FROM $table 
inner join $players_table as t1 on WhiteID = t1.id 
INNER JOIN $eco_table
on all_games.ecoID = eco.id
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ? 
GROUP BY opening
ORDER by COUNT(*) DESC, opening";
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $_REQUEST['name']);
$searching->execute();
$searching->store_result();
$searching->bind_result($opening, $count, $percent);
while ($searching->fetch()) {
    array_push($data["whites"], [$opening, $count, $percent]);
}

$query = "SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
FROM $table 
inner join $players_table as t1 on BlackID = t1.id 
INNER JOIN $eco_table
on all_games.ecoID = eco.id
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ? 
GROUP BY opening
ORDER by COUNT(*) DESC, opening";
$searching = $db->prepare($query);
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $_REQUEST['name']);
$searching->execute();
$searching->store_result();
$searching->bind_result($opening, $count, $percent);
while ($searching->fetch()) {
    array_push($data["blacks"], [$opening, $count, $percent]);
}
echo json_encode($data);
