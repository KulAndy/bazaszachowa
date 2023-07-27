<?php
require '../header.php';
include '../menu.php';
?>
<style>
@media only screen and (min-width: 769px) {
    #content {
        display: flex;
    }
}


#content address {
    height: fit-content;
    background-color: var(--odd-row);
}
</style><?php echo '<script defer src="/contact/script.js"></script>';
        echo "<div id='content'>";
        require 'content.php';
        echo "</div>";
        include '../footer.php';