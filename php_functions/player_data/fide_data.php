<?php
function fide_data(PDO $conn, string $player)
{
    $fullname = string_for_fulltext($player);

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
        :fulltext IN BOOLEAN MODE
    ) AND NAME LIKE :name";
    $params = [
        ":fulltext" => $fullname,
        ":name" => $player
    ];
    return bind_params($conn, $query, $params);
}
