<?php
    require 'login_data.php';
    @$db = new mysqli($host, $user, $password, $base);

    if (mysqli_connect_errno()) {
       echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
       exit;
    }

    if( isset($_POST['id']) && !empty($_POST['id'])){
        $id = $_POST['id'];
    }
    else{
        die("Nie podano partii do wyświetlenia");
    }
    $data = array(
        "rows" => array()
        // "debbug" => array()
    );

    $query = "SELECT * FROM $table WHERE id = ?";
    $searching = $db -> prepare($query);
    $searching -> bind_param("i", $id );
    $searching -> execute();
    $result = $searching -> get_result();
    while ($row = $result->fetch_assoc()) {
        array_push($data["rows"], $row);
    }
    print_r(json_encode($data));    
    $db -> close();


?>
