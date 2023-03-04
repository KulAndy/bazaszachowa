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
    <base href="
            <?php
            if (empty($_SERVER['HTTPS'])) {
                echo "http://";
            } else {
                echo "https://";
            }
            echo $_SERVER['SERVER_NAME'] ?>">
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
    <?php
    if ($_SERVER["DOCUMENT_URI"] == "/game/index.php") {
        echo '<link rel="stylesheet" href="css/chessicons.css">';
    }
    ?>
</head>

<body>


