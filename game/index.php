<?php
include "../header.php"
?>
<?php
include "../menu.php"
?>
<script>
    let request = <?php echo json_encode($_REQUEST); ?>;
</script>
<script defer src="/game/pgnv.js" type="text/javascript"></script>
<script defer src="/script/game_display_functions.js"></script>
<script defer src="/script/game.js"></script>
<?php require 'content.php';
?>
<dialog id="dialog"></dialog>
<?php
include '../footer.php';
?>