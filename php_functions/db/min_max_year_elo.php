<?php
function min_max_year_elo(PDO $conn, string $name): array
{

    $players_table = $GLOBALS["database"]["players_all"];
    $games_table =  $GLOBALS["database"]["table_all"];
    $fide_table = $GLOBALS["database"]["fide_table"];


    $query =
        "SELECT MAX(rating) as maxElo, MAX(maxYear) as maxYear, MIN(minYear) minYear
FROM
    (
    SELECT
        MAX(WhiteElo) AS rating,
        MIN(YEAR) AS minYear,
        MAX(YEAR) AS maxYear
    FROM
        $games_table
    INNER JOIN $players_table AS t1
    ON
        WhiteID = t1.id
    WHERE
        whiteid in (SELECT id FROM $players_table WHERE fullname LIKE :name)
    UNION
    SELECT
        MAX(BlackElo) AS rating,
        MIN(YEAR) AS minYear,
        MAX(YEAR) AS maxYear
    FROM
        $games_table
    INNER JOIN $players_table AS t1
    ON
        BlackID = t1.id
    WHERE
        BlackID in (SELECT id FROM $players_table WHERE fullname LIKE :name)
    UNION
    SELECT
        rating,
        NULL,
        NULL
    FROM
        $fide_table
    WHERE
            name like :name
    ) as pom
";
    $params = [":name" => $name];
    $results = bind_params($conn, $query, $params);
    return $results;
}
