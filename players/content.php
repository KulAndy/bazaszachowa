<style>
    #content {
        width: fit-content;
    }
</style>
<script type="module" src="/script/players.js"></script>
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
if (isset($_GET["name"])) {

?>
    <table>
        <th>Nazwisko i Imię</th>
        <th>profil</th>


        <?php
    }
    if (isset($_GET['name']) && empty($_GET['name'])) {
        create_footer();
        die("Brak zawodnika do wyszukania");
    }

    if (isset($_GET['name']) && !empty($_GET['name'])) {
        try {
            $conn = start_connection();
        } catch (Exception $e) {

            echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
        Spróbuj jeszcze raz później.</p>';
            create_footer();
            exit;
        }

        $name = replace_national(trim($_GET['name']));
        $players = search_players($conn,  $name);
        foreach ($players as $player) {
        ?>
            <tr>
                <td><?php echo $player["fullname"] ?></td>
                <td><a href="/player_data?fullname=<?php echo urlencode($player["fullname"])   ?>">zobacz</a></td>
            </tr>

        <?php
        }
    }
    if (isset($_GET["name"])) {

        ?>


    </table>
<?php
    }
