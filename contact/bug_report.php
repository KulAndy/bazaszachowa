<html lang="pl">
<?php
session_start();
?>

<?php
require_once(__DIR__ . "/../php_functions/functions.php");
create_header();
?>

<body>
    <?php
    if (
        !isset($_COOKIE["sended_bugs"])
        || $_COOKIE["sended_bugs"] % 10 == 0
    ) {
    ?>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <?php
    }
    ?>
    <link rel="stylesheet" href="/css/bug_report.css">
    <?php
    create_menu();
    ?>
    <div id="content">
        <?php
        $firstname = $_COOKIE["firstname"] ?? "";
        $lastname = $_COOKIE["lastname"] ?? "";
        $email = $_COOKIE["email"] ?? '';
        $remember = isset($_COOKIE["firstname"]) && isset($_COOKIE["lastname"])  && isset($_COOKIE["email"]);
        if (
            !isset($_POST["id"])
            || empty($_POST["id"])
            || !isset($_POST["table"])
            || empty($_POST["table"])
            || !isset($_POST["csrf_token"])
            || empty($_POST["csrf_token"])
        ) {
            echo "<p>Nie udało się znaleźć danych potrzebnych do zgłoszenia błędu. Wróć do gry i zgłoś błąd jeszcze raz</p>";
        } else {
            if (
                !isset($_SERVER["HTTP_REFERER"])
            ) {
                echo "<p>Brak poprzedniej strony, Odmowa ze względu na podejrzane zachowanie</p>";
            } else {
                $previous_page = parse_url($_SERVER["HTTP_REFERER"]);
                @parse_str($previous_page["query"], $params);
                if (
                    !isset($previous_page["query"])
                    || !isset($params["id"])
                    || !isset($params["base"])
                ) {
                    echo "<p>Podejrzama poprzednia strona, Odmowa ze względu na podejrzane zachowanie</p>";
                } else {
                    if (
                        $params["id"] != $_POST["id"]
                        || $params["base"] != $_POST["table"]
                    ) {
                        echo "<p>Przesłane dane są niezgodne z poprzednią stroną. Odmowa ze względu na podejrzane zachowanie</p>";
                    } else if (!isset($_SESSION["csrf_token"]) || $_POST["csrf_token"] != $_SESSION["csrf_token"]) {
                        echo "<p>Niepoprawny token kontrolny. Może być konieczne włączenie ciasteczek.Odmowa ze względu na podejrzane zachowanie</p>";
                    } else {
        ?>
                        <form action="/contact/send_bug.php" method="post" id="form" target="_self">
                            <table class="no_border">
                                <tr>
                                    <td>
                                        <label for="lastname">Nazwisko*</label>
                                    </td>
                                    <td>
                                        <input name="lastname" id="lastname" required value="<?php echo $lastname ?>" /> <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="firstname">Imię*</label>

                                    </td>
                                    <td>
                                        <input name="firstname" id="firstname" required value="<?php echo  $firstname ?>" /> <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="email">email*</label>
                                    </td>
                                    <td>
                                        <input type="email" name="email" id="email" required value="<?php echo  $email ?>">
                                        <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="link">link do turnieju/poprawnej partii </label>
                                    </td>
                                    <td>
                                        <input type="url" name="link" id="link" /> <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="type" id="problemLabel">Problem</label>
                                    </td>
                                    <td>
                                        <div id="radioContainer">
                                            <input type="radio" name="type" value="błędny zapis" id="wrongNotation" required />
                                            <label for="wrongNotation">Nieprawidłowy zapis</label>
                                            <input type="radio" name="type" value="nie istnieje" id="notExist" require />
                                            <label for="notExist">Nieisniejąca partia</label>
                                            <input type="radio" name="type" value="błędne dane" id="wrongData" require />
                                            <label for="wrongData">Błędne dane</label>

                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <label for="notices">dodatkowe informacje</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <textarea name="notices" id="notices" cols="75" rows="10"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div>
                                            <input type="checkbox" name="agreement" id="agreement" required checked>
                                            <label for="agreement">Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb
                                                niezbędnych do realizacji procesu przetwarzania zgłoszenia błędu zgodnie z ustawą z
                                                dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000)
                                                oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
                                                27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem
                                                danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia
                                                dyrektywy 95/46/WE (RODO). Administratorem danych jest autor strony.</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div>
                                            <input type="checkbox" name="remember" id="remember" <?php if ($remember) {
                                                                                                        echo "checked";
                                                                                                    } ?>>
                                            <label for="remember">Zapamiętaj</label>
                                        </div>
                                    </td>
                                </tr>

                                <?php
                                if (
                                    !isset($_COOKIE["sended_bugs"])
                                    || $_COOKIE["sended_bugs"] % 10 == 0
                                ) {
                                ?>
                                    <tr>
                                        <td colspan=" 2">
                                            <div class="g-recaptcha" data-sitekey="<?php echo $GLOBALS["recaptcha"]["public"] ?>"></div>
                                            <small>wymagana jest weryfikacja co 10 zgłoszenia lub po 15 minutach (jeśli są włączone
                                                ciasteczka)
                                            </small>
                                        </td>
                                    </tr>

                                <?php
                                }
                                ?>
                                <tr>
                                    <td colspan="2">
                                        <input type="submit" value="Submit">
                                    </td>
                                </tr>
                            </table>

                            <input type="hidden" name="id" value="<?php echo  $_POST["id"]  ?>">
                            <input type="hidden" name="table" value="<?php echo  $_POST["table"]  ?>">
                            <input type="hidden" name="integrity" value="<?php echo md5($_POST["id"] . $_POST["table"] . $_POST["csrf_token"]) ?>">

                        </form>
        <?php
                    }
                }
            }
        }

        ?>
    </div>
    <?php
    create_footer();
    ?>
</body>

</html>