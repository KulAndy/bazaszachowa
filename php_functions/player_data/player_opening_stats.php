<?php
function player_opening_stats(PDO $conn, string $player): array
{
    $players_table =  $GLOBALS["database"]["players_all"];
    $games_table =  $GLOBALS["database"]["table_all"];
    $eco_table = $GLOBALS["database"]["eco_table"];

    $data = array(
        "whites" => [],
        "blacks" => []
    );

    $params = [
        ":name" => $player
    ];

    $query =
        "SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
FROM $games_table 
INNER JOIN $eco_table
on $games_table.ecoID = $eco_table.id
WHERE WhiteID in (SELECT id FROM $players_table WHERE fullname LIKE :name)
GROUP BY opening
ORDER by COUNT(*) DESC, opening";
    $data["whites"] = bind_params($conn, $query, $params);


    $query =
        "SELECT opening, 
COUNT(*) as count, 
Round(SUM(substring_index(REPLACE(Result, '1/2','0.5'),'-',1))/COUNT(*) *100,2) as percent
FROM $games_table 
INNER JOIN $eco_table
on $games_table.ecoID = $eco_table.id
WHERE BlackID in (SELECT id FROM $players_table WHERE fullname LIKE :name)
GROUP BY opening
ORDER by COUNT(*) DESC, opening";

    $data["blacks"] = bind_params($conn, $query, $params);

    return $data;
}
