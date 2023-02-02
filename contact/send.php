<?php
require '../header.php';
include '../menu.php';
?>
<style>
#content {
    text-align: center;
}
</style>
<?php
$file_size =
    $_FILES["file"]["size"] / (1024 * 1024); //size in MBs

$max_allowed_file_size = 100; // size in MB

if ($max_allowed_file_size < $file_size) {
    echo "<div id='content'>";
    echo "plik jest za duży";
    echo "</div>";
    include("../footer.php");
    exit(1);
}

if (isset($_FILES["file"]) && !empty($_FILES["file"]) && count($_FILES) > 0) {
    $games = file_get_contents($_FILES["file"]["tmp_name"]);
}

echo "<div id='content'>";

if (isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['subject']) && !empty($_POST['subject']) && isset($_POST['content']) && !empty($_POST['content'])) {
    $receiver = "andykrk22@gmail.com";
    $subject = $_POST['subject'];
    $mssg = $_POST['content'] . "\n kontakt: " . $_POST['email'] . "\n wygenerowano przez bazaszachowa.smallhost.pl  " . date("Y.m.d H:i:s");

    if (isset($games)) {
        $mssg .= "\n\nPartie\n\n";
        $mssg .= file_get_contents($_FILES["file"]["tmp_name"]);
    }

    $mssg = wordwrap($mssg);

    if (mail($receiver, $subject, $mssg)) {
        echo "Wysłano wiadomość";
    } else {
        echo "Napotkano problem<br>Proszę spróbować później";
    }
} else {
    echo "Brakuje danych w formularzu";
}


echo "</div>";
include '../footer.php';