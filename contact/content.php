<?php
    echo '<form action="/contact/send.php" method="post" id="form" target="_self" enctype="multipart/form-data">
    <h3>Email: </h3>
    <input type="email" name="email" required >
    <h3>Temat: </h3>
    <input type="radio" id="sub1" name="subject" value="Pomysł" required>
    <label for="sub1">Pomysł</label><br>
    <input type="radio" id="sub2" name="subject" value="Uwaga" required>
    <label for="sub2">Uwaga</label><br>
    <input type="radio" id="sub3" name="subject" value="Błąd w partii" required>
    <label for="sub3">Błąd w partii</label><br>
    <input type="radio" id="sub4" name="subject" value="Brakująca partia" required>
    <label for="sub4">Brakująca partia</label><br>
    <input type="radio" id="sub5" name="subject" value="Inne" required>
    <label for="sub5">Inne</label><br>
    <h4>Treść: </h4>
    <textarea rows="6" cols="50" name="content" form="form" placeholder="Wpisz tekst..." ></textarea><br>

    <label for="file">Partia (akceptowane pliki *.pgn, *.txt)</label>
    <input type="file" id="file" accept=" .pgn, .txt"><br>
    <input type="hidden" id="hidden" name="data">
    <input type="hidden" id="hidden2" name="type">
    <input type="hidden" id="hidden3" name="name">
    <input type="submit" name="submit value="wyślij">
    </form>';
?>