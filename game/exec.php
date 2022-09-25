<?php
if (isset($_POST['query']) && !empty($_POST['query'])) {
    $query = $_POST['query'];
    $query = preg_replace("/UNION distinctSELECT/i", " UNION distinct SELECT", $query);
    $pattern = "/Select [\w, ]+ From/i";
    $query = preg_replace($pattern, "Select id,year,month,day From", $query);
}
$regex = "/[^\W](insert|update|delete|create|alter|index|drop (table|database|view)|truncate|trigger|lock|references)[\W$]/i";
if (preg_match($regex, $query) == 1) {
    die("Błąd bezpieczeństwa - wykryto potencjalnie niebezpieczne zapytanie do bazy danych");
}
if (isset($_POST['param']) && !empty($_POST['param'])) {
    $param = $_POST['param'];
}

if (isset($param)) {
    $searching = $db->prepare($query);
    $toEval = "\$searching -> bind_param(\"";
    foreach ($param as $parameter) {
        eval("\$temp = gettype($parameter);");
        if ($temp == "integer") {
            $toEval = $toEval . "i";
        } else if ($temp == "string") {
            $toEval = $toEval . "s";
        } else if ($temp == "double") {
            $toEval = $toEval . "d";
        }
    }
    $toEval = $toEval . "\"";
    foreach ($param as $parameter) {
        if (gettype($paramparameter) == "integer" || gettype($parameter) == "string" || gettype($parameter) == "double") {
            $toEval = $toEval . ", $parameter";
        }
    }
    $toEval = $toEval . ");";
    eval($toEval);
    $searching->execute();
    $result = $searching->get_result();
    $ids = [];
    while ($row = $result->fetch_assoc()) {
        array_push($ids, $row['id']);
    }
    echo json_encode($ids);
} else {
    require 'login_data.php';
    @$db = new mysqli($host, $user, $password, $base);

    if (mysqli_connect_errno()) {
        echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
        exit;
    }
    $preresult = $db->query($query);
    $result = $preresult->fetch_all();
    $ids = [];
    foreach ($result as $id) {
        array_push($ids, $id[0]);
    }
    echo json_encode($ids);
}