<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

$db->set_charset("utf8");

if (isset($_POST['player']) && !empty($_POST['player'])) {
    $playerBasic = $_POST['player'];
    $playerFullname = "+" . str_replace(" ", " +", preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $playerBasic)))));
}

if (isset($_POST['color']) && !empty($_POST['color'])) {
    $color = $_POST['color'];
}

if (isset($_POST['opening']) && !empty($_POST['opening'])) {
    $opening = $_POST['opening'];
}
if ($color == "white") {
    if (isset($opening) && !empty($opening)) {
        $query = "SELECT $table.id, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, $table.ECO FROM $table 
INNER JOIN eco on $table.ECO = eco.ECO WHERE MATCH(White) against(? in boolean mode) AND opening like ? order by Year DESC, Month DESC, Day DESC";
        $searching = $db->prepare($query);
        $searching->bind_param('ss', $playerFullname, $opening);
    } else {
        $query = "SELECT id, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table 
            WHERE MATCH(White) against(? in boolean mode) order by Year DESC, Month DESC, Day DESC";
        $searching = $db->prepare($query);
        $searching->bind_param('s', $playerFullname);
    }
} else if ($color == "black") {
    if (isset($opening) && !empty($opening)) {
        $query = "SELECT $table.id,  Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, $table.ECO FROM $table 
INNER JOIN eco on $table.ECO = eco.ECO WHERE MATCH(Black) against(? in boolean mode) AND opening like ? order by Year DESC, Month DESC, Day DESC";
        $searching = $db->prepare($query);
        $searching->bind_param('ss', $playerFullname, $opening);
    } else {
        $query = "SELECT id, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table 
            WHERE MATCH(Black) against(? in boolean mode) order by Year DESC, Month DESC, Day DESC";
        $searching = $db->prepare($query);
        $searching->bind_param('s', $playerFullname);
    }
} else {
    exit;
}
$searching->execute();
$result = $searching->get_result();

$data = array();
while ($row = $result->fetch_assoc()) {
    array_push($data, $row);
}
print_r(json_encode($data));
$db->close();