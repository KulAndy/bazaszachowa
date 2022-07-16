<?php
    require '../header.php';
    include '../menu.php';
    echo "<div id='content'><pre>";
    if( isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['subject']) && !empty($_POST['subject']) 
    && isset($_POST['content']) && !empty($_POST['content'])){
        $receiver = "andykrk22@gmail.com";
        $subject = $_POST['subject'];
        $mssg = $_POST['content']."\n kontakt: ".$_POST['email']."\n wygenerowano przez bazaszachowa.smallhost.pl  ".date("Y.m.d H:i:s");
        if(isset($_POST['type'])){
            if($_POST['type'] == "application/vnd.chess-pgn" || $_POST['type'] == "text/plain"){
                if(isset($_POST['data'])){
                    $mssg .= "\n\ndane:\n".$_POST['data'];
                }
            }
        }
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

    
    echo "</pre></div>";
    include '../footer.php';

?>