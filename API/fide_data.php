<?php
require_once('login_data.php');

if (isset($_REQUEST['name']) && !empty($_REQUEST['name'])) {
    if (in_array(substr($_REQUEST['name'], 1, 1), ["'", "`"])) {
        $fullname = substr($_REQUEST['name'], 2);
    } else {
        $fullname = $_REQUEST['name'];
    }
    $fullname =  preg_replace(
        "/\b\w\b/i",
        "",
        $fullname
    );

    $fullname = str_replace(
        "-",
        " ",
        $fullname
    );
    $fullname = preg_replace(
        '/\s+/',
        ' ',
        $fullname
    );
    $fullname = "+" . str_replace(
        " ",
        " +",
        preg_replace(
            "/(^| |')\w{0,2}($| |')/",
            "",
            $fullname
        )
    );
} else {
    die("Brak zawodnika do wyszukania");
}

$query = "SELECT
    fideid,
    name,
    title,
    rating,
    rapid_rating,
    blitz_rating,
    birthday
    FROM
    fide_players
    WHERE
    MATCH(NAME) AGAINST(
        ? IN BOOLEAN MODE
    ) AND NAME LIKE ?";


$searching = $db->prepare($query);
$db->bind_param($searching, [$fullname, $_REQUEST["name"]]);
$db->execute($searching);
$result = $db->get_result($searching);
$data = [];
while ($row = $result->fetch_assoc()) {
    array_push($data, $row);
}
echo json_encode($data);
$db->close();