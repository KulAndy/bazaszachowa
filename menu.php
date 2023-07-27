<nav>
    <ul class="desktop">
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/") echo 'class="active"' ?>>
            <a target="_self" href="/">strona
                główna</a>
        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/players/") echo 'class="active"' ?>>
            <a target="_self" href="/players/">wyszukiwarka graczy</a>

        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/search/") echo 'class="active"' ?>> <a target="_self"
                href="/search/">
                wyszukiwarka partii</a>

        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/preparation/") echo 'class="active"' ?>>
            <a target="_self" href="/preparation">przygotowanie (eksperymentalne)</a>
        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/license/") echo 'class="active"' ?>> <a target="_self"
                href="/license/">
                licencja</a>

        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/rodo/") echo 'class="active"' ?>> <a target="_self" href="/rodo/"
                style=" white-space: nowrap;">dla
                fanów rodo</a>

        </li>
        <li <?php if ($_SERVER["DOCUMENT_URI"] == "/contact/") echo 'class="active"' ?>> <a target="_sel"
                href="/contact/">
                kontakt</a>
        </li>
    </ul>
    <details class="mobile">
        <summary>
            menu
        </summary>
        <ul>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/") echo 'class="active"' ?>>
                <a target="_self" href="/">strona
                    główna</a>
            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/players/") echo 'class="active"' ?>>
                <a target="_self" href="/players/">wyszukiwarka graczy</a>

            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/search/") echo 'class="active"' ?>> <a target="_self"
                    href="/search/">
                    wyszukiwarka partii</a>

            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/preparation/") echo 'class="active"' ?>>
                <a target="_self" href="/preparation">przygotowanie (eksperymentalne)</a>
            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/license/") echo 'class="active"' ?>> <a target="_self"
                    href="/license/">
                    licencja</a>

            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/rodo/") echo 'class="active"' ?>> <a target="_self"
                    href="/rodo/">dla
                    fanów rodo</a>

            </li>
            <li <?php if ($_SERVER["DOCUMENT_URI"] == "/contact/") echo 'class="active"' ?>> <a target="_sel"
                    href="/contact/">
                    kontakt</a>
            </li>
        </ul>
    </details>

</nav>