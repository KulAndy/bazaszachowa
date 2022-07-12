<?php
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    require 'login_data.inc';
    @$db = new mysqli($host, $user, $password, $base);

    if (mysqli_connect_errno()) {
       echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
       exit;
    }

    if( isset($_GET['id']) && !empty($_GET['id'])){
        $id = $_GET['id'];
    }
    else{
        die("Nie podano partii do wyświetlenia");
    }

    $query = "SELECT * FROM $table WHERE id = ?";
    $searching = $db -> prepare($query);
    $searching -> bind_param("i", $id );
    $searching -> execute();
    $result = $searching -> get_result();
    while ($row = $result->fetch_assoc()) {
        echo "<br>";
        echo "[Event \"".$row['Event']."\"]<br>";
        echo "[Site \"".$row['Site']."\"]<br>";
        echo "[Date \"".$row['Year'].".";
        if($row['Month'] == null){
            echo "?.";
        }
        else{
            echo $row["Month"].".";
        }
        if($row['Day'] == null){
            echo "?\"]<br>";
        }
        else{
            echo $row["Day"]."\"]<br>";
        }
        echo "[Round \"".$row['Round']."\"]<br>";
        echo "[White \"".$row['White']."\"]<br>";
        echo "[Black \"".$row['Black']."\"]<br>";
        echo "[Result \"".$row['Result']."\"]<br>";
        if( $row['ECO'] != null ){
            echo "[ECO \"".$row['ECO']."\"]<br>";
        }
        if( $row['WhiteElo'] != null ){
            echo "[WhiteElo \"".$row['WhiteElo']."\"]<br>";
        }
        if( $row['BlackElo'] != null ){
            echo "[BlackElo \"".$row['BlackElo']."\"]<br>";
        }
        echo "<br>".$row['moves']."<br><br>";
    }

    $db -> close();

?>
