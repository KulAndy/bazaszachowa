<?php
require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

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
inner join $events_table on $table.EventID = $events_table.id
inner join $sites_table on $table.siteID = $sites_table.id
inner join $eco_table on $table.ecoID = $eco_table.id
WHERE $table.id = ?";

$searching = $db->prepare($query);
$searching->bind_param("i", $id);
$searching->execute();
$result = $searching->get_result();
while ($row = $result->fetch_assoc()) {
    array_push($data["rows"], $row);
}
print_r(json_encode($data));
$db->close();
