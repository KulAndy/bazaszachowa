<?php
require(__DIR__ . "/../php_functions/functions.php");

$conn = start_connection();

echo json_encode(
    search_games(
        $conn,
        $_REQUEST["base"] ?? null,
        $_REQUEST["white"] ?? null,
        $_REQUEST["black"] ?? null,
        ($_REQUEST["ignore"] ?? false) == "true",
        (int)($_REQUEST["minYear"] ?? 1475),
        (int)($_REQUEST["maxYear"] ?? date("Y")),
        $_REQUEST["event"] ?? null,
        (int)($_REQUEST["minEco"] ?? 1),
        (int)($_REQUEST["maxEco"] ?? 500),
        ($_REQUEST["searching"] ?? "classic")
    )
);

close_connection($conn);
