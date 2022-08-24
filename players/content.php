<div id="content">
    <form method="post" style="text-align: center;" target="_self">
        <label for="name">Gracz</label>
        <input type="text" id="name" name="name" placeholder="Nowak, Jan" required><br>
        <input type="submit" value="szukaj">
    </form>
    <?php
    if (isset($_POST['name']) && !empty($_POST['name'])) {
        require 'login_data.php';
        @$db = new mysqli($host, $user, $password, $base);

        if (mysqli_connect_errno()) {
            echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
            exit;
        }
        $name = $_POST['name'] . "%";
        $searching = $db->prepare("SELECT fullname FROM $table1 WHERE fullname like ? and fullname not like '%.'");
        $searching->bind_param('s', $name);
        $searching->execute();
        $searching->store_result();
        if ($searching->num_rows == 0) {
            $query = "SELECT fullname FROM $table2 WHERE fullname like ? and fullname not like '%.'";
            $searching = $db->prepare($query);
            $searching->bind_param('s', $name);
            $searching->execute();
            $searching->store_result();
            if ($searching->num_rows == 0) {
                echo "Nie znaleziono żadnego zawodnika";
            } else {
                $searching->bind_result($fullname);
                echo "<table style='margin: auto;'><th>Nazwisko i Imię</th><th>profil</th>";
                while ($searching->fetch()) {
                    echo "<tr><td>" . $fullname . "</td><td><a href='/player_data?fullname=" . urlencode($fullname) . "'>zobacz</a></tr>";
                }
                echo "</table>";
            }
        } else {
            $searching->bind_result($fullname);
            echo "<table style='margin: auto;'><th>Nazwisko i Imię</th><th>profil</th>";
            while ($searching->fetch()) {
                echo "<tr><td>" . $fullname . "</td><td><a href='/player_data?fullname=" . urlencode($fullname) . "'>zobacz</a></tr>";
            }
            echo "</table>";
        }
    }

    ?>
</div>