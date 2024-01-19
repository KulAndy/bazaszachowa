import Content from "../components/Content";
import { NOMENU_URLS } from "../settings";

const License = () => {
    return (
        <Content>
            <article>
                Całość strony jest udostępniona na następujących zasadach:
                <ul>
                    użytkownik
                    <li> ma prawo używać strony w dowolnym celu</li>
                    <li> ma prawo do analizowania strony*</li>
                    <li> ma prawo do kopiowania strony*</li>
                    <li>
                        ma prawo do udoskonalania i publicznego rozpowszechniania ulepszeń
                        strony*
                    </li>
                    <li> nie może zmienić licencji</li>
                    <li>
                        nie może pobierać opłat za projekt, w którym został wykorzystany
                        jakikolwiek element z tej strony*
                    </li>
                    <li>
                        jeśli skorzysta z wyszukiwarki, to ma obowiązek sprawdzenia swoich
                        gier na dany moment z minimum ostatnich 3 lat przynajmniej z bazy z
                        której korzystał i zgłoszenia ewentualnych błędów{" "}
                    </li>
                    <li> zobowiązuje się postawić piwo autorowi strony</li>
                    <li>
                        zgłaszać błędy w partiach mogą tylko osoby, których dane są
                        publicznie dostępne (np. zarejestrowani w FIDE, PZSzach lub ich
                        partie znajdują się w bazie)
                    </li>
                </ul>
                <sub>
                    * kod źródłowy dostępny na{" "}
                    <a href="https://github.com/KulAndy/bazaszachowa">githubie</a>
                </sub>
                <hr />
                we wszystkich innych przypadkach obowiązuje licencja{" "}
                <a href="https://www.gnu.org/licenses/agpl-3.0.html">GNU AGPLv3</a>
                <hr />
                <a href={NOMENU_URLS.docs}>dokumentacja</a>
            </article>
        </Content>
    );
};

export default License;
