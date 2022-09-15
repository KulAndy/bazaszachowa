<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="darmo baza szachowa">
    <meta name="keywords" content="szachy, baza, partie, chess, base, games">
    <meta name="author" content="Andrzej Kulesza">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baza szachowa</title>
    <link rel="stylesheet" href="chessicons.css">
</head>

<body class="merida zeit" onkeydown="event.preventDefault()">
    <script>
        let request = <?php echo json_encode($_REQUEST);?>;
    </script>
    <script src="pgnv.js" type="text/javascript"></script>
    <script defer src="script.js"></script>
    <form id="form" action="/game" method="get" style="visibility: hidden;" >
    <input id="idInput" name="id">
    <input id="tableInput" name="table">
    <input id="listInput" name="list">
    </form>
    <?php require 'content.php';
    ?>
    <dialog id="dialog"></dialog>
    <?php
    include '../footer.php';
    ?>