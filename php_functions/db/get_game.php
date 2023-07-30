<?php

function get_game(PDO $conn, string $table, int $id)
{

    $players_table = $table == $GLOBALS["database"]["table_all"] ? $GLOBALS["database"]["players_all"] : $GLOBALS["database"]["players_pol"];
    $events_table = $GLOBALS["database"]["events_table"];
    $players_table = $table == "poland" ? $GLOBALS["database"]["players_pol"] : $GLOBALS["database"]["players_all"];
    $games_table = $table == "poland" ?  $GLOBALS["database"]["table_pol"] : $GLOBALS["database"]["table_all"];
    $eco_table = $GLOBALS["database"]["eco_table"];
    $sites_table = $GLOBALS["database"]["sites_table"];

    $query =
        "SELECT 
        $games_table.id, moves, $events_table.name as Event, $sites_table.site as Site, $games_table.Year, $games_table.Month, $games_table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo,$eco_table.ECO as  ECO   
        FROM $games_table 
        inner join $players_table as t1 on WhiteID = t1.id 
        inner join $players_table as t2 on BlackID = t2.id 
        inner join $events_table on $games_table.EventID = $events_table.id
        inner join $sites_table on $games_table.siteID = $sites_table.id    
        inner join $eco_table on $games_table.ecoID = $eco_table.id
        WHERE $games_table.id = :id";

    $params = [":id" => $id];

    return bind_params($conn, $query, $params);
}
