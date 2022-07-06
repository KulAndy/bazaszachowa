<?php
    echo '<form action="/contact/send.php" method="post" id="form" target="_self" enctype="multipart/form-data">
    <h3>Email: </h3>
    <input type="email" name="email" required >
    <h3>Temat: </h3>
    <input type="radio" id="sub1" name="subject" value="Pomysł" required>
    <label for="sub1">Pomysł</label><br>
    <input type="radio" id="sub2" name="subject" value="Uwaga" required>
    <label for="sub2">Uwaga</label><br>
    <input type="radio" id="sub3" name="subject" value="Wniosek" required>
    <label for="sub3">Wniosek</label><br>
    <input type="radio" id="sub4" name="subject" value="Błąd" required>
    <label for="sub4">Błąd w partii</label><br>
    <input type="radio" id="sub5" name="subject" value="Brak" required>
    <label for="sub5">Brakująca partia</label><br>
    <input type="radio" id="sub6" name="subject" value="Inne" required>
    <label for="sub6">Inne</label><br>
    <h4>Treść: </h4>
    <textarea rows="6" cols="50" name="content" form="form" placeholder="Wpisz tekst..." ></textarea><br>

    <input type="submit" name="submit value="wyślij">

    </form>'
?>