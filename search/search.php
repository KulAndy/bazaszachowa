<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

$db->set_charset("utf8");
$data = array(
    "rows" => array()
    // "debbug" => array()
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

if (isset($_POST['minYear']) && !empty($_POST['minYear'])) {
    $minYear = (int)$_POST['minYear'];
    $data['minYear'] = $minYear;
} else {
    $data['minYear'] = null;
}
if (isset($_POST['maxYear']) && !empty($_POST['maxYear'])) {
    $maxYear = (int)$_POST['maxYear'];
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
                            $query .= "\nUNION distinct\n";
                        }
                        $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE match(white) against(\'+$white\' in boolean mode) and match(black) against(\'+$black\' in boolean mode)' ;";
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
                            $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE match(white) against(\'+$black\' in boolean mode) and match(black) against(\'+$white\' in boolean mode)' ;";
                            eval($updateQuery);
                            if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
                        $query .= "\nUNION distinct\n";
                    }
                    $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table WHERE match(white) against(\"+$white\" in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
                        $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table WHERE match(black) against(\'+$white\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
                        $query .= "\nUNION distinct\n";
                    }
                    $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table WHERE match(black) against(\"+$black\" in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
                        $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO FROM $table WHERE match(white) against(\'+$black\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
        $query = $query . " order BY year DESC,month DESC,day DESC limit 10000";
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
        $query = "SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
        $toBind = array();
        if (isset($white)) {
            if (sizeof(explode(" ", $white)) > 1) {
                $white = "+" . str_replace(" ", " +", preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $white)))));
                $query = $query . " match(white) against(? in boolean mode) ";
            } else {
                $query = $query . " match(white) against(?) ";
            }
            array_push($toBind, "\$white");
        }
        if (isset($black)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }

            if (sizeof(explode(" ", $black)) > 1) {
                $black = "+" . str_replace(" ", " +", preg_replace('/\s+/', ' ', str_replace("-", " ", preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $black)))));
                $query = $query . " match(black) against(? in boolean mode) ";
            } else {
                $query = $query . " match(black) against(?) ";
            }
            array_push($toBind, "\$black");
        }
        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date('Y')) {
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
            $query = $query . "UNION ALL\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
            if (isset($white)) {
                if (sizeof(explode(" ", $white)) > 1) {
                    $query = $query . " match(black) against(? in boolean mode) ";
                } else {
                    $query = $query . " match(black) against(?) ";
                }
                array_push($toBind, "\$white");
            }
            if (isset($black)) {
                if (sizeof($toBind) > $toBindSize) {
                    $query = $query . " and";
                }

                if (sizeof(explode(" ", $black)) > 1) {
                    $query = $query . " match(white) against(? in boolean mode) ";
                } else {
                    $query = $query . " match(white) against(?) ";
                }
                array_push($toBind, "\$black");
            }
            if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date('Y')) {
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
        $query = $query . " order BY year DESC,month DESC,day DESC limit 10000";
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

$data['debbug'] = $_POST;
print_r(json_encode($data));
$db->close();