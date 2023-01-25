<?php
require '../header.php';
?>
<link rel="stylesheet" href="/player_data/player_data.css">
<?php
include '../menu.php';
?>
<script src="/player_data/functions.js" defer></script>
<script>
var request = <?php echo json_encode($_REQUEST) ?>;
</script>
<script src="/player_data/script.js" defer></script>
<?php
require 'content.php';
include '../footer.php';
?>