<?php
require_once('login_data.php');

if (isset($_REQUEST['name']) && !empty($_REQUEST['name'])) {
    $basicName = htmlspecialchars($_REQUEST['name']);
    if (in_array(substr($_REQUEST['name'], 1, 1), ["'", "`"])) {
        $fullname = substr($_REQUEST['name'], 2);
    } else {
        $fullname = $_REQUEST['name'];
    }
    $fullname =  preg_replace(
        "/\b\w\b/i",
        "",
        $fullname
    );

    $fullname = str_replace(
        "-",
        " ",
        $fullname
    );
    $fullname = preg_replace(
        '/\s+/',
        ' ',
        $fullname
    );
    $fullname = "+" . str_replace(
        " ",
        " +",
        preg_replace(
            "/(^| |')\w{0,2}($| |')/",
            "",
            $fullname
        )
    );
    $basicName =
        str_replace(".", "", $basicName);
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
on $table.ecoID = $eco_table.id
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ? 
GROUP BY opening
ORDER by COUNT(*) DESC, opening";
$searching = $db->prepare($query);
$db->bind_param($searching, [$fullname, $_REQUEST['name']]);
$db->execute($searching);
$db->store_result($searching);
$db->bind_result($searching, $opening, $count, $percent);

while ($db->fetch($searching)) {
    array_push($data["whites"], [$opening, $count, $percent]);
}

$query = "SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
FROM $table 
inner join $players_table as t1 on BlackID = t1.id 
INNER JOIN $eco_table
on $table.ecoID = $eco_table.id
WHERE MATCH(t1.fullname) against(? in boolean mode) 
AND t1.fullname like ? 
GROUP BY opening
ORDER by COUNT(*) DESC, opening";
$searching = $db->prepare($query);
$db->bind_param($searching, [$fullname, $_REQUEST['name']]);
$db->execute($searching);
$db->store_result($searching);
$db->bind_result($searching, $opening, $count, $percent);
while ($db->fetch($searching)) {
    array_push($data["blacks"], [$opening, $count, $percent]);
}

echo json_encode($data);