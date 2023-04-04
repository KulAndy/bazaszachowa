<?php
require 'login_data.php';

$db->set_charset("utf8");

$data['base'] = $_POST['base'];

if (isset($_POST['player']) && !empty($_POST['player'])) {
    $playerBasic = htmlspecialchars($_POST['player']);
    if (in_array(substr($playerBasic, 1, 1), ["'", "`"])) {
        $playerFullname = substr($playerBasic, 2);
        $playerFullname = "+" . str_replace(" ", " +", preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $playerFullname)))));
    } else {
        $playerFullname = "+" . str_replace(" ", " +", preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $playerBasic)))));
    }
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
        $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        LEFT join $events_table on $table.EventID = $events_table.id        
        LEFT JOIN $eco_table on $table.ecoID = $eco_table.ID 
        WHERE match(t1.fullname) against(? in boolean mode) AND t1.fullname like ? AND opening like ? 
        order by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
        $searching = $db->prepare($query);
        $db->bind_param($searching, [$playerFullname, $_POST["player"], $opening]);

    } else {
        $query = "SELECT 
        $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        LEFT join $events_table on $table.EventID = $events_table.id        
        LEFT JOIN $eco_table on $table.ecoID = $eco_table.ID 
        WHERE match(t1.fullname) against(? in boolean mode) AND t1.fullname like ?
        order by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
        $searching = $db->prepare($query);
        $db->bind_param($searching, [$playerFullname, $_POST["player"]]);
    }
} else if ($color == "black") {
    if (isset($opening) && !empty($opening)) {
        $query = "SELECT 
        $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        LEFT join $events_table on $table.EventID = $events_table.id        
        LEFT JOIN $eco_table on $table.ecoID = $eco_table.ID 
        WHERE match(t2.fullname) against(? in boolean mode) AND t2.fullname like ? AND opening like ? 
        order by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
        $searching = $db->prepare($query);
        $db->bind_param($searching, [$playerFullname, $_POST["player"], $opening]);
    } else {
        $query = "SELECT 
        $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO   
        FROM $table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        LEFT join $events_table on $table.EventID = $events_table.id        
        LEFT JOIN $eco_table on $table.ecoID = $eco_table.ID 
        WHERE match(t2.fullname) against(? in boolean mode) AND t2.fullname like ?
        order by Year DESC, Month DESC, Day DESC,Event, Round desc, White, Black";
        $searching = $db->prepare($query);
        $db->bind_param($searching, [$playerFullname, $_POST["player"]]);
    }
} else {
    exit;
}

$db->execute($searching);
$result = $db->get_result($searching);

$data = array();
while ($row = $db->fetch_assoc($result)) {
    array_push($data, $row);
}
print_r(json_encode($data));
$db->close();