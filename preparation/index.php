<?php
require '../header.php';
?>
<link rel="stylesheet" href="/css/prep.css">
<link rel="stylesheet" href="/css/game.css">
<?php
include '../menu.php';

if (
    isset($_GET['name']) &&
    !empty($_GET['name']) &&
    isset($_GET['color']) &&
    in_array($_GET['color'], ["white", "black"])
) {
    echo '
    <script defer src="/script/chess.js"></script>
    <script defer src="/script/pgnv.js"></script>
    <script defer src="/script/prep_functions.js"></script>
    <script defer src="/script/prep.js"></script>';

    require 'content.php';
} else {
    require 'prep_form.php';
}
include '../footer.php';
?>