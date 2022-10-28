<div id="pre">
    <form id="form" action="/game" method="get" style="display: none;">
        <input id="idInput" name="id">
        <input id="tableInput" name="table">
        <input id="whiteInput" name="white">
        <input id="blackInput" name="black">
        <input id="ignoreInput" name="ignore">
        <input id="minYearInput" name="minYear">
        <input id="maxYearInput" name="maxYear">
        <input id="eventsInput" name="events">
        <input id="minEcoInput" name="minEco">
        <input id="maxEcoInput" name="maxEco">
        <input id="baseInput" name="base">
        <input id="searchingInput" name="searching">
    </form>
    <div id="searchContainer">
        <div class="not_mobile" style="width: 30vw;background-color:#c3df5d;">
        </div>
        <div id="content" style="width: fit-content;float: inline-start;"></div>
        <div id="right_content" style="margin-top: 0">
            <details open>
                <summary>Pomoc</summary>
                <ul>Możliwe parametry wyszukiwania:
                    <li>Trzeba podać nazwisko przynajmniej jednego gracza</li>
                    <li>kody <a href="https://pl.wikipedia.org/wiki/Encyklopedia_otwar%C4%87_szachowych">ECO</a>
                        na
                        wikipedii</li>
                    <li>
                        <ul>baza
                            <li>Polska - turnieje głównie z Polski, ok 550 tys. , szybsza baza </li>
                            <li>Całość - wszystkie partie, ok 9 mln, wolniejsza baza</li>
                        </ul>
                    </li>
                    <li>
                        <ul>Wyszukiwanie (wielkość liter nie ma znaczenia)
                            <li>Zwykłe - zadziała zarówno wpisanie "Nowak, Jan" jak i "Nowak, J" , można
                                stować
                                jokery ( "_"
                                - jeden dowolny znak, "%" - dowolny ciąg znaków )</li>
                            <li>Dokładne - wyszuka tylko po wpisaniu "Nowak, Jan", szybsze, zalecane jeśli
                                zna
                                się pełne
                                imię i nazwisko gracza/y
                        </ul>
                    </li>
                </ul>
            </details>

        </div>
    </div>



</div>