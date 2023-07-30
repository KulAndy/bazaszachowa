<?php
function search_opening_game(PDO $conn, $name, $color, $opening = null)
{
    $events_table = $GLOBALS["database"]["events_table"];
    $players_table =  $GLOBALS["database"]["players_all"];
    $games_table =  $GLOBALS["database"]["table_all"];
    $eco_table = $GLOBALS["database"]["eco_table"];
    if (empty($name) || !in_array($color, ["white", "black"])) {
        return [];
    }
    $fullname = string_for_fulltext($name);


    $params = [
        ":fulltext" => $fullname,
        ":name" => $name
    ];

    $query = "SELECT 
    $games_table.id, moves, $events_table.name as Event, $games_table.Year, $games_table.Month, $games_table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO   
    FROM $games_table 
    INNER join $players_table as t1 on WhiteID = t1.id 
    INNER join $players_table as t2 on BlackID = t2.id 
    LEFT join $events_table on $games_table.EventID = $events_table.id        
    LEFT JOIN $eco_table on $games_table.ecoID = $eco_table.ID ";
    if ($color == "white") {
        $query .= "\nWHERE match(t1.fullname) against(:fulltext in boolean mode) AND t1.fullname like :name";
    } else {
        $query .= "\nWHERE match(t2.fullname) against(:fulltext in boolean mode) AND t2.fullname like :name";
    }
    if (!empty($opening)) {
        $query .= " AND opening like :opening";
        $params[":opening"] = $opening;
    }

    return bind_params($conn, $query, $params);
}