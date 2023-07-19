<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="Przeglądaj darmową bazę danych szachowych online i popraw swoją grę, korzystając z milionów gier. Dołącz już dziś do naszej społeczności miłośników szachów.">
    <meta lang="en" name="description" content="Explore free online chess database and improve your game with access to millions of games. Join our community of chess enthusiasts today.">
    <meta name="keywords" content="szachy,szachowy, szachowa, chess, baza, baz, base, bazaszachowa, partie, gry, games,small, smallhost,  katalog, darmowy, free, polska,free online chess database, chess games, chess openings, chess tactics, chess strategy, chess analysis, bezpłatna baza danych szachowa online, gry szachowe, debiuty szachowe, taktyki szachowe, strategie szachowe, analiza szachowa ">
    <meta name="author" content="Andrzej Kulesza">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
    <title>Baza szachowa</title>
    <base href="http<?php if (!empty($_SERVER['HTTPS'])) {
                        echo "s";
                    } ?>://<?php echo $_SERVER['SERVER_NAME'] ?>" target="_blank">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
    <?php
    if ($_SERVER["DOCUMENT_URI"] == "/game/index.php") {
        echo '<link rel="stylesheet" href="css/chessicons.css">';
    }
    ?>
</head>

<body>