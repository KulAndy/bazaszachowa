<div id="content">
    <h1>
        <a href='/player_data?fullname=<?php echo urlencode($_GET["name"]) ?>'>
            <?php echo htmlentities($_GET['name']);?>
        </a>
        - przygotowanie na <?php echo $_GET['color'] == "white" ? "białe" : "czarne" ?>
    </h1>
    <button id="download">pobierz</button>
    <div id="content2" class="merida zeit">
        <div id="board"></div>
        <div id="stats_container">
            <div id="loading" class="loading">
                <div class="spin"></div>
                <p>Ładowanie ...</p>
            </div>
            <table id="stats">
            </table>
        </div>
        <div id="games_container">
            <table id="games"></table>
        </div>

    </div>
</div>