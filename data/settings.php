<?php
$GLOBALS["urls"] = [
    "home" => [
        "name" => "strona główna",
        "url" => "/"
    ],
    "players" => [
        "name" => "wyszukiwarka graczy",
        "url" => "/players/"
    ],
    "search" => [
        "name" => "wyszukiwarka partii",
        "url" => "/search/"
    ],

    "preparation" => [
        "name" => "przygotowanie (eksperymentalne)",
        "url" => "/preparation/"
    ],
    "license" => [
        "name" => "licencja",
        "url" => "/license/"
    ],
    "rodo" => [
        "name" => "dla fanów rodo",
        "url" => "/rodo/"
    ],
    "contact" => [
        "name" => "kontakt",
        "url" => "/contact/"
    ],
];

$GLOBALS["nomenu_urls"] = [
    "game" => "/game/",
    "game_raw" => "/game_raw/",
    "profile" => "/player_data/",
    "send_mail" => "/contact/send.php"
];

$GLOBALS["api"] = [
    "cr" => "/API/cr_data.php",
    "fide" => "/API/fide_data.php",
    "game" => "/API/get_game.php",
    "graph" => [

        "jpeg" => "/API/graph_jpeg.php",
        "svg" => "/API/graph_svg.php"
    ],
    "extremes" => "/API/min_max_year_elo.php",
    "openings" => "/API/player_opening_stats.php",
    "games" => [
        "normal" => "/API/search_game.php",
        "filter" => "/API/search_player_opening_game.php"
    ],
    "players" => "/API/search_player.php"

];

$GLOBALS["database"] = [
    "host" => "",
    "user" => "",
    "pass" => "",
    "base" => "",
    "players" => "",
    "table_all" => "",
    "players_all" => "",
    "table_pol" => "",
    "players_pol" => "",
    "events_table" => "c",
    "sites_table" => "",
    "eco_table" => "",
    "fide_table" => "",
];
