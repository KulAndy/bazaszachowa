<?php
    require '../header.php';
    include '../menu.php';
    echo "<div id='content'>";
    if( isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['subject']) && !empty($_POST['subject']) 
    && isset($_POST['content']) && !empty($_POST['content']) && trim($_POST['content']) != "Wpisz tekst..." ){
        $receiver = "andykrk22@gmail.com";
        $subject = $_POST['subject'];
        $mssg = $_POST['content']."\n kontakt: ".$_POST['email']."\n wygenerowano przez bazaszachowa.smallhost.pl  ".date("Y.m.d H:i:s");
        $mssg = wordwrap($mssg);
        if(mail($receiver,$subject, $mssg) ){
            echo "Wysłano wiadomość";
        }
        else{
            echo "Napotkano problem<br>Proszę spróbować później";
        }
    }
    else{
        echo "Brakuje danych w formularzu";
    }

    
    echo "</div>";
    include '../footer.php';

?>