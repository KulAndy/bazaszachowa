<?php
if (isset($_POST['fullname']) && !empty($_POST['fullname'])) {
    $fullname = $_POST['fullname'];
} else {
    exit;
}
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
            }
        }
    }
}
$data = [];
foreach ($finded[0] as $hit) {
    $hit = preg_replace('#</?t[rd]>|<a [a-z=".?_0-9&]+>|<sup>.*</sup>|</a>#i', "", $hit);
    $regexSplited = preg_split('#<td [a-z=".?_0-9&-:; ]+>#i', $hit);
    $regexSplited = array_splice($regexSplited, 1);
    $tmp = [
        "id" => $regexSplited[1],
        "kat" => $regexSplited[2],
        "fide_id" => $regexSplited[3],
    ];
    array_push($data, $tmp);
}

echo json_encode($data);