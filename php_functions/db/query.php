<?php

function query(PDO $conn, string $sql)
{
    return bind_params($conn, $sql, []);
}

function bind_params(PDO $conn, string $sql, array $params): array
{
    $stmt = $conn->prepare($sql);
    foreach ($params as $param => $value) {
        $stmt->bindValue($param, $value);
    }

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results;
}
