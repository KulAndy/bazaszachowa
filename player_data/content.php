<div id="pre">
    <div id="content" style="text-align: center;width: 90vw;">
        <h1 style='margin: 0;margin-bottom: 0.4em;'>
            <?php
            echo htmlentities($_GET['fullname']);
            ?></h1>
        <div id="info">
            <p id="maxElo"></p>
            <p id="yearRange"></p>
        </div>
        <table style='border: 0;'>
            <tr id="container" style='display:flex;'>
                <td id="stats" style='border: 0;'></td>
                <td style='border: 0;'>
                    <img id='graph'>
                </td>
            </tr>
        </table>
        <table id='table' onerror="this.remove()">
        </table>
    </div>
</div>