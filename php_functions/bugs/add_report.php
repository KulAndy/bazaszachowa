<?php

function add_report(
    PDO $conn,
    int $gameid,
    string $table,
    string $token,
    string $type,
    string $notices,
    string $link
) {
    $notices = trim($notices);
    $link = trim($link);
    $query = "INSERT INTO " . $GLOBALS["database"]["bug_report"] . " (gameID, games_table, reporter_id, notices, link, bug_type_id) " .
        "SELECT :gameid, :table, reporters.id , notices, link, IFNULL(types.ID, 1) FROM 
    ( 
        SELECT  NULLIF(:notices, '') as notices, NULLIF(:link, '') as link, :type as type
    ) as pom 
    LEFT JOIN bug_types as types
    on type = name 
    INNER JOIN " . $GLOBALS["database"]["bug_reporters"] . " as reporters
    on :token = token
    ";

    $params = [
        ":gameid" => $gameid,
        ":table" => $table,
        ":notices" => $notices,
        ":link" => $link,
        ":type" => $type,
        ":token" => $token
    ];
    bind_params($conn, $query, $params);
}
