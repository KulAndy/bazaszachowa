    <?php
    echo '<div id="pre"><div id="content" style="text-align: center;width: 90vw;">';
    require 'login_data.php';
    @$db = new mysqli($host, $user, $password, $base);

    if (mysqli_connect_errno()) {
        echo '<p>Błąd: Połączenie z bazą danych nie powiodło się.<br />
             Spróbuj jeszcze raz później.</p>';
        exit;
    }
    if (isset($_GET['fullname']) && !empty($_GET['fullname'])) {
        $basicName = htmlspecialchars($_GET['fullname']);
        if (substr($_GET['fullname'], 1, 1) == "'") {
            $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", substr($_GET['fullname'], 2)));
        } else {
            $fullname = preg_replace("/ +[a-z0-9\.]$/i", "", preg_replace("/ +[a-z0-9\.]\.* +/i", "", $_GET['fullname']));
        }
        $fullname =
            str_replace(".", "", $fullname);
        $fullname = preg_replace("/(^| |')\w{0,2}($| |')/", "", $fullname);
        $fullname = str_replace("-", " ", $fullname);
        $fullname = "+" . str_replace(" ", " +", $fullname);
    } else {
        die("Brak zawodnika do wyszukania");
    }
    echo "<h1 style='margin: 0;margin-bottom: 0.4em;'>$basicName</h1>";
    $basicName =
        str_replace(".", "", $basicName);
    $query = "SELECT max(WhiteElo) as maxElo 
    FROM $table 
    inner join $players_table as t1 on WhiteID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? 
    UNION 
    SELECT max(BlackElo) as maxElo 
    FROM $table 
    inner join $players_table as t1 on BlackID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? ";
    $searching = $db->prepare($query);

    $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
    $searching->execute();
    $searching->store_result();
    $elo = false;
    echo '<div id="info">';
    if ($searching->num_rows == 1) {
        $searching->bind_result($maxElo);
        while ($searching->fetch()) {
            if ($maxElo != null) {
                echo "<p id='maxElo'>najwyższy osiągnięty ranking: $maxElo</p>";
                $elo = true;
            }
        }
    } else if ($searching->num_rows == 2) {
        $searching->bind_result($maxElo);
        $max = 0;
        while ($searching->fetch()) {
            if ($maxElo > $max) {
                $max = $maxElo;
            }
        }
        if ($maxElo > 0) {
            echo "<p id='maxElo'>najwyższy osiągnięty ranking: $max</p>";
            $elo = true;
        }
    }
    $query = "SELECT min(Year) as minYear 
    FROM $table 
    inner join $players_table as t1 on WhiteID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? 
    UNION 
    SELECT min(Year) as minYear 
    FROM $table 
    inner join $players_table as t1 on BlackID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? ";
    $searching = $db->prepare($query);
    $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
    $searching->execute();
    $searching->store_result();
    $minY = null;
    if ($searching->num_rows == 1) {
        $searching->bind_result($minYear);
        while ($searching->fetch()) {
            $minY = $minYear;
        }
    } else if ($searching->num_rows == 2) {
        $searching->bind_result($minYear);
        $min = 0;
        while ($searching->fetch()) {
            if ($minYear < $min) {
                $min = $minYear;
            }
        }
        if ($minYear > 0) {
            $minY = $min;
        }
    }

    $query = "SELECT max(Year) as maxYear 
    FROM $table 
    inner join $players_table as t1 on WhiteID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? 
    UNION 
    SELECT min(Year) as minYear 
    FROM $table 
    inner join $players_table as t1 on BlackID = t1.id 
    WHERE MATCH(t1.fullname) against(? in boolean mode) 
    AND t1.fullname like ? ";
    $searching = $db->prepare($query);
    $searching->bind_param('ssss', $fullname, $_GET['fullname'], $fullname, $_GET['fullname']);
    $searching->execute();
    $searching->store_result();
    $maxY = null;
    if ($searching->num_rows == 1) {
        $searching->bind_result($maxYear);
        while ($searching->fetch()) {
            $maxY = $maxYear;
        }
    } else if ($searching->num_rows == 2) {
        $searching->bind_result($maxYear);
        $max = 0;
        while ($searching->fetch()) {
            if ($maxYear > $max) {
                $max = $maxYear;
            }
        }
        if ($maxYear > 0) {
            $maxY = $max;
        }
    }
    if ($minY != null && $maxY != null) {
        echo "<p>gry z lat: $minY - $maxY</p>";
    }
    ?>
    </div>
    <table style='border: 0;'>
        <tr id="container" style='display:flex;'>
            <td id="stats" style='border: 0;'></td>
            <td style='border: 0;'>
                <?php echo "<img id='graph' onerror='this.remove()' src='/player_data/graph.php?name=" . urlencode($basicName) . "'>"; ?>
        </tr>
    </table>
    <table id='table'>
    </table>
    </div>
    </div>