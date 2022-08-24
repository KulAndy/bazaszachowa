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
    $fullname = "+" . str_replace(" ", " +", $_GET['fullname']);
} else {
    die("Brak zawodnika do wyszukania");
}
echo "<h1 style='margin: 0;margin-bottom: 0.4em;'>$basicName</h1>";
$query = "SELECT max(WhiteElo) as maxElo FROM $table WHERE MATCH(White) against(? in boolean mode) UNION SELECT max(BlackElo) as maxElo FROM $table WHERE MATCH(Black) against(? in boolean mode)";
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $fullname);
$searching->execute();
$searching->store_result();
if ($searching->num_rows == 1) {
    $searching->bind_result($maxElo);
    while ($searching->fetch()) {
        echo "<p>najwyższy osiągnięty ranking: $maxElo</p>";
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
    }
}

$query = "SELECT min(Year) as minYear FROM $table WHERE MATCH(White) against(? in boolean mode) UNION SELECT min(Year) as minYear FROM $table WHERE MATCH(Black) against(? in boolean mode)";
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $fullname);
$searching->execute();
$searching->store_result();
$minY = null;
if ($searching->num_rows == 1) {
    $searching->bind_result($minYear);
    while ($searching->fetch()) {
        $minY = $minYear;
        // echo "<p>Najstarsza partia jest z roku $minYear</p>";
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
        // echo "<p>Najstarsza partia jest z roku $min</p>";
    }
}


$query = "SELECT max(Year) as maxYear FROM $table WHERE MATCH(White) against(? in boolean mode) UNION SELECT max(Year) as maxYear FROM $table WHERE MATCH(Black) against(? in boolean mode)";
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $fullname);
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
if( $minY != null && $maxY != null){
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
    "Królewsko-indian" => array(
        "E70", "E99"
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
    "Debiut pionka hetmańskiego1" => array(
        "A45", "A52"
    ),
    "Debiut pionka hetmańskiego2" => array(
        "D00", "D09"
    ),
    "Debiut pionka hetmańskiego3" => array(
        "A40", "A44"
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
    "Półsłowiańska" => array(
        "D43", "D49"
    ),
    "Szkocka" => array(
        "C44", "C45"
    ),
    "Tarrasch" => array(
        "D32", "D35"
    ),
    "Wiedeńska" => array(
        "C25", "C29"
    ),
    "Różne1" => array(
        "A00", "A08"
    ),
    "Różne2" => array(
        "B00", "B00"
    ),
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
    "Królewsko-indian" => array(
        "E70", "E99"
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
    "Debiut pionka hetmańskiego1" => array(
        "A45", "A52"
    ),
    "Debiut pionka hetmańskiego2" => array(
        "D00", "D09"
    ),
    "Debiut pionka hetmańskiego3" => array(
        "A40", "A44"
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
    "Półsłowiańska" => array(
        "D43", "D49"
    ),
    "Szkocka" => array(
        "C44", "C45"
    ),
    "Tarrasch" => array(
        "D32", "D35"
    ),
    "Wiedeńska" => array(
        "C25", "C29"
    ),
    "Różne1" => array(
        "A00", "A08"
    ),
    "Różne2" => array(
        "B00", "B00"
    ),
);
$whiteGames = 0;
$whitesOpening2 = array();
$queenPawnIndex = null;
$variousIndex = null;
$i = 0;
foreach ($whitesOpening as $opening => &$codes) {
    $query = "SELECT COUNT(*) as sum FROM all_games WHERE MATCH(White) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV('" . $codes[0] . "', 16, 10) AND CONV( '" . $codes[1] . "', 16, 10)";
    $searching = $db->prepare($query);
    $searching->bind_param('s', $fullname);
    $searching->execute();
    $searching->store_result();
    $searching->bind_result($sum);
    while ($searching->fetch()) {
        if ($sum == 0) {
            unset($whitesOpening[$opening]);
        } else {
            if($opening == "Debiut pionka hetmańskiego1" || $opening == "Debiut pionka hetmańskiego2" || $opening == "Debiut pionka hetmańskiego3"){
                if($queenPawnIndex == null){
                    $queenPawnIndex = $i;
                    array_push($whitesOpening2, array("Debiut pionka hetmańskiego1", $sum));                
                }
                else{
                    $whitesOpening2[$queenPawnIndex][1] += $sum;
                }
            }
            else if($opening == "Różne1" || $opening == "Różne2"){
                if($variousIndex == null){
                    $variousIndex = $i;
                    array_push($whitesOpening2, array("Różne", $sum));                
                }
                else{
                    $whitesOpening2[$variousIndex][1] += $sum;
                }

            }
            else{
                array_push($whitesOpening2, array($opening, $sum));                
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
    $query = "SELECT COUNT(*) FROM all_games WHERE MATCH(Black) against(? in boolean mode) AND CONV(eco, 16, 10) BETWEEN CONV( '".$codes[0]."', 16, 10) AND CONV( '".$codes[1]."', 16, 10)";
    $searching = $db->prepare($query);
    $searching->bind_param('s', $fullname);
    $searching->execute();
    $searching->store_result();
    $searching->bind_result($sum);
    while ($searching->fetch()) {
        if ($sum == 0) {
            unset($blackOpening[$opening]);
        } else {
            if($opening == "Debiut pionka hetmańskiego1" || $opening == "Debiut pionka hetmańskiego2" || $opening == "Debiut pionka hetmańskiego3"){
                if($queenPawnIndex == null){
                    $queenPawnIndex = $i;
                    array_push($blacksOpening2, array("Debiut pionka hetmańskiego1", $sum));                
                }
                else{
                    $blacksOpening2[$queenPawnIndex][1] += $sum;
                }
            }
            else if($opening == "Różne1" || $opening == "Różne2"){
                if($variousIndex == null){
                    $variousIndex = $i;
                    array_push($blacksOpening2, array("Różne", $sum));                
                }
                else{
                    $blacksOpening2[$variousIndex][1] += $sum;
                }

            }
            else{
                array_push($blacksOpening2, array($opening, $sum));                
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

echo "<table style='border: 0;'><tr style='display:flex;'><td style='border: 0;'><table><tr><th>debiut</th><th>ilość</th><th>%</th></tr>
<tr><td colspan='3'>Białe</td></tr>";
foreach ($whitesOpening2 as $opening) {
    echo "<tr><td>" . $opening[0] . "</td><td>" . $opening[1] . "</td><td>". round($opening[1]/$whiteGames*100, 2). "</td></tr>";
}
echo "<tr><td>suma</td><td colspan='2'>$whiteGames</td></tr>
<tr><td colspan='3'>Czarne</td></tr>";
foreach ($blacksOpening2 as $opening) {
    echo "<tr><td>" . $opening[0] . "</td><td>" . $opening[1] . "</td><td>". round($opening[1]/$blackGames*100, 2). "</td></tr>";
}
echo "<tr><td>suma</td><td colspan='2'>$blackGames</td></tr>";
echo "</table></td><td style='border: 0;'><img id='graph' src='/player_data/graph.php?name=".urlencode($basicName)."'></tr></table>";

$query = "SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(White) against(? in boolean mode) UNION SELECT id,White, WhiteElo, Black,BlackElo, Result, Year, Month, Day, Event, Eco FROM $table WHERE MATCH(Black) against(? in boolean mode) order BY year DESC,month DESC,day DESC limit 10000";
$searching = $db->prepare($query);
$searching->bind_param('ss', $fullname, $fullname);
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
