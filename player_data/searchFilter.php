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

$data['base'] = $_POST['base'];

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
        $query = "SELECT 
        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, $table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        INNER JOIN eco on $table.ECO = eco.ECO 
        WHERE match(t1.fullname) against(? in boolean mode) AND t1.fullname like '$_POST[player]' AND opening like ? order by Year DESC, Month DESC, Day DESC,Round desc, Event, White, Black";
        $searching = $db->prepare($query);
        $searching->bind_param('ss', $playerFullname, $opening);
    } else {
        $query = "SELECT 
        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        WHERE match(t1.fullname) against(? in boolean mode) AND t1.fullname like '$_POST[player]' order by Year DESC, Month DESC, Day DESC,Round desc, Event, White, Black";
        $searching = $db->prepare($query);
        $searching->bind_param('s', $playerFullname);
    }
} else if ($color == "black") {
    if (isset($opening) && !empty($opening)) {
        $query = "SELECT 
        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, $table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        INNER JOIN eco on $table.ECO = eco.ECO 
        WHERE match(t2.fullname) against(? in boolean mode) AND t2.fullname like '$_POST[player]' AND opening like ? order by Year DESC, Month DESC, Day DESC,Round desc, Event, White, Black";
        $searching = $db->prepare($query);
        $searching->bind_param('ss', $playerFullname, $opening);
    } else {
        $query = "SELECT 
        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        WHERE match(t2.fullname) against(? in boolean mode) AND t2.fullname like '$_POST[player]' order by Year DESC, Month DESC, Day DESC,Round desc, Event, White, Black";
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
