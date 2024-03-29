<?php
function svg(PDO $conn, string $fullname): string
{
    $header = 10;
    $margin = 50;
    $width = 750;
    $heigth = 750;
    $svg = new DOMDocument();
    $svgElement = $svg->createElement('svg');
    $svgElement->setAttribute('width', $width + $margin * 2);
    $svgElement->setAttribute('height', $heigth + $margin * 2);
    $svgElement->setAttribute('style', "background-color: white;");
    $svgElement->setAttribute("xmlns", "http://www.w3.org/2000/svg");

    $background = $svg->createElement("rect");
    $background->setAttribute("style", "fill:#fff");
    $background->setAttribute('height', $heigth + $margin * 2);
    $background->setAttribute('height', $heigth + $margin * 2);
    $background->setAttribute('style', "background-color: white;");
    $svgElement->appendChild($background);

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

        $title = $svg->createElement("text", $_GET['name']);
        $title->setAttribute('x', ($width - 5 * strlen($_GET['name'])) / 2);
        $title->setAttribute('y', 30);
        $title->setAttribute('font-size', 24);
        $title->setAttribute('text-anchor', 'middle');
        $title->setAttribute('font-weight', 'bold');

        $svgElement->appendChild($title);

        $messange = "Wykres elo";
        $subtitle = $svg->createElement("text", $messange);
        $subtitle->setAttribute('x', ($width - 5 * strlen($messange)) / 2);
        $subtitle->setAttribute('y', 50);
        $subtitle->setAttribute('font-size', 16);
        $subtitle->setAttribute('text-anchor', 'middle');
        $subtitle->setAttribute('font-weight', 'bold');
        $svgElement->appendChild($subtitle);

        $line = $svg->createElement("line");
        $line->setAttribute("x1", $margin);
        $line->setAttribute("y1", $margin + $header);
        $line->setAttribute("x2", $margin);
        $line->setAttribute("y2", $heigth);
        $line->setAttribute("style", "stroke:#000;stroke-width:2");
        $svgElement->appendChild($line);

        $maxPoint = $margin + $header;
        $minPoint = $margin + $header;

        $startDate = date_create($initialRating[1] . "-" . $initialRating[2]);
        $currentDate = new DateTime(date("Y-m-d"));
        $i = 0;
        $period = ceil(((int) date_diff($startDate, $currentDate)->format("%Y")) / 22);
        while ($startDate < $currentDate) {
            if (date_format($startDate, "m") == "01") {
                if (((int) date_diff($startDate, $currentDate)->format("%Y")) % $period == 0) {
                    $text = $svg->createElement("text", date_format($startDate, "Y"));
                    $text->setAttribute("x", $margin + $k1 * $i);
                    $text->setAttribute("y", $heigth + 20);
                    $text->setAttribute('font-size', 16);
                    $svgElement->appendChild($text);
                    if ($period > 1) {
                        $line = $svg->createElement("line");
                        $line->setAttribute("x1", $margin + $k1 * $i);
                        $line->setAttribute("y1", $margin + $header);
                        $line->setAttribute("x2", $margin + $k1 * $i);
                        $line->setAttribute("y2", $heigth);
                        $line->setAttribute("style", "stroke:#f00;stroke-width:2");
                        $svgElement->appendChild($line);
                    } else {
                        $line = $svg->createElement("line");
                        $line->setAttribute("x1", $margin + $k1 * $i);
                        $line->setAttribute("y1", $margin + $header);
                        $line->setAttribute("x2", $margin + $k1 * $i);
                        $line->setAttribute("y2", $heigth);
                        $line->setAttribute("style", "stroke:#000;stroke-width:2");
                        $svgElement->appendChild($line);
                    }
                } else {
                    $line = $svg->createElement("line");
                    $line->setAttribute("x1", $margin + $k1 * $i);
                    $line->setAttribute("y1", $margin + $header);
                    $line->setAttribute("x2", $margin + $k1 * $i);
                    $line->setAttribute("y2", $heigth);
                    $line->setAttribute("style", "stroke:#000;stroke-width:2");
                    $svgElement->appendChild($line);
                }
            } else if (date_format($startDate, "Y-m") == date_format(date_create($initialRating[1] . "-" . $initialRating[2]), "Y-m") && $initialRating[2] < 10) {
                if ($initialRating[2] < 5) {
                    $text = $svg->createElement("text", date_format($startDate, "Y-m"));
                    $text->setAttribute("x", $margin + $k1 * $i);
                    $text->setAttribute("y", $heigth + 20);
                    $text->setAttribute('font-size', 16);
                    $svgElement->appendChild($text);
                } else {
                    if ($period == 1) {
                        $text = $svg->createElement("text", date_format($startDate, "Y"));
                        $text->setAttribute("x", $margin + $k1 * $i);
                        $text->setAttribute("y", $heigth + 20);
                        $text->setAttribute('font-size', 16);
                        $svgElement->appendChild($text);
                    }
                }
            }
            date_add($startDate, date_interval_create_from_date_string("1 months"));
            if (date_format($startDate, "Y-m") == date_format($currentDate, "Y-m")) {
                $line = $svg->createElement("line");
                $line->setAttribute("x1", $margin + $k1 * $i);
                $line->setAttribute("y1", $margin + $header);
                $line->setAttribute("x2", $margin + $k1 * $i);
                $line->setAttribute("y2", $heigth);
                $line->setAttribute("style", "stroke:#000;stroke-width:2");
                $svgElement->appendChild($line);
                for ($j = 0; $j <= $eloRange; $j++) {
                    $text = $svg->createElement("text", $maxGraphElo - $j * 50);
                    $text->setAttribute("x", 5);
                    $text->setAttribute("y", $margin + $header + $k2 * $j);
                    $text->setAttribute('font-size', 16);
                    $svgElement->appendChild($text);

                    $line = $svg->createElement("line");
                    $line->setAttribute("x1", $margin);
                    $line->setAttribute("y1", $margin + $header + $k2 * $j);
                    $line->setAttribute("x2", $margin + $k1 * $i);
                    $line->setAttribute("y2", $margin + $header + $k2 * $j);
                    $line->setAttribute("style", "stroke:#000;stroke-width:2");
                    $svgElement->appendChild($line);
                    $minPoint = $margin + $header + $k2 * $j;
                    $line = $svg->createElement("line");
                    $line->setAttribute("x1", $margin);
                    $line->setAttribute("y1", $heigth);
                    $line->setAttribute("x2", $margin + $k1 * $i);
                    $line->setAttribute("y2", $heigth);
                    $line->setAttribute("style", "stroke:#000;stroke-width:2");
                    $svgElement->appendChild($line);
                }
            }
            $i++;
        }
        if (date_format($startDate, "m") == "01") {
            $text = $svg->createElement("text", date_format($startDate, "Y"));
            $text->setAttribute("x", $margin + $k1 * --$i);
            $text->setAttribute("y", $heigth);
            $text->setAttribute('font-size', 16);
            $svgElement->appendChild($text);
        }

        $currenPointX = $margin;
        $currentPercent = 1 - ($initialRating[0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);
        $currenPointY = $currentPercent * ($minPoint - $maxPoint) + $maxPoint;;

        $i = 0;
        $j = 0;


        $currentBreak = $initialRating;
        for ($i = 0; $i < sizeof($breakPoints); $i++) {
            $newBreak = $breakPoints[$i];
            $monthDiff = ($newBreak[1] - $currentBreak[1]) * 12 + ($newBreak[2] - $currentBreak[2]);
            $newCurrenPointX = $currenPointX + $k1 * $monthDiff;
            $newCurrentPercent = 1 - ($breakPoints[$i][0] - $minGraphElo) / ($maxGraphElo - $minGraphElo);

            $newCurrenPointY = $newCurrentPercent * ($minPoint - $maxPoint) + $maxPoint;

            $line = $svg->createElement("line");
            $line->setAttribute("x1", $currenPointX);
            $line->setAttribute("y1", $currenPointY);
            $line->setAttribute("x2", $currenPointX + $k1 * ($monthDiff - 1));
            $line->setAttribute("y2", $currenPointY);
            $line->setAttribute("style", "stroke:#00f;stroke-width:4");
            $svgElement->appendChild($line);

            $line = $svg->createElement("line");
            $line->setAttribute("x1", $currenPointX + $k1 * ($monthDiff - 1));
            $line->setAttribute("y1", $currenPointY);
            $line->setAttribute("x2", $newCurrenPointX);
            $line->setAttribute("y2", $newCurrenPointY);
            $line->setAttribute("style", "stroke:#00f;stroke-width:4");
            $svgElement->appendChild($line);

            $currenPointX = $newCurrenPointX;
            $currenPointY = $newCurrenPointY;
            $currentBreak = $newBreak;
        }

        $svg->appendChild($svgElement);
        return $svg->saveXML();
    }
}
