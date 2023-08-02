<?php
session_start();

ob_start();

require_once(__DIR__ . "/../php_functions/functions.php");

function checkAndSetCookie(string $cookieName, int $expiration_time)
{
    if (isset($_COOKIE[$cookieName])) {
        $current_value = $_COOKIE[$cookieName];
        $new_value = (int)$current_value + 1;
    } else {
        $new_value = 1;
    }

    setcookie($cookieName, $new_value, $expiration_time, '/');


    return $new_value;
}

function send_bug(
    int $gameid,
    string $table,
    string $lastname,
    string $firstname,
    string $email,
    string $type,
    string $notices,
    string $link
) {
    $conn = start_connection();
    try {
        $token = add_reporter($conn, $lastname, $firstname, $email);
        add_report($conn, $gameid, $table, $token, $type, $notices, $link);
        $expiration_time = time() + (15 * 60);
        checkAndSetCookie('sended_bugs', $expiration_time);
        if (isset($_POST["remember"]) && $_POST["remember"] == "on") {
            setcookie("firstname", $firstname, 0, '/');
            setcookie("lastname", $lastname, 0, '/');
            setcookie("email", $email, 0, '/');
        } else {
            setcookie("firstname", "", time() - 3600, '/');
            setcookie("lastname", "", time() - 3600, '/');
            setcookie("email", "", time() - 3600, '/');
        }
?>
        <p>Pomyślnie wysłano raport</p>
        <p>Zostaną uwzględnione tylko zgłoszenia ze zweryfikowanych mailów (link wysłany na podany adres)</p>
    <?php

    } catch (Exception $e) {
    ?>
        <p>nie udało się wysłać raportu</p>
<?php
    } finally {
        session_destroy();
        close_connection($conn);
    }
}
?>

<html lang="pl">

<?php create_header(); ?>

<body>
    <?php
    create_menu();
    ?>
    <div id="content">
        <?php
        if (!isset($_POST["agreement"]) || $_POST["agreement"] != "on") {
            echo "<p>/brak wymaganej zgody na przetwarzanie danych</p>";
        } else if (
            isset($_POST["id"])
            && !empty($_POST["id"])
            &&    isset($_POST["table"])
            && !empty($_POST["table"])
        ) {
            if (isset($_POST["g-recaptcha-response"])) {
                $secretKey = $GLOBALS["recaptcha"]["private"];
                $response = $_POST['g-recaptcha-response'];

                $verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
                $data = array('secret' => $secretKey, 'response' => $response);

                $options = array(
                    'http' => array(
                        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                        'method' => 'POST',
                        'content' => http_build_query($data)
                    )
                );

                $context = stream_context_create($options);
                $verify = file_get_contents($verificationUrl, false, $context);
                $captchaSuccess = json_decode($verify)->success;

                if ($captchaSuccess) {
                    @send_bug(
                        $_POST["id"],
                        $_POST["table"],
                        trim($_POST["lastname"]),
                        trim($_POST["firstname"]),
                        trim($_POST["email"]),
                        $_POST["type"],
                        trim($_POST["notices"]),
                        trim($_POST["link"])
                    );
                } else {
                    echo "<p>reCAPTCHA - wykryto błąd.</p>";
                }
            } else if (
                isset($_POST["integrity"])
                && isset($_SESSION["csrf_token"])
                && $_POST["integrity"] == md5($_POST["id"] . $_POST["table"] . $_SESSION["csrf_token"])
            ) {
                @send_bug(
                    $_POST["id"],
                    $_POST["table"],
                    trim($_POST["lastname"]),
                    trim($_POST["firstname"]),
                    trim($_POST["email"]),
                    $_POST["type"],
                    trim($_POST["notices"]),
                    trim($_POST["link"])
                );
            } else {
                echo "Brakuje danych do autoryzacji. Naruszono integralność przesłanych danych";
            }
        } else {
            echo "Brakuje danych zgłoszonej gry.";
        }

        ?>
    </div>
</body>

</html>

<?php
ob_end_flush();

?>