<?php
require '../header.php';
?>
<style>
th {
    border: 2px solid black !important;
}

summary {
    border: 1px solid black;
}

p[style='text-align: center;'] {
    border: 1px solid black;
}
</style>
<?php
include '../menu.php';
?>
<script src="/search/functions.js" defer></script>
<script>
var request = <?php echo json_encode($_REQUEST) ?>;
</script>
<script src="/player_data/script.js" defer></script>
<?php
require 'content.php';
include '../footer.php';
?>