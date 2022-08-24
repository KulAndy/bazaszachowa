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

if (isset($_POST['white']) && !empty($_POST['white'])) {
    $white = $_POST['white'];
}
if (isset($_POST['black']) && !empty($_POST['black'])) {
    $black = $_POST['black'];
}
if (isset($_POST['ignore']) && !empty($_POST['ignore'])) {
    $ignore = $_POST['ignore'];
}
if (isset($_POST['minYear']) && !empty($_POST['minYear'])) {
    $minYear = (int)$_POST['minYear'];
}
if (isset($_POST['maxYear']) && !empty($_POST['maxYear'])) {
    $maxYear = (int)$_POST['maxYear'];
}
if (isset($_POST['event']) && !empty($_POST['event'])) {
    $event = $_POST['event'] . "%";
}
if (isset($_POST['minEco']) && !empty($_POST['minEco'])) {
    $minEco = $_POST['minEco'];
}
if (isset($_POST['maxEco']) && !empty($_POST['maxEco'])) {
    $maxEco = $_POST['maxEco'];
}
if (isset($_POST['searching'])) {
    if ($_POST['searching'] == 'classic') {
        if (isset($white)) {
            $white = $white . "%";
            $white_players = $db->prepare("SELECT fullname FROM $players_table WHERE fullname like ?");
            $white_players->bind_param('s', $white);
            $white_players->execute();
            $result_white = $white_players->get_result();
            $whites = $result_white->fetch_all();
        }
        if (isset($black)) {
            $black = $black . "%";
            $black_players = $db->prepare("SELECT fullname FROM $players_table WHERE fullname like ?");
            $black_players->bind_param('s', $black);
            $black_players->execute();
            $result_black = $black_players->get_result();
            $blacks = $result_black->fetch_all();
        }
        $toBind = array();
        $query = "";
        if (isset($white) && isset($black)) {
            if (sizeof($whites) > 0 && sizeof($blacks) > 0) {
                for ($i = 0; $i < sizeof($whites); $i++) {
                    for ($j = 0; $j < sizeof($blacks); $j++) {
                        if ($i > 0 || $j > 0) {
                            $query .= "\nUNION distinct\n";
                        }
                        $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                        FROM $table WHERE match(white) against(\'+" .
                            str_replace(" ", " +", preg_replace('/\s+/', ' ', $whites[$i][0]))
                            . "\' in boolean mode) and match(black) against(\'+" .
                            str_replace(" ", " +", preg_replace('/\s+/', ' ', $blacks[$j][0]))
                            . "\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like '" . $event . "%'";
                        }
                        if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
                            $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                        }
                    }
                }
                if (isset($ignore) && $ignore == "true") {
                    for ($i = 0; $i < sizeof($whites); $i++) {
                        for ($j = 0; $j < sizeof($blacks); $j++) {
                            $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                            FROM $table WHERE match(white) against(\'+" .
                                str_replace(" ", " +", preg_replace('/\s+/', ' ', $blacks[$j][0]))
                                . "\' in boolean mode) and match(black) against(\'+" .
                                str_replace(" ", " +", preg_replace('/\s+/', ' ', $whites[$i][0]))
                                . "\' in boolean mode)' ;";
                            eval($updateQuery);
                            if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                                $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                            }
                            if (isset($event)) {
                                $query = $query . " and Event like '" . $event . "%'";
                            }
                            if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
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
                for ($i = 0; $i < sizeof($whites); $i++) {
                    if ($i > 0) {
                        $query .= "\nUNION distinct\n";
                    }
                    $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                        FROM $table WHERE match(white) against(\'+" .
                        str_replace(" ", " +", preg_replace('/\s+/', ' ', $whites[$i][0]))
                        . "\' in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                        $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                    }
                    if (isset($event)) {
                        $query = $query . " and Event like '" . $event . "%'";
                    }
                    if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
                        $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                    }
                }
                if (isset($ignore) && $ignore == "true") {
                    for ($i = 0; $i < sizeof($whites); $i++) {
                        $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                            FROM $table WHERE match(black) against(\'+" .
                            str_replace(" ", " +", preg_replace('/\s+/', ' ', $whites[$i][0]))
                            . "\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like '" . $event . "%'";
                        }
                        if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
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
                for ($i = 0; $i < sizeof($blacks); $i++) {
                    if ($i > 0) {
                        $query .= "\nUNION distinct\n";
                    }
                    $updateQuery = "\$query .= 'SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                        FROM $table WHERE match(black) against(\'+" .
                        str_replace(" ", " +", preg_replace('/\s+/', ' ', $blacks[$i][0]))
                        . "\' in boolean mode)' ;";
                    eval($updateQuery);
                    if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                        $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                    }
                    if (isset($event)) {
                        $query = $query . " and Event like '" . $event . "%'";
                    }
                    if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
                        $query = $query . " and CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10)";
                    }
                }
                if (isset($ignore) && $ignore == "true") {
                    for ($i = 0; $i < sizeof($blacks); $i++) {
                        $updateQuery = "\$query .= '\nUNION distinct\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  
                            FROM $table WHERE match(white) against(\'+" .
                            str_replace(" ", " +", preg_replace('/\s+/', ' ', $blacks[$i][0]))
                            . "\' in boolean mode)' ;";
                        eval($updateQuery);
                        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
                            $query = $query . " and Year BETWEEN $minYear and $maxYear ";
                        }
                        if (isset($event)) {
                            $query = $query . " and Event like '" . $event . "%'";
                        }
                        if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
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
        $result = $db->query($query);
    } else if ($_POST['searching'] == 'fulltext') {
        $query = "SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
        $toBind = array();
        if (isset($white)) {
            if (sizeof(explode(" ", $white)) > 1) {
                $white = "+" . str_replace(" ", " +", $white);
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
                $black = "+" . str_replace(" ", " +", $black);
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
        if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
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
            if (isset($minEco) && isset($maxEco) && $minEco != "A00" && $maxEco != "E99") {
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
                $toEval = $toEval . "i";
            } else if ($temp == "string") {
                $toEval = $toEval . "s";
            } else if ($temp == "double") {
                $toEval = $toEval . "d";
            }
        }
        $toEval = $toEval . "\"";
        foreach ($toBind as $param) {
            if (gettype($param) == "integer" || gettype($param) == "string" || gettype($param) == "double") {
                $toEval = $toEval . ", $param";
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
        $row['table'] = str_replace("_games", "", $table);
        array_push($data["rows"], $row);
    }
}

print_r(json_encode($data));
$db->close();
