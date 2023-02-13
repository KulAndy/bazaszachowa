<div id="pre">
    <div id="content" style="text-align: center;width: 90vw;">
        <?php
        echo "<h1 style='margin: 0;margin-bottom: 0.4em;'>" . htmlentities($_GET['fullname']) . "</h1>";
        ?>
        <div id="info">
            <p id="maxElo"></p>
            <p id="yearRange"></p>
        </div>
        <table style='border: 0;'>
            <tr id=" container" style='display:flex;'>
                <td id="stats" style='border: 0;'></td>
                <td style='border: 0;'>
                    <?php echo "<img id='graph' onerror='this.remove()' src='/API/graph.php?name=" . urlencode($_GET['fullname']) . "&base=all'>"; ?>
            </tr>
        </table>
        <table id='table'>
        </table>
    </div>
</div>