<?php
require 'login_data.php';
// $data = array();
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}
if (isset($_REQUEST['fullname']) && !empty($_REQUEST['fullname'])) {
    $basicName = htmlspecialchars($_REQUEST['fullname']);
    if (substr($_REQUEST['fullname'], 1, 1) == "'") {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", substr($_REQUEST['fullname'], 2)));
    } else {
        $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $_REQUEST['fullname']));
    }
    $fullname = "+" . str_replace(" ", " +", $fullname);
} else {
    die("Brak zawodnika do wyszukania");
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
    $searching->bind_param('ss', $fullname, $_REQUEST['fullname']);
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
    $searching->bind_param('ss', $fullname, $_REQUEST['fullname']);
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

$data =  array(
    "whites" => $whitesOpening2,
    "blacks" => $blacksOpening2,
    "whitesGames" => $whiteGames,
    "blacksGames" => $blackGames
);
echo json_encode($data);