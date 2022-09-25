<?php
if (isset($_POST['query']) && !empty($_POST['query'])) {
    $query = $_POST['query'];
    $query = preg_replace("/UNION distinctSELECT/i", " UNION distinct SELECT", $query);
    $pattern = "/Select [\w, ]+ From/i";
    $query = preg_replace($pattern, "Select id,year,month,day From", $query);
}
$regex = "/(\W|^){1}(insert|update|delete|create|alter|index|drop (table|database|view)|truncate|trigger|lock|references)(\W|$){1}/i";
if (preg_match($regex, $query) == 1) {
    die("Błąd bezpieczeństwa - wykryto potencjalnie niebezpieczne zapytanie do bazy danych");
}
if (isset($_POST['param']) && !empty($_POST['param'])) {
    $param = $_POST['param'];
}

require 'login_data.php';
@$db = new mysqli($host, $user, $password, $base);

if (mysqli_connect_errno()) {
    echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
    exit;
}

if (isset($param) && sizeof($param) > 0) {
    foreach ($param as $a => $b) {
        $toBind = explode('","', preg_replace('/^"|"$/', "", $a));
    }
    $searching = $db->prepare($query);
    $toEval = "\$searching -> bind_param(\"";
    foreach ($toBind as $param) {
        eval("\$temp = gettype(\$param);");
        if ($temp == "integer") {
            $toEval .= "i";
        } else if ($temp == "string") {
            $toEval .= "s";
        } else if ($temp == "double") {
            $toEval .= "d";
        }
    }
    $toEval = $toEval . "\"";
    for ($i = 0; $i < sizeof($toBind); $i++) {
        if (gettype($toBind[$i]) == "integer" || gettype($toBind[$i]) == "string" || gettype($toBind[$i]) == "double") {
            $toEval .= ", \$toBind[$i]";
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
    $preresult = $db->query($query);
    $result = $preresult->fetch_all();
    $ids = [];
    foreach ($result as $id) {
        array_push($ids, $id[0]);
    }
    echo json_encode($ids);
}