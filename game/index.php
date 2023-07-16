<?php
include "../header.php"
?>
<link rel="stylesheet" href="/css/game.css">
<?php
include "../menu.php"
?>
<script>
    let request = <?php echo json_encode($_REQUEST); ?>;
</script>
<script defer src="/script/pgnv.js" type="text/javascript"></script>
<script defer src="/script/chess.js"></script>
<script defer src="/script/stockfish_controller.js"></script>
<script defer src="/script/game_display_functions.js"></script>
<script defer src="/script/game.js"></script>

<?php require 'content.php';
?>
<dialog id="dialog"></dialog>
<?php
include '../footer.php';
?>