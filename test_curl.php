<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    * {
        overflow-wrap: break-word;
    }
    </style>
</head>

<body>
    <pre>

        <?php
        $fullname = $_GET['fullname'];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://www.cr-pzszach.pl/ew/viewpage.php?page_id=3");
        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            "typ_szukania=szukaj_czlonka&wyszukiwany_ciag=$fullname&szukaj=Szukaj"
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $output = curl_exec($ch);
        curl_close($ch);

        $pattern = "#<tr>(<td.*>.*</td>)+(.*pers_id.*).*(<td.*>.*</td>)+</tr>#im";
        // echo $pattern;

        preg_match_all($pattern, $output, $finded);
        foreach ($finded as &$hitArray) {
            if (empty($hitArray)) {
                print_r($hitArray);
                unset($hitArray);
            } else {
                foreach ($hitArray as &$hit) {
                    if (empty($hit)) {
                        echo $hit;
                        unset($hit);
                    } else {
                        // $hit = htmlentities(mb_convert_encoding($hit, 'UTF-8', 'ASCII'), ENT_SUBSTITUTE, "UTF-8");
                        // $hit = str_replace("&lt;/td&gt;", "&lt;/td&gt;<br />", $hit);
                    }
                }
            }
        }
        $data = [];
        foreach ($finded[0] as $hit) {
            $hit = preg_replace('#</?t[rd]>|<a [a-z=".?_0-9&]+>|<sup>.*</sup>|</a>#i', "", $hit);
            $regexSplited = preg_split('#<td [a-z=".?_0-9&-:; ]+>#i', $hit);
            $regexSplited = array_splice($regexSplited, 1);
            // echo "<p>" . htmlentities(mb_convert_encoding($hit, 'UTF-8', 'ASCII'), ENT_SUBSTITUTE, "UTF-8") . "<p/>";
            print_r($regexSplited);
            $tmp = [
                "id" => $regexSplited[1],
                "kat" => $regexSplited[2],
                "fide_id" => $regexSplited[3],
            ];
            array_push($data, $tmp);
        }

        echo json_encode($data);

        ?>
    </pre>
</body>

</html>