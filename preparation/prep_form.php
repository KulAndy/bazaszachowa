<div id="content">
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
        <label for="white">color</label><br />
        <input type="radio" name="color" id="white" value="white" checked>
        <label for="white">białe</label>
        <input type="radio" name="color" id="black" value="black">
        <label for="black">czarne</label>
        <br>
        <input type="submit" value="szukaj">
    </form>
</div>

<script defer>
let searchbar = document.getElementById("name");
let datalist = document.getElementById("players");
searchbar.oninput = () => {
    updateDataList();
};

function updateDataList() {
    let player = searchbar.value;
    datalist.innerHTML = "";

    if (player.length > 3) {
        const xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", "/API/search_player.php", true);
        let messenge = "player=" + encodeURIComponent(player) + "&base=all";
        xhttp2.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    let json = JSON.parse(this.responseText);
                    for (finded of json) {
                        let option = document.createElement("option");
                        option.value = finded.toString();
                        datalist.append(option);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };

        xhttp2.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xhttp2.send(messenge);
    }
}
</script>