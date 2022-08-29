<?php
header("Content-type: image/jpeg");
$header = 10;
$margin = 50;
$width = 750;
$heigth = 750; //50 px na nagłówek
$draw = @imagecreate($width + $margin * 2, $heigth + $margin * 2);
$white = imagecolorallocate($draw, 255, 255, 255);
$black = imagecolorallocate($draw, 0, 0, 0);
$blue = imagecolorallocate($draw, 0, 0, 255);
$heigth += $header;


require 'login_data.php';

@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
                 Spróbuj jeszcze raz później.</p>';
    exit;
}
$initialRating = null;
$breakPoints = array();
$last = null;

$minElo = 0;
$maxElo = 0;
if (isset($_GET['name']) && !empty($_GET)) {
    $basicName = htmlspecialchars($_GET['name']);
    $fullname = "+" . str_replace(" ", " +", $_GET['name']);
    $fullname = str_replace("-", " +", $fullname);
    $query = "SELECT WhiteElo as Elo, Year, Month FROM $table WHERE MATCH(White) against(? in boolean mode) AND Month is not null AND WhiteElo is not null
        UNION DISTINCT
        SELECT BlackElo as Elo, Year, Month  FROM $table WHERE MATCH(Black) against(? in boolean mode) AND Month is not null AND BlackElo is not null
        ORDER by Year,Month";
    $searching = $db->prepare($query);
    $searching->bind_param('ss', $fullname, $fullname);
    $searching->execute();
    $searching->store_result();
    $searching->bind_result($elo, $year, $month);
    if( $searching -> num_rows() > 0){

        while ($searching->fetch()) {
            if ($initialRating == null) {
                $initialRating = array($elo, $year, $month);
                $last = $elo;
                $minElo = $elo;
                $maxElo = $elo;
            } else {
                if ($last != $elo) {
                    array_push($breakPoints, array($elo, $year, $month));
                    $last = $elo;
                    if ($elo < $minElo) {
                        $minElo = $elo;
                    }
                    if ($elo > $maxElo) {
                        $maxElo = $elo;
                    }
                }
            }
        }
        $monthNumber = 12 - $initialRating[2] + ((int)date("Y") - $initialRating[1] - 1) * 12 + (int)date("m");
        $eloRange = ceil(($maxElo - $minElo) / 50) + 1;
        if($monthNumber == 1){
            $k1 = $width;
        }
        else{
            $k1 = $width / ($monthNumber - 1);
        }
        $k2 = ($heigth - $margin * 2) / $eloRange;
        $maxGraphElo = 0;
        while ($maxGraphElo < $maxElo) {
            $maxGraphElo += 50;
        }
        $minGraphElo = 3000;
        while ($minGraphElo > $minElo) {
            $minGraphElo -= 50;
        }
    
        imagefill($draw, 0, 0, $white);
        imagestring($draw, 5, ($width - 10 * strlen($_GET['name'])) / 2, 5, $_GET['name'], $black);
        $messange = "Wykres elo";
        imagestring($draw, 4, ($width - 10 * strlen($messange)) / 2, 20, $messange, $black);
        imagefilledrectangle($draw, $margin, $margin + $header, $margin, $heigth, $black);
    
        $maxPoint = $margin + $header;
        $minPoint = $margin + $header;
    
        $startDate = date_create($initialRating[1] . "-" . $initialRating[2]);
        $currentDate = date_create(date("Y") . "-" . date("m"));
        $i = 0;
        while (date_format($startDate, "Y-m") != date_format($currentDate, "Y-m")) {
            if (date_format($startDate, "m") == "01") {
                imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y"), $black);
                imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $black);
            } else if (date_format($startDate, "Y-m") == date_format(date_create($initialRating[1] . "-" . $initialRating[2]), "Y-m") && $initialRating[2] < 10) {
                if ($initialRating[2] < 5) {
                    imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y-m"), $black);
                } else {
                    imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y"), $black);
                }
            }
            date_add($startDate, date_interval_create_from_date_string("1 months"));
            if(date_format($startDate, "Y-m") == date_format($currentDate, "Y-m")){
                imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $black);
                for ($j = 0; $j <= $eloRange; $j++) {
                    imagestring($draw, 3, 5, $margin + $header + $k2 * $j, $maxGraphElo - $j * 50, $black);
                    imagefilledrectangle($draw, $margin, $margin + $header + $k2 * $j, $margin + $k1 * $i, $margin + $header + $k2 * $j, $black);
                    $minPoint = $margin + $header + $k2 * $j;
                    imagefilledrectangle($draw, $margin, $heigth, $margin + $k1 * $i, $heigth, $black);
                }        
            }
            $i++;
        }
    
        $currenPointX = $margin;
        $currentPercent = 1 - ($initialRating[0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
        $currenPointY = $currentPercent * ($minPoint - $maxPoint) + $maxPoint;;
    
        $startDate = date_create($initialRating[1] . "-" . $initialRating[2]);
        $currentDate = date_create(date("Y") . "-" . date("m"));
        $i = 0;
        $j = 0;
        imagesetthickness($draw, 3);
        while (date_format($startDate, "Y-m") != date_format($currentDate, "Y-m")) {
            if (date_format($startDate, "Y-m") == date_format(date_create($breakPoints[$j][1] . "-" . $breakPoints[$j][2]), "Y-m")) {
                $newCurrenPointX = $margin + $k1 * $i;
                $newCurrentPercent = 1 - ($breakPoints[$j][0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
                $newCurrenPointY = $newCurrentPercent * ($minPoint - $maxPoint) + $maxPoint;
                if($currenPointX != $newCurrenPointX){
                    imageline($draw, $currenPointX, $currenPointY, $newCurrenPointX, $newCurrenPointY, $blue);
                }
                $currenPointX = $newCurrenPointX;
                $currenPointY = $newCurrenPointY;
                while(date_format($startDate, "Y-m") == date_format(date_create($breakPoints[$j][1] . "-" . $breakPoints[$j][2]), "Y-m") && $j < sizeof($breakPoints) - 2){
                    $j++;
                }
            } else {
                $newCurrenPointX = $margin + $k1 * $i;
                $newCurrentPercent = 1 - ($breakPoints[$j][0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
                $newCurrenPointY = $newCurrentPercent * ($minPoint - $maxPoint) + $maxPoint;
                if($currenPointX != $newCurrenPointX){
                    imageline($draw, $currenPointX, $currenPointY, $newCurrenPointX, $newCurrenPointY, $blue);
                }
                $currenPointX = $newCurrenPointX;
                $currenPointY = $newCurrenPointY;
            }
            date_add($startDate, date_interval_create_from_date_string("1 months"));
            $i++;
        }
    }


    imagejpeg($draw);
}
