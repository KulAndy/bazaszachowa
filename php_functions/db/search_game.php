<?php

function search_games(
    PDO $conn,
    string $table = null,
    string $white = null,
    string $black = null,
    bool $ignore = false,
    int $min_year = null,
    int $max_year = null,
    string $event = null,
    int $min_eco = 1,
    int $max_eco = 500,
    string $searching = "classic"
): array {

    $params = [];

    if (empty($max_year) || $max_year == 0) {
        $max_year = (int)date("Y");
    }

    if (empty($min_year) || $min_year == 0) {
        $min_year = 1475;
    }

    if ($table === null) {
        $table = $GLOBALS["database"]["table_all"];
    }

    if (isset($white) && !empty($white)) {
        $white_like = $white . "%";
        if ($searching == "classic") {
            $params[":whitelike"] = $white_like;
        } else {
            $params[":white"] = $white;
        }
    }


    if (isset($black) && !empty($black)) {
        $black_like = $black . "%";
        if ($searching == "classic") {
            $params[":blacklike"] = $black_like;
        } else {
            $params[":black"] = $black;
        }
    }

    if (isset($event) && !empty($event)) {
        $event_like = $event . "%";
        $params[":event"] = $event_like;
    }

    $events_table = $GLOBALS["database"]["events_table"];
    $players_table = $table == "poland" ? $GLOBALS["database"]["players_pol"] : $GLOBALS["database"]["players_all"];
    $games_table = $table == "poland" ?  $GLOBALS["database"]["table_pol"] : $GLOBALS["database"]["table_all"];
    $eco_table = $GLOBALS["database"]["eco_table"];

    $data = array(
        "rows" => array(),
        "table" => $table
    );



    if (isset($searching)) {
        if ($searching == 'classic') {
            if (isset($white_like) || isset($black_like)) {
                $query = "SELECT DISTINCT
            $games_table.id, moves, $events_table.name as Event, $games_table.Year, $games_table.Month, $games_table.Day, 
            Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
            FROM $games_table
            inner join $players_table as t1 on WhiteID = t1.id
            inner join $players_table as t2 on BlackID = t2.id
            left join $events_table on $games_table.EventID = $events_table.id                                    
            left join $eco_table on $games_table.ecoID = $eco_table.id
            WHERE ";
                if (
                    isset($white_like)
                ) {
                    $query .= "whiteid in (SELECT id FROM $players_table WHERE fullname LIKE :whitelike) ";
                }
                if (
                    isset($black_like)
                ) {
                    if (
                        isset($white_like)
                    ) {
                        $query .= " AND ";
                    }
                    $query .= "blackid in (SELECT id FROM $players_table WHERE fullname LIKE :blacklike) ";
                }

                if (!($min_eco != 1475)  || $max_year != (int)date(("Y"))) {
                    $query = $query . " and Year BETWEEN $min_year and $max_year ";
                }
                if (isset($event_like)) {
                    $query = $query . " and $events_table.name like :event ";
                }
                if ($min_eco != "1" || $max_eco != "500") {
                    $query = $query . " and $eco_table.id BETWEEN $min_eco AND $max_eco ";
                }

                if ($ignore == true) {
                    $query .= "UNION
                SELECT DISTINCT
                $games_table.id, moves, $events_table.name as Event, $games_table.Year, 
                $games_table.Month, $games_table.Day, Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, 
                $eco_table.ECO as ECO   
                FROM $games_table
                inner join $players_table as t1 on WhiteID = t1.id
                inner join $players_table as t2 on BlackID = t2.id
                left join $events_table on $games_table.EventID = $events_table.id                                    
                left join $eco_table on $games_table.ecoID = $eco_table.id
                WHERE ";
                    if (
                        isset($white_like)
                    ) {
                        $query .= "blackid in (SELECT id FROM $players_table WHERE fullname LIKE :whitelike) ";
                    }
                    if (
                        isset($black_like)
                    ) {
                        if (
                            isset($white_like)
                        ) {
                            $query .= " AND ";
                        }
                        $query .= "whiteid in (SELECT id FROM $players_table WHERE fullname LIKE :blacklike) ";
                    }
                    if ($min_year != 1475 || $max_year != (int)date("Y")) {
                        $query = $query . " and Year BETWEEN $min_year and $max_year ";
                    }
                    if (isset($event_like)) {
                        $query = $query . " and $events_table.name like :event ";
                    }
                    if (($min_eco != 1 || $max_eco != 500)) {
                        $query = $query . " and $eco_table.id BETWEEN $min_eco AND $max_eco ";
                    }
                }
            } else {
                $query = "SELECT null as id, null as moves, null as Event,null as  null as Year, null as Month, null as Day, null as Round,";
                $query .= "null as White, null as Black, null as Result, null as WhiteElo, null as BlackElo, null as ECO";
            }
        } else if ($searching == 'fulltext') {
            $query = "SELECT DISTINCT                         
                        $games_table.id, moves, $events_table.name as Event, $games_table.Year, $games_table.Month, $games_table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
                        FROM $games_table
                        inner join $players_table as t1 on WhiteID = t1.id
                        inner join $players_table as t2 on BlackID = t2.id
                        left join $events_table on $games_table.EventID = $events_table.id                                       
                        left join $eco_table on $games_table.ecoID = $eco_table.id
                        WHERE ";
            if (isset($white_like)) {
                $white =  preg_replace(
                    "/\b\w\b/i",
                    "",
                    $white
                );
                if (sizeof(explode(" ", $white)) > 1) {
                    if (in_array(substr($white, 1, 1), ["'", "`"])) {
                        $white = substr($white, 2);
                    }
                    $white = str_replace(
                        "-",
                        " ",
                        $white
                    );
                    $white = preg_replace(
                        '/\s+/',
                        ' ',
                        $white
                    );
                    $white = "+" . str_replace(
                        " ",
                        " +",
                        preg_replace(
                            "/(^| |')\w{0,2}($| |')/",
                            "",
                            $white
                        )
                    );
                    $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(:white in boolean mode) AND fullname like :white ) ";
                } else {
                    $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(:white) AND fullname like :white ) ";
                }
            }
            if (isset($black_like)) {
                if (isset($params[":white"])) {
                    $query = $query . " and";
                }

                if (sizeof(explode(" ", $black)) > 1) {
                    $black =  preg_replace(
                        "/\b\w\b/i",
                        "",
                        $black
                    );

                    if (in_array(substr($black, 1, 1), ["'", "`"])) {
                        $black = substr($black, 2);
                    }
                    $black = str_replace(
                        "-",
                        " ",
                        $black
                    );
                    $black = preg_replace(
                        '/\s+/',
                        ' ',
                        $black
                    );
                    $black = "+" . str_replace(
                        " ",
                        " +",
                        preg_replace(
                            "/(^| |')\w{0,2}($| |')/",
                            "",
                            $black
                        )
                    );
                    $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(:black in boolean mode) AND fullname like :black ) ";
                } else {
                    $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(:black) AND fullname like :black ) ";
                }
            }
            if (($min_year != 1475 || $max_year != date("Y"))) {
                $query = $query . " and";
                $query = $query . " Year BETWEEN $min_year and $max_year ";
            }
            if (isset($event_like)) {
                $query = $query . " and";
                $query = $query . " $events_table.name like :event ";
            }

            if (($min_eco != 1 || $max_eco != 500)) {
                $query = $query . " and";
                $query = $query . " $eco_table.id BETWEEN  $min_eco AND  $max_eco ";
            }

            if ($ignore == true) {
                $paramsSize = sizeof($params);
                $query = $query . "UNION DISTINCT
                SELECT DISTINCT
                $games_table.id, moves, $events_table.name as Event, $games_table.Year, $games_table.Month, $games_table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
                FROM $games_table
                inner join $players_table as t1 on WhiteID = t1.id
                inner join $players_table as t2 on BlackID = t2.id
                left join $events_table on $games_table.EventID = $events_table.id                    
                left join $eco_table on $games_table.ecoID = $eco_table.id
                WHERE ";
                if (isset($white_like)) {
                    if (sizeof(explode(" ", $white)) > 1) {
                        $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(:white in boolean mode) AND fullname like :white ) ";
                    } else {
                        $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(:white) AND fullname like :white ) ";
                    }
                }
                if (isset($black_like)) {
                    if (isset($params[":white"])) {
                        $query = $query . " and";
                    }

                    if (sizeof(explode(" ", $black)) > 1) {
                        $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(:black in boolean mode) AND fullname like :black ) ";
                    } else {
                        $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(:black) AND fullname like :black ) ";
                    }
                }
                if (($min_year != 1475 || $max_eco != date("Y"))) {
                    $query = $query . " and";
                    $query = $query . " Year BETWEEN $min_year and $max_year ";
                }
                if (isset($event_like)) {
                    $query = $query . " and";
                    $query = $query . " $events_table.name like :event ";
                }
                if (($min_eco != 1 || $max_eco != 500)) {
                    $query = $query . " and";
                    $query = $query . " $eco_table.id BETWEEN  $min_eco AND  $max_eco ";
                }
            }
        }
    }

    $query = $query . " order BY year DESC,month DESC,day DESC,Event,Round desc, White, Black limit 10000";
    $result = bind_params($conn, $query, $params);

    try {
        $data["rows"] = $result;
    } catch (Exception $e) {
    }

    return $data;
}