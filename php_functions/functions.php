<?php
require_once(__DIR__ . "/../data/settings.php");
require_once(__DIR__ . "/row_to_pgn.php");
require_once(__DIR__ . "/db/functions.php");
require_once(__DIR__ . "/html/functions.php");
require_once(__DIR__ . "/graph/functions.php");
require_once(__DIR__ . "/player_data/functions.php");
function replace_national(string $name): string
{
    $name = str_replace("ą", "a", $name);
    $name = str_replace("ć", "c", $name);
    $name = str_replace("ę", "e", $name);
    $name = str_replace("ł", "l", $name);
    $name = str_replace("ń", "n", $name);
    $name = str_replace("ó", "o", $name);
    $name = str_replace("ś", "s", $name);
    $name = str_replace("ź", "z", $name);
    $name = str_replace("ż", "z", $name);
    $name = str_replace("Ą", "a", $name);
    $name = str_replace("Ć", "c", $name);
    $name = str_replace("Ę", "E", $name);
    $name = str_replace("Ł", "L", $name);
    $name = str_replace("Ń", "N", $name);
    $name = str_replace("Ó", "O", $name);
    $name = str_replace("Ś", "S", $name);
    $name = str_replace("Ź", "Z", $name);
    $name = str_replace("Ż", "Z", $name);
    return $name;
}

function string_for_fulltext(string $txt): string
{
    if (in_array(substr($txt, 1, 1), ["'", "`"])) {
        $fulltext = substr($txt, 2);
    } else {
        $fulltext = $txt;
    }
    $fulltext =  preg_replace(
        "/\b\w\b/i",
        "",
        $fulltext
    );

    $fulltext = str_replace(
        "-",
        " ",
        $fulltext
    );
    $fulltext = preg_replace(
        '/\s+/',
        ' ',
        $fulltext
    );
    $fulltext = "+" . str_replace(
        " ",
        " +",
        preg_replace(
            "/(^| |')\w{0,2}($| |')/",
            "",
            $fulltext
        )
    );

    return $fulltext;
}
