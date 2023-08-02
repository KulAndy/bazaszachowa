    <?php
    if (isset($_GET["token"])) {

        $conn = start_connection();

        $params = [
            ":token" => $_GET["token"]
        ];

        $query = "UPDATE " . $GLOBALS["database"]["bug_reporters"] . " set status_id = 2 WHERE token = :token AND status_id = 1 ";

        $rows = bind_params($conn, $query, $params);

        $query = "SELECT status FROM " .
            $GLOBALS["database"]["bug_reporters"] . " as reporters INNER JOIN " .
            $GLOBALS["database"]["bug_reporters_status"] . " as status on reporters.status_id = status.id  WHERE token = :token";

        $rows = bind_params($conn, $query, $params);

        if (sizeof($rows) == 0) {
            echo "<p>Błędny token weryfikacyjny</p>";
        } else {
            echo "<p>Status maila: " . $rows[0]["status"] . "</p>";
        }
        close_connection($conn);
    } else {
        echo "<p>Brak tokenu weryfikacyjnego</p>";
    }
    ?>