<?php

require_once("./login_data.php");

$player = $_REQUEST['player'] . "%";
if (isset($_REQUEST['forfulltext']) && $_REQUEST['forfulltext'] == "true") {
    $forFulltext = true;
} else {
    $forFulltext = false;
}

$query = "
SELECT 
    fullname
FROM $players_table 
WHERE fullname LIKE ?
";

$searching = $db->prepare($query);
$db->bind_param($searching, [$player]);
$db->execute($searching);
$result = $db->get_result($searching);

if ($result->num_rows == 0) {
    $query = "
SELECT
    fullname
FROM $whole_players_table 
WHERE fullname LIKE ?
";
    $searching = $db->prepare($query);
    $db->bind_param($searching, [$player]);
    $db->execute($searching);
    $result = $db->get_result($searching);
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $finded = $row["fullname"];
    if ($forFulltext) {
        if (in_array(substr($finded, 1, 1), ["'", "`"])) {
            $finded = substr($finded, 2);
        }

        $finded = preg_replace(
            "/' /",
            "",
            $finded
        );
        $finded = preg_replace(
            "/-/",
            " ",
            $finded
        );
        $finded = preg_replace(
            "/ \w?\.*$/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/\(.*/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/,$/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/\s+/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/ *$/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/(^| |')\w{0,2}($| |')/",
            "",
            $finded
        );
        $finded = preg_replace(
            "/ +/",
            "",
            $finded
        );
        $finded = "+" . preg_replace("/ +/i", " +", $finded);
    }
    $finded = trim($finded);

    array_push($data, $finded);
}

$data = array_unique($data);

echo json_encode($data);