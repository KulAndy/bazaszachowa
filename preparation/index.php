<?php
require_once("../php_functions/functions.php");
if (
    isset($_GET['name']) &&
    !empty($_GET['name']) &&
    isset($_GET['color']) &&
    in_array($_GET['color'], ["white", "black"])
) {
    create_standard_content(__DIR__, ["prep", "game",], ["prep", "chess"], ["pgnv"], true);
} else {
?>
    <html lang="pl">
    <?php
    create_header();
    ?>

    <body>
        <link rel="stylesheet" href="/css/prep.css">
        <link rel="stylesheet" href="/css/game.css">

        <?php
        create_menu();
        wrap_content("prep_form.php", "content");
        create_footer();
        ?>
    </body>

    </html>

<?php
}
