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
        <div id="data-container">
            <div id="cr-data-container"></div>
            <div id="fide-data-container"></div>
        </div>
        <table>
            <tr>
                <th colspan="2">przygotowanie</th>
            </tr>
            <tr>
                <td>
                    <a href="/preparation/?name=<?php echo rawurlencode($_GET['fullname']) ?>&color=white">białe</a>
                </td>
                <td>
                    <a href="/preparation/?name=<?php echo rawurlencode($_GET['fullname']) ?>&color=black">czarne</a>

                </td>
            </tr>
        </table>
        <details style="width: fit-content;margin: auto;">
            <summary>profil na yottabase <a href="https://www.yottachess.com/player/<?php echo rawurlencode($_GET['fullname']);
                                                                                    ?>">link</a>
            </summary>
            <iframe loading="lazy"
                src="https://www.yottachess.com/player/<?php echo rawurlencode($_GET['fullname']); ?>">
            </iframe>
        </details>

        <table style='border: 0;'>
            <tr id="container" style='display:flex;'>
                <td id="stats" style='border: 0;'>
                    <div id="loading_stats" class="loading" style="display: none;">
                        <div class="spin"></div>
                        <p>Ładowanie statystyk ... </p>
                    </div>
                </td>
                <td style='border: 0;'>
                    <img id='graph' onerror="this.remove()">
                </td>
            </tr>
        </table>
        <table id='games'>
        </table>
        <div id="loading" class="loading" style="display: none;">
            <div class="spin"></div>
            <p>Ładowanie ...</p>
        </div>
    </div>
</div>