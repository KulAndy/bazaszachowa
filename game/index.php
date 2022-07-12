<?php
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    echo '<html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="description" content="darmo baza szachowa">
        <meta name="keywords" content="szachy, baza, partie, chess, base, games">
        <meta name="author" content="Andrzej Kulesza">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Baza szachowa</title>
        <link rel="stylesheet" href="chessicons.css">
        '
        ;
    echo        '</head>
    <body class="merida zeit">';
    include '../menu.php';
    echo '<script src="pgnv.js" type="text/javascript"></script>';
    echo '<script defer src="script.js"></script>';
    require 'content.php';
    include '../footer.php';
?>