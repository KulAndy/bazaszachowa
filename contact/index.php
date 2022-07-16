<?php
    require '../header.php';
    include '../menu.php';
    echo '<script defer src="/contact/script.js"></script>';
    echo "<div id='content'>";
    require 'content.php';
    echo "</div>";
    include '../footer.php';
?>