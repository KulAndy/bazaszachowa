<?php

require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

$db->set_charset("utf8");
$data = array(
    "rows" => array(),
);

$data['base'] = $_POST['base'];

if (isset($_POST['white']) && !empty($_POST['white'])) {
    $white = $_POST['white'];
    $data['white'] = $white;
} else {
    $data['white'] = null;
}
if (isset($_POST['black']) && !empty($_POST['black'])) {
    $black = $_POST['black'];
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
if (isset($_POST['minEco']) && !empty($_POST['minEco']) &&  preg_match("/^[A-E][0-9][0-9]$/", $_POST['minEco'])) {
    $minEco = $_POST['minEco'];
    $data['minEco'] = $minEco;
} else {
    $data['minEco'] = null;
}
if (isset($_POST['maxEco']) && !empty($_POST['maxEco']) && preg_match("/^[A-E][0-9][0-9]$/", $_POST['maxEco'])) {
    $maxEco = $_POST['maxEco'];
    $data['maxEco'] = $maxEco;
} else {
    $data['maxEco'] = null;
}

if (isset($_POST['searching'])) {
    $data['searching'] = $_POST['searching'];
    if ($_POST['searching'] == 'classic') {
        if (isset($white)) {
            $white = $white . "%";
            $white_players = $db->prepare("SELECT CASE WHEN length(substring_index(fullname, '\'', 1)) = 1 THEN REPLACE(REPLACE(fullname, LEFT(fullname, 2), ''), '\'', ' ') ELSE REPLACE(fullname, '\'', ' ') END FROM $players_table WHERE fullname like ?");
            $white_players->bind_param('s', $white);
            $white_players->execute();
            $result_white = $white_players->get_result();
            $whites = $result_white->fetch_all();
            foreach ($whites as &$player) {
                $playerName = $player[0];
                $playerName = preg_replace("/ \w?\.*$/", "", $playerName);
                $playerName = preg_replace("/\(.*/", "", $playerName);
                $playerName = preg_replace("/,$/", "", $playerName);
                $playerName =  preg_replace('/\s+/', ' ', str_replace(
                    "-",
                    " ",
                    $playerName
                ));
                $playerName = preg_replace("/ *$/", "", $playerName);
                $playerName = preg_replace("/(^| |')\w{0,2}($| |')/", "", $playerName);
                $playerName = str_replace(
                    " ",
                    " +",
                    $playerName
                );
                $player = $playerName;
            }
            $whites = array_unique($whites);
        }
        if (isset($black)) {
            $black = $black . "%";
            $black_players = $db->prepare("SELECT CASE WHEN length(substring_index(fullname, '\'', 1)) = 1 THEN REPLACE(REPLACE(fullname, LEFT(fullname, 2), ''), '\'', ' ') ELSE REPLACE(fullname, '\'', ' ') END FROM $players_table WHERE fullname like ?");
            $black_players->bind_param('s', $black);
            $black_players->execute();
            $result_black = $black_players->get_result();
            $blacks = $result_black->fetch_all();
            foreach ($blacks as &$player) {
                $playerName = $player[0];
                $playerName = preg_replace("/ \w?\.*$/", "", $playerName);
                $playerName = preg_replace("/\(.*/", "", $playerName);
                $playerName = preg_replace("/,$/", "", $playerName);
                $playerName =  preg_replace('/\s+/', ' ', str_replace(
                    "-",
                    " ",
                    $playerName
                ));
                $playerName = preg_replace("/ *$/", "", $playerName);
                $playerName = preg_replace("/(^| |')\w{0,2}($| |')/", "", $playerName);
                $playerName = str_replace(
                    " ",
                    " +",
                    $playerName
                );
                $player = $playerName;
            }
            $blacks = array_unique($blacks);
        }
        $toBind = array();
        $query = "";
        if (isset($white) && isset($black)) {
            if (sizeof($whites) > 0 && sizeof($blacks) > 0) {
                foreach ($whites as $white) {
                    foreach ($blacks as $black) {
                        if ($white != $whites[0] || $black != $blacks[0]) {
                            $query .= "
                            UNION distinct
                            ";
                        }
                        $updateQuery = "\$query .= 'SELECT 
                        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                        FROM $table 
                        inner join $players_table as t1 on WhiteID = t1.id 
                        inner join $players_table as t2 on BlackID = t2.id 
                        WHERE match(t1.fullname) against(\'+$white\' in boolean mode) and match(t2.fullname) against(\'+$black\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear)) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like ? ";
                        }
                        if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                            $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                        }
                    }
                }
                if (isset($ignore) && $ignore == "true") {
                    foreach ($whites as $white) {
                        foreach ($blacks as $black) {
                            $updateQuery = "\$query .= '
                            UNION distinct
                            SELECT 
                            $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                            FROM $table 
                            inner join $players_table as t1 on WhiteID = t1.id 
                            inner join $players_table as t2 on BlackID = t2.id 
                            WHERE match(t1.fullname) against(\'+$black\' in boolean mode) and match(t2.fullname) against(\'+$white\' in boolean mode)' ;";
                            eval($updateQuery);
                            if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                                $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                            }
                            if (isset($event)) {
                                $query = $query . " and Event like ?";
                            }
                            if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                                $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                            }
                        }
                    }
                }
            } else {
                $query = "SELECT null as id, null as moves, null as Event,null as Site, null as Year, null as Month, null as Day, null as Round,";
                $query .= "null as White, null as Black, null as Result, null as WhiteElo, null as BlackElo, null as ECO";
            }
        } else if (isset($white)) {
            if (sizeof($whites) > 0) {
                foreach ($whites as $white) {
                    if ($white != $whites[0]) {
                        $query .= "
                        UNION distinct
                        ";
                    }
                    $updateQuery = "\$query .= 'SELECT 
                    $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                    FROM $table 
                    inner join $players_table as t1 on WhiteID = t1.id 
                    inner join $players_table as t2 on BlackID = t2.id 
                    WHERE match(t1.fullname) against(\"+$white\" in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                        $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                    }
                    if (isset($event)) {
                        $query = $query . " and Event like ? ";
                    }
                    if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                        $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                    }
                }

                if (isset($ignore) && $ignore == "true") {
                    foreach ($whites as $white) {
                        $updateQuery = "\$query .= '
                        UNION distinct
                        SELECT 
                        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                        FROM $table 
                        inner join $players_table as t1 on WhiteID = t1.id 
                        inner join $players_table as t2 on BlackID = t2.id 
                        WHERE match(t2.fullname) against(\'+$white\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like ? ";
                        }
                        if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                            $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                        }
                    }
                }
            } else {
                $query = "SELECT null as id, null as moves, null as Event,null as Site, null as Year, null as Month, null as Day, null as Round,";
                $query .= "null as White, null as Black, null as Result, null as WhiteElo, null as BlackElo, null as ECO";
            }
        } else if (isset($black)) {
            if (sizeof($blacks) > 0) {
                foreach ($blacks as $black) {
                    if ($black != $blacks[0]) {
                        $query .= "
                        UNION distinct
                        ";
                    }
                    $updateQuery = "\$query .= 'SELECT 
                    $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                    FROM $table 
                    inner join $players_table as t1 on WhiteID = t1.id 
                    inner join $players_table as t2 on BlackID = t2.id 
                    WHERE match(t2.fullname) against(\"+$black\" in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                        $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                    }
                    if (isset($event)) {
                        $query = $query . " and Event like ? ";
                    }
                    if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                        $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                    }
                }

                if (isset($ignore) && $ignore == "true") {
                    foreach ($blacks as $black) {
                        $updateQuery = "\$query .= '
                        UNION distinct
                        SELECT 
                        $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                        FROM $table 
                        inner join $players_table as t1 on WhiteID = t1.id 
                        inner join $players_table as t2 on BlackID = t2.id                         
                        WHERE match(t1.fullname) against(\'+$black\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like ? ";
                        }
                        if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                            $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                        }
                    }
                }
            } else {
                $query = "SELECT null as id, null as moves, null as Event,null as Site, null as Year, null as Month, null as Day, null as Round,";
                $query .= "null as White, null as Black, null as Result, null as WhiteElo, null as BlackElo, null as ECO";
            }
        }
        $query = $query . " order BY year DESC,month DESC,day DESC,Round desc, Event, White, Black limit 10000";
        if (isset($event)) {
            $searching = $db->prepare($query);
            if (isset($ignore) && $ignore == "true") {
                $searching->bind_param('ss', $event, $event);
            } else {
                $searching->bind_param('s', $event);
            }
            $searching->execute();
            $result = $searching->get_result();
        } else {
            $result = $db->query($query);
        }
    } else if ($_POST['searching'] == 'fulltext') {
        $query = "SELECT                         
                    $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
                    FROM $table 
                    inner join $players_table as t1 on WhiteID = t1.id 
                    inner join $players_table as t2 on BlackID = t2.id 
                    WHERE ";
        $toBind = array();
        if (isset($white)) {
            if (sizeof(explode(" ", $white)) > 1) {
                $white = "+" . str_replace(
                    " ",
                    " +",
                    preg_replace(
                        "/(^| |')\w{0,2}($| |')/",
                        "",
                        preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $white))))
                    )
                );
                $query = $query . " match(t1.fullname) against(? in boolean mode) ";
            } else {
                $query = $query . " match(t1.fullname) against(?) ";
            }
            array_push($toBind, "\$white");
        }
        if (isset($black)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }

            if (sizeof(explode(" ", $black)) > 1) {
                $black = "+" . str_replace(
                    " ",
                    " +",
                    preg_replace(
                        "/(^| |')\w{0,2}($| |')/",
                        "",
                        preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $black))))
                    )
                );
                $query = $query . " match(t2.fullname) against(? in boolean mode) ";
            } else {
                $query = $query . " match(t2.fullname) against(?) ";
            }
            array_push($toBind, "\$black");
        }
        if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " Year BETWEEN ? and ? ";
            array_push($toBind, "\$minYear", "\$maxYear");
        }
        if (isset($event)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " Event like ?";
            array_push($toBind, "\$event");
        }
        if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            $query = $query . " CONV(eco, 16, 10) BETWEEN CONV( ?, 16, 10) AND CONV( ?, 16, 10)";
            array_push($toBind, "\$minEco", "\$maxEco");
        }
        if (isset($ignore) && $ignore ==  "true") {
            $toBindSize = sizeof($toBind);
            $query = $query . "UNION DISTINCT
            SELECT 
            $table.id, moves, Event,Site, Year,Month, Day,Round, t1.fullname as White, t2.fullname as Black, Result, WhiteElo, BlackElo, ECO   
            FROM $table 
            inner join $players_table as t1 on WhiteID = t1.id 
            inner join $players_table as t2 on BlackID = t2.id 
            WHERE ";
            if (isset($white)) {
                $white =
                    str_replace(".", "", $white);
                $white = preg_replace("/(^| |')\+\w{0,2}($| |')/", "", $white);
                if (sizeof(explode(" ", $white)) > 1) {
                    $query = $query . " match(t2.fullname) against(? in boolean mode) ";
                } else {
                    $query = $query . " match(t2.fullname) against(?) ";
                }
                array_push($toBind, "\$white");
            }
            if (isset($black)) {
                $black =
                    str_replace(".", "", $black);
                $black = preg_replace("/(^| |')\+\w{0,2}($| |')/", "", $black);
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }

                if (sizeof(explode(" ", $black)) > 1) {
                    $query = $query . " match(t1.fullname) against(? in boolean mode) ";
                } else {
                    $query = $query . " match(t1.fullname) against(?) ";
                }
                array_push($toBind, "\$black");
            }
            if (isset($minYear) && isset($maxYear) && ($minYear != 1475 || $maxYear != date("Y"))) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " Year BETWEEN ? and ? ";
                array_push($toBind, "\$minYear", "\$maxYear");
            }
            if (isset($event)) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " Event like ?";
                array_push($toBind, "\$event");
            }
            if (isset($minEco) && isset($maxEco) && ($minEco != "A00" || $maxEco != "E99")) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }
                $query = $query . " CONV(eco, 16, 10) BETWEEN CONV( ?, 16, 10) AND CONV( ?, 16, 10)";
                array_push($toBind, "\$minEco", "\$maxEco");
            }
        }
        $query = $query . " order BY year DESC,month DESC,day DESC,Round desc, Event, White, Black limit 10000";
        $searching = $db->prepare($query);
        $toEval = "\$searching -> bind_param(\"";
        foreach ($toBind as $param) {
            eval("\$temp = gettype($param);");
            if ($temp == "integer") {
                $toEval .= "i";
            } else if ($temp == "string") {
                $toEval .= "s";
            } else if ($temp == "double") {
                $toEval .= "d";
            }
        }
        $toEval = $toEval . "\"";
        foreach ($toBind as $param) {
            if (gettype($param) == "integer" || gettype($param) == "string" || gettype($param) == "double") {
                $toEval .= ", $param";
            }
        }
        $toEval = $toEval . ");";
        eval($toEval);
        $searching->execute();
        $result = $searching->get_result();
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