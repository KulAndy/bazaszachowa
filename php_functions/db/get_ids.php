<?php
function get_ids(PDO $conn, string $table, int $limit = 999999, int $offset = 0)
{
    $games_table = $table == "poland" ?  $GLOBALS["database"]["table_pol"] : $GLOBALS["database"]["table_all"];
    $query = "SELECT id FROM $games_table LIMIT $limit OFFSET $offset";

    return query($conn, $query);
}
