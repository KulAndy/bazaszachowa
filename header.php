<?php
echo '<!DOCTYPE html>
    <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <meta name="description" content="darmo baza szachowa">
            <meta name="keywords" content="szachy, baza, partie, chess, base, games">
            <meta name="author" content="Andrzej Kulesza">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Baza szachowa</title>
            <base href="';
            if (empty($_SERVER['HTTPS'])){
                    echo "http://";
            }
            else{
                echo "https://";
            }
            echo $_SERVER['SERVER_NAME'].'" target="_blank">
            <link rel="stylesheet" href="css/style.css">
                </head>
        <body>';
?>