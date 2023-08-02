<?php
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $csrf_token;


    ?>
<script>
function get_csrf_token() {
    return "<?php echo $csrf_token ?>";
}
</script>

<dialog id="dialog"></dialog>
<div id="content3">
    <div id="buttonContainer">
        <button id="first" title="Ctrl + &uarr;  " disabled>pierwsza partia</button>
        <button id="previous" title="Ctrl + &larr;" disabled>poprzednia partia</button>
        <button id="next" title="Ctrl + &rarr;" disabled>następna partia</button>
        <button id="last" title="Ctrl + &darr;" disabled>ostatnia partia</button>
    </div>
</div>
<div id="pre" class="merida zeit" onkeydown="event.preventDefault()">
    <div id="content2">
        <div id="board"></div>
        <div id="engine_container">
            <h2 class="inactive">stockfish</h2>
            <p id="depth_p">głębokość: <span id="depth"></span></p>
            <p id="eval_p">ocena: <span id="eval"></span></p>
            <p>najlepszy ruch:
                <span id="bestmove"></span>
            </p>
            <p id="first_v"></p>
            <p id="second_v"></p>
            <p id="third_v"></p>
        </div>
    </div>
</div>