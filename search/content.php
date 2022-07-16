<?php
    echo '<div id="pre">
        <div id="left_content2" class="float_left">
            <details open>
                <summary>Pomoc</summary>
                <ul>Możliwe parametry wyszukiwania:
                    <li>Imiona i nazwiska obu zawodników - trzeba podać imię lub nazwisko przynajmniej dla jednego gracza</li>
                    <li>ignorowanie kolorów</li>
                    <li>zakres lat (przed wyszukaniem zostanie sprawdzona poprawność)</li>
                    <li>turniej</li>
                    <li>zakres kodów <a href="https://pl.wikipedia.org/wiki/Encyklopedia_otwar%C4%87_szachowych">ECO</a> (przed wyszukaniem zostanie sprawdzona poprawność)</li>
                    <li>
                        <ul>baza
                            <li>Polska - turnieje głównie z Polski ( głównie pobrane z ChessArbitra), ok 550 tys. , szybsza baza </li>
                            <li>Całość - wszystkie partie, ok 9 mln, wolniejsza baza</li>
                        </ul>
                    </li>
                    <li>
                        <ul>Wyszukiwanie (wielkość liter nie ma znaczenia)
                            <li>Zwykłe - zadziała zarówno wpisanie "Nowak, Jan" jak i "Nowak, J" , można stować jokery ( "_" - jeden dowolny znak, "%" - dowolny ciąg znaków )</li>
                            <li>Dokładne - wyszuka tylko po wpisaniu "Nowak, Jan", znacznie szybsze, zalecane jeśli zna się pełne imię lub nazwisko gracza/y
                        </ul>
                    </li>
                </ul>
            </details>
        </div>
        <div id="content" style="width: fit-content"></div>
    </div>';
?>