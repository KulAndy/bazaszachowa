<form action="/contact/send.php" method="post" id="form" target="_self" enctype="multipart/form-data">
    <h3>Email: </h3>
    <input type="email" name="email" required>
    <h3>Temat: </h3>
    <input type="radio" id="sub1" name="subject" value="Pomysł" required>
    <label for="sub1">Pomysł</label><br>
    <input type="radio" id="sub2" name="subject" value="Uwaga" required>
    <label for="sub2">Uwaga</label><br>
    <input type="radio" id="sub3" name="subject" value="Błąd w partii" required>
    <label for="sub3">Błąd w partii</label><br>
    <input type="radio" id="sub4" name="subject" value="Brakująca partia" required>
    <label for="sub4">Brakująca partia</label><br>
    <input type="radio" id="sub5" name="subject" value="Błąd techniczny" required>
    <label for="sub5">Błąd techniczny</label><br>
    <input type="radio" id="sub6" name="subject" value="Inne" required>
    <label for="sub6">Inne</label><br>
    <h4>Treść: </h4>
    <textarea rows="6" cols="50" name="content" form="form" placeholder="Wpisz tekst..."></textarea><br>

    <label for="attachment">Partia (akceptowane pliki *.pgn, *.txt, *.cbv, *.zip, *.7z, *.rar max
        200MB)</label><br />
    <input type="file" id="attachment" name="attachment" accept=" .pgn, .txt, .cbv, .zip, .7z, .rar " /><br />
    <input type="submit" name="submit" value="wyślij">
</form>
<address>
    <p>telefon: <a href="tel:+48730758890">+48 730 758 890</a></p>
    <p>mail: <a href="andykrk22@gmail.com">andykrk22@gmail.com</a></p>
</address>