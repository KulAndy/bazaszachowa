<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="darmo baza szachowa">
    <meta name="keywords" content="szachy, baza, partie, chess, base, games">
    <meta name="author" content="Andrzej Kulesza">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
    <title>Baza szachowa</title>
    <link rel="stylesheet" href="chessicons.css">
</head>

<?php
include "../menu.php"
?>

<body class="merida zeit" onkeydown="event.preventDefault()">
    <script>
    let request = <?php echo json_encode($_REQUEST); ?>;
    </script>
    <script src="pgnv.js" type="text/javascript"></script>
    <script defer src="functions.js"></script>
    <script defer src="script.js"></script>
    <form id="form" action="/game" method="get" style="display: none;">
        <input id="idInput" name="id">
        <input id="tableInput" name="table">
        <input id="whiteInput" name="white">
        <input id="blackInput" name="black">
        <input id="ignoreInput" name="ignore">
        <input id="minYearInput" name="minYear">
        <input id="maxYearInput" name="maxYear">
        <input id="eventsInput" name="events">
        <input id="minEcoInput" name="minEco">
        <input id="maxEcoInput" name="maxEco">
        <input id="baseInput" name="base">
        <input id="searchingInput" name="searching">
    </form>
    <?php require 'content.php';
    ?>
    <dialog id="dialog"></dialog>
    <?php
    include '../footer.php';
    ?>