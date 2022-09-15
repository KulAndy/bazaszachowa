<?php
echo '<div id="pre"><div id="content" style="text-align: center;width: 90vw;">';
require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}
if (isset($_GET['fullname']) && !empty($_GET['fullname'])) {
    $basicName = htmlspecialchars($_GET['fullname']);
    if( substr($_GET['fullname'], 1,1) == "'" ){
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", substr($_GET['fullname'],2)));
    }
    else{
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $_GET['fullname']));
    }
    $fullname = "+" . str_replace(" ", " +", $fullname);
} else {
    die("Brak zawodnika do wyszukania");
}
echo "<h1 style='margin: 0;margin-bottom: 0.4em;'>$basicName</h1>";
$query = "SELECT max(WhiteElo) as maxElo FROM $table WHERE MATCH(White) against(? in boolean mode) AND White like ? UNION SELECT max(BlackElo) as maxElo FROM $table WHERE MATCH(Black) against(? in boolean mode) AND Black like ?";
$searching = $db->prepare($query);
$searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
$searching->execute();
$searching->store_result();
$elo = false;
if ($searching->num_rows == 1) {
    $searching->bind_result($maxElo);
    while ($searching->fetch()) {
        if ($maxElo != null) {
            echo "<p>najwyższy osiągnięty ranking: $maxElo</p>";
            $elo = true;
        }
    }
} else if ($searching->num_rows == 2) {
    $searching->bind_result($maxElo);
    $max = 0;
    while ($searching->fetch()) {
        if ($maxElo > $max) {
            $max = $maxElo;
        }
    }
    if ($maxElo > 0) {
        echo "<p>najwyższy osiągnięty ranking: $max</p>";
        $elo = true;
    }
}
$query = "SELECT min(Year) as minYear FROM $table WHERE MATCH(White) against(? in boolean mode) AND White like ? UNION SELECT min(Year) as minYear FROM $table WHERE MATCH(Black) against(? in boolean mode) AND Black like ?";
$searching = $db->prepare($query);
$searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname,$_GET['fullname']);
$searching->execute();
$searching->store_result();
$minY = null;
if ($searching->num_rows == 1) {
    $searching->bind_result($minYear);
    while ($searching->fetch()) {
        $minY = $minYear;
    }
} else if ($searching->num_rows == 2) {
    $searching->bind_result($minYear);
    $min = 0;
    while ($searching->fetch()) {
        if ($minYear < $min) {
            $min = $minYear;
        }
    }
    if ($minYear > 0) {
        $minY = $min;
    }
}


$query = "SELECT max(Year) as maxYear FROM $table WHERE MATCH(White) against(? in boolean mode) AND White like ? UNION SELECT max(Year) as maxYear FROM $table WHERE MATCH(Black) against(? in boolean mode) AND Black like ?";
$searching = $db->prepare($query);
$searching->bind_param('ssss', $fullname,$_GET['fullname'], $fullname,$_GET['fullname']);
$searching->execute();
$searching->store_result();
$maxY = null;
if ($searching->num_rows == 1) {
    $searching->bind_result($maxYear);
    while ($searching->fetch()) {
        $maxY = $maxYear;
    }
} else if ($searching->num_rows == 2) {
    $searching->bind_result($maxYear);
    $max = 0;
    while ($searching->fetch()) {
        if ($maxYear > $max) {
            $max = $maxYear;
        }
    }
    if ($maxYear > 0) {
        $maxY = $max;
    }
}
if ($minY != null && $maxY != null) {
    echo "<p>gry z lat: $minY - $maxY</p>";
}

$whitesOpening = array(
    "Alechin" => array(
        "B02", "B05"
    ),
    "Benoni" => array(
        "A56", "A79"
    ),
    "Katalońska" => array(
        "E00", "E09"
    ),
    "Caro-Kann" => array(
        "B10", "B19"
    ),
    "Angielska" => array(
        "A10", "A39"
    ),
    "Francuzka" => array(
        "C00", "C19"
    ),
    "Grunfeld" => array(
        "D70", "D99"
    ),
    "Holenderska" => array(
        "A80", "A99"
    ),
    "Włoska" => array(
        "C50", "C59"
    ),
    "Debiut gońca" => array(
        "C23", "C24"
    ),
    "Królewskie Fianchetto" => array(
        "B06", "B06"
    ),
    "Gambit królewski" => array(
        "C30", "C39"
    ),
    "Debiut skoczka królewskiego" => array(
        "C40", "C40"
    ),
    "Philidor" => array(
        "C41", "C41"
    ),
    "Debiut trzech skoczków" => array(
        "C46", "C46"
    ),
    "Debiut czterech skoczków" => array(
        "C47", "C49"
    ),
    "Królewsko-indyjska" => array(
        "E60", "E99"
    ),
    "Debiut pionka królewskiego" => array(
        "C20", "C22"
    ),
    "Nimzowitsch" => array(
        "E20", "E59"
    ),
    "staroindyjska" => array(
        "A53", "A55"
    ),
    "Pirc" => array(
        "B07", "B09"
    ),
    "Przyjęty gambit hetmański" => array(
        "D20", "D29"
    ),
    "Hetmańsko-indyjska" => array(
        "E12", "E19"
    ),
    "Gambit hetmański" => array(
        "D30", "D69"
    ),
    "Debiut pionka hetmańskiego bez 1.d4" => array(
        "A40", "A52"
    ),
    "Debiut pionka hetmańskiego po 1.d4 i ...d5" => array(
        "D00", "D09"
    ),
    "Debiut pionka hetmańskiego po 1.d4 bez ...d5" => array(
        "E10", "E10"
    ),
    "Reti" => array(
        "A09", "A09"
    ),
    "Rosyjska" => array(
        "C42", "C43"
    ),
    "Hiszpańska" => array(
        "C60", "C99"
    ),
    "Skandynawska" => array(
        "B01", "B01"
    ),
    "Sycylijska" => array(
        "B20", "B99"
    ),
    "Słowiańska" => array(
        "D10", "D19"
    ),
    // "Półsłowiańska" => array(
    //     "D43", "D49"
    // ),
    "Szkocka" => array(
        "C44", "C45"
    ),
    // "Tarrasch" => array(
    //     "D32", "D35"
    // ),
    "Bogoljubow" => array(
        "E11", "E11"
    ),
    "Wiedeńska" => array(
        "C25", "C29"
    ),
    "Różne bez 1.e4 i 1.d4" => array(
        "A00", "A08"
    ),
    "Różne po e4" => array(
        "B00", "B00"
    )
);
$blackOpening = array(
    "Alechin" => array(
        "B02", "B05"
    ),
    "Benoni" => array(
        "A56", "A79"
    ),
    "Katalońska" => array(
        "E00", "E09"
    ),
    "Caro-Kann" => array(
        "B10", "B19"
    ),
    "Angielska" => array(
        "A10", "A39"
    ),
    "Francuzka" => array(
        "C00", "C19"
    ),
    "Grunfeld" => array(
        "D70", "D99"
    ),
    "Holenderska" => array(
        "A80", "A99"
    ),
    "Włoska" => array(
        "C50", "C59"
    ),
    "Debiut gońca" => array(
        "C23", "C24"
    ),
    "Królewskie Fianchetto" => array(
        "B06", "B06"
    ),
    "Gambit królewski" => array(
        "C30", "C39"
    ),
    "Debiut skoczka królewskiego" => array(
        "C40", "C40"
    ),
    "Philidor" => array(
        "C41", "C41"
    ),
    "Debiut trzech skoczków" => array(
        "C46", "C46"
    ),
    "Debiut czterech skoczków" => array(
        "C47", "C49"
    ),
    "Królewsko-indyjska" => array(
        "E60", "E99"
    ),
    "Debiut pionka królewskiego" => array(
        "C20", "C22"
    ),
    "Nimzowitsch" => array(
        "E20", "E59"
    ),
    "staroindyjska" => array(
        "A53", "A55"
    ),
    "Pirc" => array(
        "B07", "B09"
    ),
    "Przyjęty gambit hetmański" => array(
        "D20", "D29"
    ),
    "Hetmańsko-indyjska" => array(
        "E12", "E19"
    ),
    "Gambit hetmański" => array(
        "D30", "D69"
    ),
    "Debiut pionka hetmańskiego bez 1.d4" => array(
        "A40", "A52"
    ),
    "Debiut pionka hetmańskiego po 1.d4 i ...d5" => array(
        "D00", "D09"
    ),
    "Debiut pionka hetmańskiego po 1.d4 bez ...d5" => array(
        "E10", "E10"
    ),
    "Reti" => array(
        "A09", "A09"
    ),
    "Rosyjska" => array(
        "C42", "C43"
    ),
    "Hiszpańska" => array(
        "C60", "C99"
    ),
    "Skandynawska" => array(
        "B01", "B01"
    ),
    "Sycylijska" => array(
        "B20", "B99"
    ),
    "Słowiańska" => array(
        "D10", "D19"
    ),
    // "Półsłowiańska" => array(
    //     "D43", "D49"
    // ),
    "Szkocka" => array(
        "C44", "C45"
    ),
    // "Tarrasch" => array(
    //     "D32", "D35"
    // ),
    "Bogoljubow" => array(
        "E11", "E11"
    ),
    "Wiedeńska" => array(
        "C25", "C29"
    ),
    "Różne bez 1.e4 i 1.d4" => array(
        "A00", "A08"
    ),
    "Różne po e4" => array(
        "B00", "B00"
    )
);
$whiteGames = 0;
$whitesOpening2 = array();
$queenPawnIndex = null;
$variousIndex = null;
$i = 0;
foreach ($whitesOpening as $opening => &$codes) {
    $query = "SELECT COUNT(*) as sum FROM all_games WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV('" . $codes[0] . "', 16, 10) AND CONV( '" . $codes[1] . "', 16, 10) AND White LIKE ? ";
    $searching = $db->prepare($query);
    $searching->bind_param('ss', $fullname, $_GET['fullname']);
    $searching->execute();
    $searching->store_result();
    $searching->bind_result($sum);
    while ($searching->fetch()) {
        if ($sum == 0) {
            unset($whitesOpening[$opening]);
        } else {
            if (preg_match("/Debiut pionka hetmańskiego/", $opening)) {
                if ($queenPawnIndex == null) {
                    $queenPawnIndex = $i;
                    array_push($whitesOpening2, array("Debiut pionka hetmańskiego", $sum));
                } else {
                    $whitesOpening2[$queenPawnIndex][1] += $sum;
                }
            } else if (preg_match("/Różne/", $opening)) {
                if ($variousIndex == null) {
                    $variousIndex = $i;
                    array_push($whitesOpening2, array("Różne", $sum));
                } else {
                    $whitesOpening2[$variousIndex][1] += $sum;
                }
            } else {
                array_push($whitesOpening2, array($opening, $sum, $codes[0], $codes[1]));
            }
            $whiteGames += $sum;
            $i++;
        }
    }
}
do {
    $swapped = false;
    for ($i = 0, $c = count($whitesOpening2) - 1; $i < $c; $i++) {
        if ($whitesOpening2[$i][1] < $whitesOpening2[$i + 1][1]) {
            list($whitesOpening2[$i + 1], $whitesOpening2[$i]) =
                array($whitesOpening2[$i], $whitesOpening2[$i + 1]);
            $swapped = true;
        }
    }
} while ($swapped);
$blackGames = 0;
$blacksOpening2 = array();
$queenPawnIndex = null;
$variousIndex = null;
$i = 0;
foreach ($blackOpening as $opening => &$codes) {
    $query = "SELECT COUNT(*) FROM all_games WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( '" . $codes[0] . "', 16, 10) AND CONV( '" . $codes[1] . "', 16, 10) AND Black like ?";
    $searching = $db->prepare($query);
    $searching->bind_param('ss', $fullname,$_GET['fullname']);
    $searching->execute();
    $searching->store_result();
    $searching->bind_result($sum);
    while ($searching->fetch()) {
        if ($sum == 0) {
            unset($blackOpening[$opening]);
        } else {
            if (preg_match("/Debiut pionka hetmańskiego/", $opening)) {
                if ($queenPawnIndex == null) {
                    $queenPawnIndex = $i;
                    array_push($blacksOpening2, array("Debiut pionka hetmańskiego", $sum));
                } else {
                    $blacksOpening2[$queenPawnIndex][1] += $sum;
                }
            } else if (preg_match("/Różne/", $opening)) {
                if ($variousIndex == null) {
                    $variousIndex = $i;
                    array_push($blacksOpening2, array("Różne", $sum));
                } else {
                    $blacksOpening2[$variousIndex][1] += $sum;
                }
            } else {
                array_push($blacksOpening2, array($opening, $sum, $codes[0], $codes[1]));
            }
            $blackGames += $sum;
            $i++;
        }
    }
}
do {
    $swapped = false;
    for ($i = 0, $c = count($blacksOpening2) - 1; $i < $c; $i++) {
        if ($blacksOpening2[$i][1] < $blacksOpening2[$i + 1][1]) {
            list($blacksOpening2[$i + 1], $blacksOpening2[$i]) =
                array($blacksOpening2[$i], $blacksOpening2[$i + 1]);
            $swapped = true;
        }
    }
} while ($swapped);

echo "<table style='border: 0;'><tr style='display:flex;'><td style='border: 0;'><table><tr><th>debiut</th><th>ilość</th><th>%</th><th>filtr</th></tr>
<tr><th colspan='4'>Białe</th></tr>";
if (sizeof($whitesOpening2) == 0) {
    echo "<tr><td colspan='4'>Brak partii</td></tr>";
} else {
    foreach ($whitesOpening2 as $opening) {
        if (!empty($opening[0])) {
            echo "<tr><td>" . $opening[0] . "</td><td>" . $opening[1] . "</td><td>" . round($opening[1] / $whiteGames * 100, 2) .
                "</td><td><a target='_self' href='/player_data/?fullname=" . urlencode($basicName) . "&color=white&";
            if ($opening[0] == "Różne") {
                echo "exception=various";
            } else if ($opening[0] == "Debiut pionka hetmańskiego") {
                echo "exception=queenPawn";
            } else {
                echo "minEco=" . $opening[2] . "&maxEco=" . $opening[3];
            }
            echo "'>filtruj</a></td></tr>";
        }
    }
}
echo "<tr><td>suma</td><td colspan='2'>$whiteGames</td><td><a target='_self' href='/player_data/?fullname=" . urlencode($basicName) . "&color=white&minEco=A00&maxEco=E99'>filtruj</a></td></tr>
<tr><th colspan='4'>Czarne</th></tr>";
if (sizeof($whitesOpening2) == 0) {
    echo "<tr><td colspan='4'>Brak partii</td></tr>";
} else {
    foreach ($blacksOpening2 as $opening) {
        if (!empty($opening[0])) {
            echo "<tr><td>" . $opening[0] . "</td><td>" . $opening[1] . "</td><td>" . round($opening[1] / $whiteGames * 100, 2) .
                "</td><td><a target='_self' href='/player_data/?fullname=" . urlencode($basicName) . "&color=black&";
            if ($opening[0] == "Różne") {
                echo "exception=various";
            } else if ($opening[0] == "Debiut pionka hetmańskiego") {
                echo "exception=queenPawn";
            } else {
                echo "minEco=" . $opening[2] . "&maxEco=" . $opening[3];
            }
            echo "'>filtruj</a></td></tr>";
        }
    }
}
echo "<tr><td>suma</td><td colspan='2'>$blackGames</td><td><a target='_self' href='/player_data/?fullname=" . urlencode($basicName) . "&color=black&minEco=A00&maxEco=E99'>filtruj</a></td></tr>
        <tr><td>suma</td><td colspan='2'>" . ($whiteGames + $blackGames) . "</td><td><a target='_self' href='/player_data/?fullname=" . urlencode($basicName) . "'>resetuj filtr</a></td></tr>";
echo "</table></td><td style='border: 0;'>";
if ($elo) {
    echo "<img id='graph' onerror='this.remove()' src='/player_data/graph.php?name=" . urlencode($basicName) . "'>";
}
echo "</tr></table>";
if (isset($_GET['color']) && !empty($_GET['color'])  && ((isset($_GET['minEco']) && !empty($_GET['minEco']) && isset($_GET['maxEco']) && !empty($_GET['maxEco'])) || (isset($_GET['exception']) && !empty($_GET['exception'])))) {
    $color = $_GET['color'];
    if (preg_match("/[A-E][0-9][0-9]/", $_GET['minEco'])  && preg_match("/[A-E][0-9][0-9]/", $_GET['maxEco'])) {
        $minEco = $_GET['minEco'];
        $maxEco = $_GET['maxEco'];
        if ($color == "white") {
            $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10) AND White like ? order BY year DESC,month DESC,day DESC limit 10000";
        } else if ($color == "black") {
            $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( '$minEco', 16, 10) AND CONV( '$maxEco', 16, 10) AND Black like ? order BY year DESC,month DESC,day DESC limit 10000";
        }
        $searching = $db->prepare($query);
        $searching->bind_param('ss', $fullname, $_GET['fullname']);
    } else if (isset($_GET['exception']) && !empty($_GET['exception'])) {
        $exception = $_GET['exception'];
        if ($color == "white") {
            if ($exception == "various") {
                $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'A00', 16, 10) AND CONV( 'A08', 16, 10) AND White like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'B00', 16, 10) AND CONV( 'B00', 16, 10) AND White like ? order BY year DESC,month DESC,day DESC limit 10000";
                $searching = $db->prepare($query);
                $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
            } else if ($exception == "queenPawn") {
                $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'A40', 16, 10) AND CONV( 'A52', 16, 10) AND White like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'D00', 16, 10) AND CONV( 'D09', 16, 10) AND White like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'E10', 16, 10) AND CONV( 'E10', 16, 10) AND White like ? order BY year DESC,month DESC,day DESC limit 10000";
                $searching = $db->prepare($query);
                $searching->bind_param('ssssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
            }
        } else if ($color == "black") {
            if ($exception == "various") {
                $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'A00', 16, 10) AND CONV( 'A08', 16, 10) AND Black like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'B00', 16, 10) AND CONV( 'B00', 16, 10) AND Black like ? order BY year DESC,month DESC,day DESC limit 10000";
                $searching = $db->prepare($query);
                $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
            } else if ($exception == "queenPawn") {
                $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'A40', 16, 10) AND CONV( 'A52', 16, 10) AND Black like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'D00', 16, 10) AND CONV( 'D09', 16, 10) AND Black like ? UNION distinct SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( 'E10', 16, 10) AND CONV( 'E10', 16, 10) order BY year DESC,month DESC,day AND Black like ? DESC limit 10000";
                $searching = $db->prepare($query);
                $searching->bind_param('ssssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
            }
        }
    }
} else {
    $query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) AND White like ? UNION SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) AND Black like ? order BY year DESC,month DESC,day DESC limit 10000";
    $searching = $db->prepare($query);
    $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
}
$searching->execute();
$searching->store_result();
$searching->bind_result($id, $White, $WhiteElo, $Black, $BlackElo, $Result, $Year, $Month, $Day, $Event, $ECO);
echo "<table id='table'>";
echo "<caption>Znaleziono " . $searching->num_rows . " partii";
echo "<tr><th>Biały</th><th class='not_mobile'>Elo białego</th><th>Czarny</th><th class='not_mobile'>Elo czarnego</th><th style='width: 3.25em;'>Wynik</th><th style='width: 2.5em;'>Data</th><th class='not_mobile'>Turniej</th><th class='not_mobile' style='width: 2.5em;'>ECO</th><th>Zobacz partię</th><th>RAW</th><tr>";
$i = 0;
while ($searching->fetch()) {
    echo "<tr style='background-color:";
    if ($i % 2 == 0) {
        echo "lemonchiffon;'";
    } else {
        echo "lightcyan;'";
    }
    echo "><td>$White</td><td class='not_mobile'>$WhiteElo</td><td>$Black</td><td class='not_mobile'>$BlackElo</td><td>$Result</td>";
    $Date = $Year . "";
    if ($Month = null || $Month == "?") {
        $Date .= "??";
    } else {
        $Date .= $Month;
    }
    if ($Day = null || $Day == "?") {
        $Date .= "??";
    } else {
        $Date .= $Day;
    }
    echo "<td>$Date</td><td class='not_mobile'>$Event</td><td class='not_mobile'>$ECO</td><td><a href='/game/index.php?id=$id&table=all'>zobacz</a></td><td><a href='/game_raw/index.php?id=$id&table=all'>zobacz</a></td></tr>";
    $i++;
}
echo "</table>";
echo '</div></div>';
