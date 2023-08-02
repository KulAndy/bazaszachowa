<?php
function add_reporter(
    PDO $conn,
    string $lastname,
    string $firstname,
    string $email
) {
    $token = md5($lastname . $firstname . $email);
    $query = "INSERT IGNORE INTO " . $GLOBALS["database"]["bug_reporters"] . " (lastname, firstname, email, token) " .
        "VALUES(:lastname, :firstname, :email, '$token' )";

    $params = [
        ":lastname" => $lastname,
        ":firstname" => $firstname,
        ":email" => $email
    ];
    bind_params($conn, $query, $params);
    check_status($conn, $email, $token);

    return $token;
}


function check_status(PDO $conn, string $email, string $token)
{
    $query = "SELECT status_id FROM " . $GLOBALS["database"]["bug_reporters"] . "  WHERE token = :token";
    $params = [
        ":token" => $token
    ];
    $rows = bind_params($conn, $query, $params);
    switch ($rows[0]["status_id"]) {
        case 1:
            send_activation_mail($email, $token);
            break;
        case 3:
            throw new InvalidArgumentException("Osoba o podanym imieniu i nazwisku lub mailu została zbanowana");
        case 5:
            throw new InvalidArgumentException("Osoba o podanym imieniu i nazwisku lub mailu została uznana za bota");
    }
}

function send_activation_mail(string $email, string $token)
{
    $to = $email;
    $subject = "Link weryfikacyjny";
    $message = "W związku ze zgłoszeniem błędu został wygenerowano następujący link aktywacyjny " . $_SERVER["SERVER_NAME"] .  $GLOBALS["nomenu_urls"]["activation"] . "?token=$token (po potwierdzeniu nie zostaną wysłane żadne inne linki)";
    $headers = "From: bazaszachowa@bazaszachowa.smallhost.pl\r\n" .
        "Reply-To: bazaszachowa@bazaszachowa.smallhost.pl\r\n" .
        "X-Mailer: PHP/" . phpversion();
    mail($to, $subject, $message, $headers);
}
