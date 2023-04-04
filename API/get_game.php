<?php
require 'login_data.php';

if (isset($_POST['id']) && !empty($_POST['id'])) {
    $id = $_POST['id'];
} else {
    die("Nie podano partii do wyświetlenia");
}
$data = array(
    "rows" => array()
);

$query =
    "SELECT 
$table.id, moves, $events_table.name as Event, $sites_table.site as Site, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo,$eco_table.ECO as  ECO   
FROM $table 
inner join $players_table as t1 on WhiteID = t1.id 
inner join $players_table as t2 on BlackID = t2.id 
LEFT join $events_table on $table.EventID = $events_table.id
LEFT join $sites_table on $table.siteID = $sites_table.id
LEFT join $eco_table on $table.ecoID = $eco_table.id
WHERE $table.id = ?";

$searching = $db->prepare($query);
$db->bind_param($searching, [$id]);
$db->execute($searching);
$result = $db->get_result($searching);
while ($row = $db->fetch_assoc($result)) {
    array_push($data["rows"], $row);
}
print_r(json_encode($data));
$db->close();