<?php

require_once('login_data.php');

$data = array(
    "rows" => array(),
);

$data['base'] = $_POST['base'];

if (isset($_POST['white']) && !empty($_POST['white'])) {
    $white = $_POST['white'] . "%";
    $data['white'] = $white;
} else {
    $data['white'] = null;
}
if (isset($_POST['black']) && !empty($_POST['black'])) {
    $black = $_POST['black'] . "%";
    $data['black'] = $black;
} else {
    $data['black'] = null;
}

if (isset($_POST['ignore']) && !empty($_POST['ignore'])) {
    $ignore = $_POST['ignore'];
    $data['ignore'] = $ignore;
} else {
    $data['ignore'] = null;
}

if (isset($_POST['minYear']) && !empty($_POST['minYear']) && preg_match("/^[1-9]\d+$/", $_POST['minYear'])) {
    $minYear = $_POST['minYear'];
    $data['minYear'] = $minYear;
} else {
    $data['minYear'] = null;
}
if (isset($_POST['maxYear']) && !empty($_POST['maxYear']) && preg_match("/^[1-9]\d+$/", $_POST['maxYear'])) {
    $maxYear = $_POST['maxYear'];
    $data['maxYear'] = $maxYear;
} else {
    $data['maxYear'] = null;
}
if (isset($_POST['event']) && !empty($_POST['event'])) {
    $event = $_POST['event'] . "%";
    $data['event'] = $_POST['event'];
} else {
    $data['event'] = null;
}
if (isset($_POST['minEco']) && !empty($_POST['minEco']) && preg_match("/^[1-5][0-9]{0,2}$/", $_POST['minEco'])) {
    $minEco = $_POST['minEco'];
    $data['minEco'] = $minEco;
} else {
    $data['minEco'] = null;
}
if (isset($_POST['maxEco']) && !empty($_POST['maxEco']) && preg_match("/^[1-5][0-9]{0,2}$/", $_POST['maxEco'])) {
    $maxEco = $_POST['maxEco'];
    $data['maxEco'] = $maxEco;
} else {
    $data['maxEco'] = null;
}

if (isset($_POST['searching'])) {
    $data['searching'] = $_POST['searching'];
    if ($_POST['searching'] == 'classic') {
        if (isset($white) || isset($black)) {
            $params = [];
            $query = "SELECT DISTINCT
        $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day, Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
        FROM $table
        inner join $players_table as t1 on WhiteID = t1.id
        inner join $players_table as t2 on BlackID = t2.id
        left join $events_table on $table.EventID = $events_table.id                                    
        left join $eco_table on $table.ecoID = $eco_table.id
        WHERE ";
            if (
                isset($white)
            ) {
                $query .= "whiteid in (SELECT id FROM $players_table WHERE fullname LIKE ?) ";
                array_push($params, $white);
            }
            if (
                isset($black)
            ) {
                if (
                    isset($white)
                ) {
                    $query .= " AND ";
                }
                $query .= "blackid in (SELECT id FROM $players_table WHERE fullname LIKE ?) ";
                array_push($params, $black);
            }

            if (isset($minYear)  && isset($maxYear)) {
                $query = $query . " and Year BETWEEN $minYear and $maxYear ";
            }
            if (isset($event)) {
                $query = $query . " and $events_table.name like ? ";
                array_push($params, $event);
            }
            if (isset($minEco) && isset($maxEco) && ($minEco != "1" || $maxEco != "500")) {
                $query = $query . " and $eco_table.id BETWEEN $minEco AND $maxEco ";
            }

            if (isset($ignore) && $ignore == "true") {
                $query .= "UNION
            SELECT DISTINCT
            $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day, Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
            FROM $table
            inner join $players_table as t1 on WhiteID = t1.id
            inner join $players_table as t2 on BlackID = t2.id
            left join $events_table on $table.EventID = $events_table.id                                    
            left join $eco_table on $table.ecoID = $eco_table.id
            WHERE ";
                if (
                    isset($white)
                ) {
                    $query .= "blackid in (SELECT id FROM $players_table WHERE fullname LIKE ?) ";
                    array_push($params, $white);
                }
                if (
                    isset($black)
                ) {
                    if (
                        isset($white)
                    ) {
                        $query .= " AND ";
                    }
                    $query .= "whiteid in (SELECT id FROM $players_table WHERE fullname LIKE ?) ";
                    array_push($params, $black);
                }
                if (isset($minYear)  && isset($maxYear)) {
                    $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                }
                if (isset($event)) {
                    $query = $query . " and $events_table.name like ? ";
                    array_push($params, $event);
                }
                if (isset($minEco) && isset($maxEco) && ($minEco != "1" || $maxEco != "500")) {
                    $query = $query . " and $eco_table.id BETWEEN $minEco AND $maxEco ";
                }
            }
        } else {
            $query = "SELECT null as id, null as moves, null as Event,null as  null as Year, null as Month, null as Day, null as Round,";
            $query .= "null as White, null as Black, null as Result, null as WhiteElo, null as BlackElo, null as ECO";
        }

        $query = $query . " order BY year DESC,month DESC,day DESC,Event, Round desc, White, Black limit 10000";
        $data["query"] = $query;
        $data["params"] = $params;
        $searching = $db->prepare($query);
        $db->bind_param($searching, $params);
        $db->execute($searching);
        $result = $db->get_result($searching);
    } else if ($_POST['searching'] == 'fulltext') {
        $query = "SELECT DISTINCT                         
                    $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
                    FROM $table
                    inner join $players_table as t1 on WhiteID = t1.id
                    inner join $players_table as t2 on BlackID = t2.id
                    left join $events_table on $table.EventID = $events_table.id                                       
                    left join $eco_table on $table.ecoID = $eco_table.id
                    WHERE ";
        $toBind = array();
        if (isset($white)) {
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
                $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(? in boolean mode) AND fullname like ? ) ";
            } else {
                $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(?) AND fullname like ? ) ";
            }
            array_push($toBind, $white, $_POST["white"]);
        }
        if (isset($black)) {
            if (sizeof($toBind) > 0) {
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
                $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(? in boolean mode) AND fullname like ? ) ";
            } else {
                $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(?) AND fullname like ? ) ";
            }
            array_push($toBind, $black, $_POST["black"]);
        }
        if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " Year BETWEEN ? and ? ";
            array_push($toBind, $minYear, $maxYear);
        }
        if (isset($event)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " $events_table.name like ? ";
            array_push($toBind, $event);
        }

        if (isset($minEco) && isset($maxEco) && ($minEco != "1" || $maxEco != "500")) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " $eco_table.id BETWEEN  ? AND  ? ";
            array_push($toBind, $minEco, $maxEco);
        }

        if (isset($ignore) && $ignore == "true") {
            $toBindSize = sizeof($toBind);
            $query = $query . "UNION DISTINCT
            SELECT DISTINCT
            $table.id, moves, $events_table.name as Event, $table.Year, $table.Month, $table.Day,  Round, t1.fullname as White, t2.fullname as Black,  Result, WhiteElo, BlackElo, $eco_table.ECO as ECO   
            FROM $table
            inner join $players_table as t1 on WhiteID = t1.id
            inner join $players_table as t2 on BlackID = t2.id
            left join $events_table on $table.EventID = $events_table.id                    
            left join $eco_table on $table.ecoID = $eco_table.id
            WHERE ";
            if (isset($white)) {
                if (sizeof(explode(" ", $white)) > 1) {
                    $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(? in boolean mode) AND fullname like ? ) ";
                } else {
                    $query = $query . " blackid = (SELECT id FROM $players_table WHERE  match(fullname) against(?) AND fullname like ? ) ";
                }
                array_push($toBind, $white, $_POST["white"]);
            }
            if (isset($black)) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }

                if (sizeof(explode(" ", $black)) > 1) {
                    $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(? in boolean mode) AND fullname like ? ) ";
                } else {
                    $query = $query . " whiteid = (SELECT id FROM $players_table WHERE  match(fullname) against(?) AND fullname like ? ) ";
                }
                array_push($toBind, $black, $_POST["black"]);
            }
            if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " Year BETWEEN ? and ? ";
                array_push($toBind, $minYear, $maxYear);
            }
            if (isset($event)) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " $events_table.name like ? ";
                array_push($toBind, $event);
            }
            if (isset($minEco) && isset($maxEco) && ($minEco != "1" || $maxEco != "500")) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " $eco_table.id BETWEEN  ? AND  ? ";
                array_push($toBind, $minEco, $maxEco);
            }
        }
        $query = $query . " order BY year DESC,month DESC,day DESC,Event,Round desc, White, Black limit 10000";
        $searching = $db->prepare($query);
        $db->bind_param($searching, $toBind);
        $db->execute($searching);
        $result = $db->get_result($searching);
    }
}

while ($row = $result->fetch_assoc()) {
    if ($row['id'] != null && $row['id'] != "null") {
        if (isset($_POST['white']) && !empty($_POST['white']) && isset($_POST['black']) && !empty($_POST['black'])) {
            $patterWhite = "/^" . $_POST['white'] . "/i";
            $patterBlack = "/^" . $_POST['black'] . "/i";
            if (preg_match($patterWhite, $row['White']) && preg_match($patterBlack, $row['Black'])) {
                $row['table'] = str_replace("_games", "", $table);
                array_push($data["rows"], $row);
            } else if (isset($ignore) && $ignore == "true") {
                if (preg_match($patterWhite, $row['Black']) && preg_match($patterBlack, $row['White'])) {
                    $row['table'] = str_replace("_games", "", $table);
                    array_push($data["rows"], $row);
                }
            }
        } else if (isset($_POST['white']) && !empty($_POST['white'])) {
            $patterWhite = "/^" . $_POST['white'] . "/i";
            if (preg_match($patterWhite, $row['White'])) {
                $row['table'] = str_replace("_games", "", $table);
                array_push($data["rows"], $row);
            } else if (isset($ignore) && $ignore == "true") {
                if (preg_match($patterWhite, $row['Black'])) {
                    $row['table'] = str_replace("_games", "", $table);
                    array_push($data["rows"], $row);
                }
            }
        } else if (isset($_POST['black']) && !empty($_POST['black'])) {
            $patterBlack = "/^" . $_POST['black'] . "/i";
            if (preg_match($patterBlack, $row['Black'])) {
                $row['table'] = str_replace("_games", "", $table);
                array_push($data["rows"], $row);
            } else if (isset($ignore) && $ignore == "true") {
                if (preg_match($patterBlack, $row['White'])) {
                    $row['table'] = str_replace("_games", "", $table);
                    array_push($data["rows"], $row);
                }
            }
        }
    }
}

print_r(json_encode($data));
$db->close();
