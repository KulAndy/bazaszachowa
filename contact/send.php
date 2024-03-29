<html lang="pl">
<?php
require_once(__DIR__ . "/../php_functions/functions.php");
create_header();
?>

<body>
    <?php
    create_menu();
    $file_size =
        $_FILES["attachment"]["size"] / (1024 * 1024); //size in MBs

    $max_allowed_file_size = 100; // size in MB

    if ($max_allowed_file_size < $file_size) {
        echo "<div id='content'>";
        echo "plik jest za duży";
        echo "</div>";
        create_footer();
        exit(1);
    }

    echo "<div id='content'>";


    if (isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['subject']) && !empty($_POST['subject']) && isset($_POST['content']) && !empty($_POST['content'])) {
        $to = "andykrk22@gmail.com";
        $from = $_POST['email'];
        $subject = $_POST['subject'];

        if (!empty($_FILES['attachment']['name']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
            // Proceed with attachment handling
            $file_name = $_FILES['attachment']['name'];
            $temp_file = $_FILES['attachment']['tmp_name'];
            $file_size = $_FILES['attachment']['size'];
            $file_type = $_FILES['attachment']['type'];
            $file_content = file_get_contents($temp_file);
            $file_encoded = chunk_split(base64_encode($file_content));
        }

        $boundary = md5(uniqid(time()));
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From: bazaszachowa@bazaszachowa.smallhost.pl\r\n";
        $headers .= "Reply-To: " . $from . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

        $message = "--$boundary\r\n";
        $message .= "Content-Type: text/plain; charset=\"iso-8859-1\"\r\n";
        $message .= $_POST['content'] . "\n kontakt: " . $_POST['email'] . "\n wygenerowano przez " . $_SERVER['SERVER_NAME'] . " " . date("Y.m.d H:i:s");
        $message .= "\r\nContent-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $message . "\r\n";

        if (!empty($_FILES['attachment']['name'])) {
            if ($_FILES['attachment']['error'] === UPLOAD_ERR_OK) {


                $message .= "--$boundary\r\n";
                $message .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
                $message .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
                $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
                $message .= $file_encoded . "\r\n";
                $message .= "--$boundary--";
            } else {
                echo "<p>Wystąpiły problemy z przesłaniem pliku</p>";
            }
        }
        if (mail($to, $subject, $message, $headers)) {
            echo "<p>Wysłano wiadomość</p>";
        } else {
            echo "<p>Napotkano problem<br>Proszę spróbować później</p>";
        }
        print_r(error_get_last());
    } else {
        echo "Brakuje danych w formularzu";
    }


    echo "</div>";
    create_footer();
    ?>
</body>

</html>