<?php
function create_request_js_module()
{
?>
    <script id="req">
        function get_data() {
            return <?php echo   json_encode($_GET) ?>
        }

        function post_data() {
            return <?php echo   json_encode($_POST) ?>
        }

        function request_data() {
            return <?php echo   json_encode($_REQUEST)  ?>
        }
    </script>
<?php
}
