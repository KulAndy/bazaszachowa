<div id="searchContainer">
    <div class="not_mobile"></div>
    <div id="content" style="width: fit-content;">
        <form id="form">
            <table class=" no_border">
                <tr>
                    <td>Białe:</td>
                    <td colspan="3"><input list="whitelist" type="text" id="white" placeholder="Nowak, Jan"></td>
                </tr>
                <tr>
                    <td>Czarne: </td>
                    <td colspan="3"><input list="blacklist" type="text" id="black" placeholder="Nowak, Jan"></td>
                </tr>
                <tr>
                    <td style="width: 21ch;">ignoruj kolory</td>
                    <td colspan="3"><input id="ignoreColor" type="checkbox"></td>
                </tr>
                <tr>
                    <td>lata:</td>
                    <td style="display: flex; justify-content: flex-end;"><input type="number" id="minYear" step="1" min="1475" max="<?php echo date('Y') ?>" style="width: 4em;"></td>
                    <td> - </td>
                    <td style="display: flex; justify-content: flex-start;"><input type="number" id="maxYear" step="1" min="1475" max="2023" style="width: 4em;"></td>
                </tr>
                <tr>
                    <td>turniej:</td>
                    <td colspan="3"><input id="event" type="text"></td>
                </tr>
                <tr>
                    <td>ECO:</td>
                    <td style="display: flex; justify-content: flex-end;"><select id="select1">
                            <?php
                            $id = 1;
                            foreach (["A", "B", "C", "D", "E"] as $letter) {
                                for ($i = 0; $i < 100; $i++) {
                                    echo "<option value='" . $id++ . "'";
                                    if ($id == 1) {
                                        echo " selected ";
                                    }
                                    echo ">$letter";
                                    if ($i < 10) {
                                        echo "0";
                                    }
                                    echo "$i</option>";
                                }
                            }

                            ?>

                        </select></td>
                    <td> - </td>
                    <td style="display: flex; justify-content: flex-start;"><select id="select2">
                            <?php
                            $id = 1;
                            foreach (["A", "B", "C", "D", "E"] as $letter) {
                                for ($i = 0; $i < 100; $i++) {
                                    echo "<option value='" . $id++ . "'";
                                    if ($id == 501) {
                                        echo " selected ";
                                    }
                                    echo ">$letter";
                                    if ($i < 10) {
                                        echo "0";
                                    }
                                    echo "$i</option>";
                                }
                            }

                            ?>

                        </select></td>
                </tr>
                <tr>
                    <td>baza:</td>
                    <td>Polska <input type="radio" id="radioB1" name="base" checked></td>
                    <td colspan="2"> całość <input type="radio" id="radioB2" name="base"></td>
                </tr>
                <tr>
                    <td style="width: 18ch;">wyszukiwanie</td>
                    <td>zwykłe<input type="radio" id="radioS1" name="searching" checked></td>
                    <td colspan="2">dokładne<input type="radio" name="searching" id="radioS2"></td>
                </tr>
                <tr style="height: 4em;">
                    <th colspan="4"><button id="search">szukaj</button></th>
                </tr>
            </table>
            <datalist id="whitelist"></datalist>
            <datalist id="blacklist"></datalist>
        </form>
    </div>
    <div id="right_content">
        <details id="help" open>
            <summary>Pomoc</summary>
            <ul>
                Możliwe parametry wyszukiwania:
                <li>Trzeba podać nazwisko przynajmniej jednego gracza</li>
                <li>
                    kody
                    <a href="https://pl.wikipedia.org/wiki/Encyklopedia_otwar%C4%87_szachowych">ECO</a>
                    na wikipedii
                </li>
                <li>
                    <ul>
                        baza
                        <li>
                            Polska - turnieje głównie z Polski, ok 700 tys. , szybsza baza
                        </li>
                        <li>Całość - wszystkie partie, ok 11 mln, wolniejsza baza</li>
                    </ul>
                </li>
                <li>
                    <ul>
                        Wyszukiwanie (wielkość liter nie ma znaczenia)
                        <li>
                            Zwykłe - zadziała zarówno wpisanie "Nowak, Jan" jak i "Nowak, J" ,
                            można stować jokery ( "_" - jeden dowolny znak, "%" - dowolny ciąg
                            znaków )
                        </li>
                        <li>
                            Dokładne - wyszuka tylko po wpisaniu "Nowak, Jan", szybsze,
                            zalecane jeśli zna się pełne imię i nazwisko gracza/y
                        </li>
                    </ul>
                </li>
            </ul>
        </details>
    </div>
</div>
<div id="games"></div>