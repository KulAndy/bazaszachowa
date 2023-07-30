<?php
function jpeg(PDO $conn, string $fullname): GdImage
{
    $header = 10;
    $margin = 50;
    $width = 750;
    $heigth = 750;
    $draw = @imagecreate($width + $margin * 2, $heigth + $margin * 2);
    $white = imagecolorallocate($draw, 255, 255, 255);
    $black = imagecolorallocate($draw, 0, 0, 0);
    $blue = imagecolorallocate($draw, 0, 0, 255);
    $red = imagecolorallocate($draw, 255, 0, 0);
    $green = imagecolorallocate($draw, 0, 255, 0);

    $heigth += $header;

    $players_table =  $GLOBALS["database"]["players_all"];
    $games_table = $GLOBALS["database"]["table_all"];
    $fide_table = $GLOBALS["database"]["fide_table"];

    $initialRating = null;
    $breakPoints = array();
    $last = null;

    $minElo = 0;
    $maxElo = 0;
    $query =
        "SELECT MAX(Elo) as Elo, Year, Month FROM(
        SELECT WhiteElo as Elo, Year, Month FROM $games_table 
        INNER JOIN $players_table
        on WhiteID = $players_table.id
        WHERE WhiteID in (SELECT id FROM $players_table WHERE fullname like :name) 
        UNION DISTINCT
        SELECT BlackElo as Elo, Year, Month FROM $games_table 
        INNER JOIN $players_table
        on BlackID = $players_table.id
        WHERE BlackID in (SELECT id FROM $players_table WHERE fullname like :name)
            UNION SELECT rating, YEAR(CURRENT_DATE()), Month(CURRENT_DATE()) FROM $fide_table WHERE name LIKE :name
    ) as pom
WHERE year is not null AND month is not null and Elo is not null
group by Year, Month
ORDER by Year, Month
";
    $params = [":name" => $fullname];
    $result = bind_params($conn, $query, $params);

    foreach ($result as $row) {
        $elo = $row["Elo"];
        $year = $row["Year"];
        $month = $row["Month"];
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

    if (sizeof($result) > 1) {

        $monthNumber = 12 - $initialRating[2] + ((int) date("Y") - $initialRating[1] - 1) * 12 + (int) date("m");
        $eloRange = ceil(($maxElo - $minElo) / 50) + 1;
        if ($monthNumber == 1) {
            $k1 = $width;
        } else {
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
        imagestring($draw, 5, ($width - 5 * strlen($_GET['name'])) / 2, 5, $_GET['name'], $black);
        $messange = "Wykres elo";
        imagestring($draw, 4, ($width - 4 * strlen($messange)) / 2, 20, $messange, $black);
        imagefilledrectangle($draw, $margin, $margin + $header, $margin, $heigth, $black);

        $maxPoint = $margin + $header;
        $minPoint = $margin + $header;

        $startDate = date_create($initialRating[1] . "-" . $initialRating[2]);
        $currentDate = date_create(date("Y") . "-" . (date("m") + 1));
        $i = 0;
        $period = ceil(((int) date_diff($startDate, $currentDate)->format("%Y")) / 22);
        while ($startDate <= $currentDate) {
            if (date_format($startDate, "m") == "01") {
                if (((int) date_diff($startDate, $currentDate)->format("%Y")) % $period == 0) {
                    imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y"), $black);
                    if ($period > 1) {
                        imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $red);
                    } else {
                        imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $black);
                    }
                } else {
                    imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $black);
                }
            } else if (date_format($startDate, "Y-m") == date_format(date_create($initialRating[1] . "-" . $initialRating[2]), "Y-m") && $initialRating[2] < 10) {
                if ($initialRating[2] < 5) {
                    imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y-m"), $black);
                } else {
                    if ($period == 1)
                        imagestring($draw, 2, $margin + $k1 * $i, $heigth, date_format($startDate, "Y"), $black);
                }
            }
            date_add($startDate, date_interval_create_from_date_string("1 months"));
            if (date_format($startDate, "Y-m") == date_format($currentDate, "Y-m")) {
                imagefilledrectangle($draw, $margin + $k1 * $i, $margin + $header, $margin + $k1 * $i, $heigth, $black);
                for ($j = 0; $j <= $eloRange; $j++) {
                    imagestring($draw, 4, 5, $margin + $header + $k2 * $j, $maxGraphElo - $j * 50, $black);
                    imagefilledrectangle($draw, $margin, $margin + $header + $k2 * $j, $margin + $k1 * $i, $margin + $header + $k2 * $j, $black);
                    $minPoint = $margin + $header + $k2 * $j;
                    imagefilledrectangle($draw, $margin, $heigth, $margin + $k1 * $i, $heigth, $black);
                }
            }
            $i++;
        }
        if (date_format($startDate, "m") == "01") {
            imagestring($draw, 2, $margin + $k1 * --$i, $heigth, date_format($startDate, "Y"), $black);
        }

        $currenPointX = $margin;
        $currentPercent = 1 - ($initialRating[0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
        $currenPointY = $currentPercent * ($minPoint - $maxPoint) + $maxPoint;;

        $startDate = date_create($initialRating[1] . "-" . $initialRating[2]);
        $currentDate = date_create(date("Y") . "-" . date("m"));
        $i = 0;
        $j = 0;
        imagesetthickness($draw, 3);

        $currentBreak = $initialRating;
        for ($i = 0; $i < sizeof($breakPoints); $i++) {
            $newBreak = $breakPoints[$i];
            $monthDiff = ($newBreak[1] - $currentBreak[1]) * 12 + ($newBreak[2] - $currentBreak[2]);
            $newCurrenPointX = $currenPointX + $k1 * $monthDiff;
            $newCurrentPercent = 1 - ($breakPoints[$i][0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
            $newCurrenPointY = $newCurrentPercent * ($minPoint - $maxPoint) + $maxPoint;
            imageline($draw, $currenPointX, $currenPointY, $currenPointX + $k1 * ($monthDiff - 1), $currenPointY, $blue);
            imageline($draw, $currenPointX + $k1 * ($monthDiff - 1), $currenPointY, $newCurrenPointX, $newCurrenPointY, $blue);
            $currentBreak = $newBreak;
            $currenPointX = $newCurrenPointX;
            $currenPointY = $newCurrenPointY;
        }

        return $draw;
    }
}
