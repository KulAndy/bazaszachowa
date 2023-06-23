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
    MAX(rating) as maxElo, MAX(maxYear) as maxYear, MIN(minYear) minYear
FROM
    (
    SELECT
        MAX(WhiteElo) AS rating,
        MIN(YEAR) AS minYear,
        MAX(YEAR) AS maxYear
    FROM
        $table
    INNER JOIN $players_table AS t1
    ON
        WhiteID = t1.id
    WHERE
        MATCH(t1.fullname) AGAINST(
            ? IN BOOLEAN MODE
        ) AND t1.fullname LIKE ?
    UNION
SELECT
    MAX(BlackElo) AS rating,
    MIN(YEAR) AS minYear,
    MAX(YEAR) AS maxYear
FROM
    $table
INNER JOIN $players_table AS t1
ON
    BlackID = t1.id
WHERE
    MATCH(t1.fullname) AGAINST(
        ? IN BOOLEAN MODE
    ) AND t1.fullname LIKE ?
UNION
SELECT
    rating,
    NULL,
    NULL
FROM
    $fide_table
WHERE
    MATCH(NAME) AGAINST(
        ? IN BOOLEAN MODE
    ) AND NAME LIKE ?
) AS pom";
$searching = $db->prepare($query);
$db->bind_param($searching, [$fullname, $_REQUEST["name"], $fullname, $_REQUEST["name"], $fullname, $_REQUEST["name"]]);
$db->execute($searching);
$result = $db->get_result($searching);
echo json_encode($db->fetch_assoc($result));
$db->close();