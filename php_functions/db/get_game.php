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
    $games_table.id, moves, IFNULL($events_table.name, '?') as Event, IFNULL($sites_table.site, '?') as Site, 
    IFNULL($games_table.Year, '?') as Year, IFNULL($games_table.Month, '?') as Month, IFNULL($games_table.Day, '?') as Day, IFNULL(Round, '?') as Round, 
    IFNULL(t1.fullname, '?') as White, IFNULL(t2.fullname, '?') as Black, IFNULL(Result, '*') as Result, IFNULL(WhiteElo, 0) as WhiteElo, IFNULL(BlackElo, 0) as BlackElo, IFNULL($eco_table.ECO, '?') as ECO   
    FROM $games_table 
    LEFT join $players_table as t1 on WhiteID = t1.id 
    LEFT join $players_table as t2 on BlackID = t2.id 
    LEFT join $events_table on $games_table.EventID = $events_table.id
    LEFT join $sites_table on $games_table.siteID = $sites_table.id    
    LEFT join $eco_table on $games_table.ecoID = $eco_table.id
    WHERE $games_table.id = :id";

    $params = [":id" => $id];

    return bind_params($conn, $query, $params);
}
