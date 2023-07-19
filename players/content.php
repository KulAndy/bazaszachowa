<div id="content" style="width: fit-content;">
    <form method="get" style="text-align: center;" target="_self">
        <label for="name">Gracz</label>
        <input list="players" <?php
                                if (isset($_GET['name']) && !empty($_GET['name'])) {
                                    echo "value='" . htmlentities(trim($_GET['name'])) . "'";
                                }
                                ?> type="text" id="name" name="name" placeholder="Nowak, Jan" required autofocus>
        <br>
        <datalist id="players">
        </datalist>
        <input type="submit" value="szukaj">
    </form>
    <?php
    if (isset($_GET['name']) && empty($_GET['name'])) {
        include '../footer.php';
        die("Brak zawodnika do wyszukania");
    }

    if (isset($_GET['name']) && !empty($_GET['name'])) {
        require 'login_data.php';
        @$db = new mysqli($host, $user, $password, $base);

        if (mysqli_connect_errno()) {
            echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
            exit;
        }
        $name = trim($_GET['name']) . "%";
        $name = str_replace("ą", "a", $name);
        $name = str_replace("ć", "c", $name);
        $name = str_replace("ę", "e", $name);
        $name = str_replace("ł", "l", $name);
        $name = str_replace("ń", "n", $name);
        $name = str_replace("ó", "o", $name);
        $name = str_replace("ś", "s", $name);
        $name = str_replace("ź", "z", $name);
        $name = str_replace("ż", "z", $name);
        $name = str_replace("Ą", "a", $name);
        $name = str_replace("Ć", "c", $name);
        $name = str_replace("Ę", "E", $name);
        $name = str_replace("Ł", "L", $name);
        $name = str_replace("Ń", "N", $name);
        $name = str_replace("Ó", "O", $name);
        $name = str_replace("Ś", "S", $name);
        $name = str_replace("Ź", "Z", $name);
        $name = str_replace("Ż", "Z", $name);
        $searching = $db->prepare("SELECT fullname FROM $table1 WHERE fullname like ?");
        $searching->bind_param('s', $name);
        $searching->execute();
        $searching->store_result();
        if ($searching->num_rows == 0) {
            $query = "SELECT fullname FROM $table2 WHERE fullname like ? ";
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
            echo "<table style='margin: auto;border: 2px solid black'><th>Nazwisko i Imię</th><th>profil</th>";
            while ($searching->fetch()) {
                echo "<tr><td>" . $fullname . "</td><td><a href='/player_data?fullname=" . urlencode($fullname) . "'>zobacz</a></tr>";
            }
            echo "</table>";
        }
    }

    ?>
</div>