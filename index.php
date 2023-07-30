<html lang="pl">
<?php
require("./php_functions/functions.php");
create_header();
?>

<body>
    <?php
    create_menu();
    wrap_content(__DIR__ . "/left_content.php", "left_content", ["float_left"]);
    wrap_content(__DIR__ . "/content.php", "content", ["float_left"]);
    create_footer();
    ?>
</body>

</html>