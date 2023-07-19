<div id="content">
    <h1>
        <?php
        echo htmlentities($_GET['name']);
        ?> - przygotowanie na <?php echo $_GET['color'] == "white" ? "białe" : "czarne" ?>
    </h1>
    <button id="download">pobierz</button>
    <div id="content2" class="merida zeit">
        <div id="board"></div>
        <div id="stats_container">
            <p id="loading">Ładowanie</p>
            <table id="stats">
            </table>
        </div>
        <div id="games_container">
            <table id="games"></table>
        </div>

    </div>
</div>