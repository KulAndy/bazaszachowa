<div id="pre">
    <div id="content" style="text-align: center;width: 90vw;">
        <h1 style='margin: 0;margin-bottom: 0.4em;'>
            <?php
            echo htmlentities($_GET['fullname']);
            ?>
        </h1>
        <div id="info">
            <p id="maxElo"></p>
            <p id="yearRange"></p>
        </div>
        <details style="width: fit-content;margin: auto;">
            <summary>profil na yottabase <a href="https://www.yottachess.com/player/<?php echo rawurlencode($_GET['fullname']); ?>">link</a>
            </summary>
            <iframe src="https://www.yottachess.com/player/<?php echo rawurlencode($_GET['fullname']); ?>">
            </iframe>
            <?php
            echo urlencode($_GET['fullname']);
            ?>
        </details>
        <table style='border: 0;'>
            <tr id="container" style='display:flex;'>
                <td id="stats" style='border: 0;'></td>
                <td style='border: 0;'>
                    <img id='graph' onerror="this.remove()">
                </td>
            </tr>
        </table>
        <table id='table'>
        </table>
    </div>
</div>