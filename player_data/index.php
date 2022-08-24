<?php
    require '../header.php';
?>
<style>
    th {
        border: 2px solid black!important;
    }
    summary{
        border: 1px solid black;
    }
    p[style='text-align: center;']{
        border: 1px solid black;
    }
</style>
<?php
    include '../menu.php';
    require 'content.php';
    include '../footer.php';
?>