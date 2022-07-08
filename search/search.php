<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'login_data.inc';
$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

$data = array(
    "rows" => array()
    // "debbug" => array()
);

if (isset($_POST['whiteName']) && !empty($_POST['whiteName'])) {
    $whiteName = $_POST['whiteName'] . ",";
}
if (isset($_POST['whiteLastName']) && !empty($_POST['whiteLastName'])) {
    $whiteLastName = ", " . $_POST['whiteLastName'] . "%";
}
if (isset($_POST['blackName']) && !empty($_POST['blackName'])) {
    $blackName = $_POST['blackName'] . ",";
}
if (isset($_POST['blackLastName']) && !empty($_POST['blackLastName'])) {
    $blackLastName = ", " . $_POST['blackLastName'] . "%";
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
        if (isset($whiteName) || isset($whiteLastName)) {
            if (!isset($whiteName)) {
                $white = "%, ".$_POST['whiteLastName']."%";
            } else if (!isset($whiteLastName)) {
                $white = $_POST['whiteName'] . ",%";
            } else {
                $white =  $_POST['whiteName']. ", " .  $_POST['whiteLastName'];
            }
        }
        if (isset($blackName) || isset($blackLastName)) {
            if (!isset($blackName)) {
                $black = "%, ".$_POST['blackLastName']."%";
            } else if ($blackLastName) {
                $black = $_POST['blackName'] . ",%";
            } else {
                $black = $_POST['blackName']. ", " .  $_POST['blackLastName'];
            }
        }
        $query = "SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
        $toBind = array();
        if (isset($white)) {
            if (isset($ignore) && $ignore ==  "true") {
                $query = $query . " ( white like ? or black like ?)";
                array_push($toBind, "\$white", "\$white");
            } else {
                $query = $query . " white like ?";
                array_push($toBind, "\$white");
            }
        }
        if (isset($black)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }
            if (isset($ignore) && $ignore ==  "true") {
                $query = $query . " ( white like ? or black like ?)";
                array_push($toBind, "\$black", "\$black");
            } else {
                $query = $query . " black like ?";
                array_push($toBind, "\$black");
            }
        }
        if (isset($minYear) && isset($maxYear) && $minYear != 1475 && $maxYear != date("Y")) {
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
        $query = $query . " order BY year DESC,month DESC,day DESC limit 10000";
    } else if ($_POST['searching'] == 'fulltext') {
        $query = "SELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
        $toBind = array();
        if (isset($whiteName) || isset($whiteLastName)) {
            if (!isset($whiteName)) {
                $query = $query . " match(white) against(?) ";
                array_push($toBind, "\$whiteLastName");
            } else if (!isset($whiteLastName)) {
                $query = $query . " match(white) against(?) ";
                array_push($toBind, "\$whiteName");
            } else {
                $query = $query . " match(white) against(?) and match(white) against(?)";
                array_push($toBind, "\$whiteName", "\$whiteLastName");
            }
        }
        if (isset($blackName) || isset($blackLastName)) {
            if (sizeof($toBind) > 0) {
                $query = $query . " and";
            }

            if (!isset($blackName)) {
                $query = $query . " match(black) against(?) ";
                array_push($toBind, "\$blackLastName");
            } else if (!isset($blackLastName)) {
                $query = $query . " match(black) against(?) ";
                array_push($toBind, "\$blackName");
            } else {
                $query = $query . " match(black) against(?) and match(black) against(?)";
                array_push($toBind, "\$blackName", "\$blackLastName");
            }
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
            $query = $query . "UNION ALL\nSELECT id, moves, Event,Site, Year,Month, Day,Round, White, Black, Result, WhiteElo, BlackElo, ECO  FROM $table WHERE ";
            if (isset($whiteName) || isset($whiteLastName)) {
                if (!isset($whiteName)) {
                    $query = $query . " match(black) against(?) ";
                    array_push($toBind, "\$whiteLastName");
                } else if (!isset($whiteLastName)) {
                    $query = $query . " match(black) against(?) ";
                    array_push($toBind, "\$whiteName");
                } else {
                    $query = $query . " match(black) against(?) and match(black) against(?)";
                    array_push($toBind, "\$whiteName", "\$whiteLastName");
                }
            }
            if (isset($blackName) || isset($blackLastName)) {
                if (sizeof($toBind) > 0) {
                    $query = $query . " and";
                }
                if (!isset($blackName)) {
                    $query = $query . " match(white) against(?) ";
                    array_push($toBind, "\$blackLastName");
                } else if (!isset($blackLastName)) {
                    $query = $query . " match(white) against(?) ";
                    array_push($toBind, "\$blackName");
                } else {
                    $query = $query . " match(white) against(?) and match(white) against(?)";
                    array_push($toBind, "\$blackName", "\$blackLastName");
                }
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
            $query = $query . " order BY year DESC,month DESC,day DESC limit 10000";
        } else {
            $query = $query . " order BY year DESC,month DESC,day DESC limit 10000";
        }
    }
}
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
while ($row = $result->fetch_assoc()) {
    $row['table'] = str_replace("_games", "", $table);
    array_push($data["rows"], $row);
}

print_r(json_encode($data));
