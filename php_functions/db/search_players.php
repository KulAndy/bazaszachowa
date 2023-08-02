<?php
function search_players(PDO $conn, string $name, string $table = null)
{
    if (empty($table)) {
        $table = "all";
    }
    $params = [":name" => $name . "%"];
    $table1 = $table == "poland" ? $GLOBALS["database"]["players_pol"] : $GLOBALS["database"]["players_all"];
    $query = "SELECT fullname FROM $table1 WHERE fullname like :name";
    $players = bind_params($conn, $query, $params);
    if (sizeof($players) == 0) {
        $table2 = $GLOBALS["database"]["players"];
        $query = "SELECT fullname FROM $table2 WHERE fullname like :name";
        $players = bind_params($conn, $query, $params);
    }
    return $players;
}
