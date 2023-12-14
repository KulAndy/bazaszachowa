    <h1>Przygotowanie</h1>
    <form method="get" target="_self">
        <label for="name">Gracz</label>
        <input list="players" <?php
                                if (isset($_GET['name']) && !empty($_GET['name'])) {
                                    echo "value='" . htmlentities(trim($_GET['name'])) . "'";
                                }
                                ?> type="text" id="name" name="name" placeholder="Nowak, Jan" required autofocus>
        <datalist id="players">
        </datalist>
        <br>
        <label for="white">kolor</label><br />
        <input type="radio" name="color" id="white" value="white" checked>
        <label for="white">białe</label>
        <input type="radio" name="color" id="black" value="black">
        <label for="black">czarne</label>
        <br>
        <input type="submit" value="szukaj">
    </form>
    <script type="module">
        import DISPLAY from "/script/display_functions.js";
        let searchbar = document.getElementById("name");
        searchbar.oninput = () => {
            DISPLAY.update_data_list("name", "players");
        };
    </script>