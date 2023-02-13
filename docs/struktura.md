# Struktura

## baza danych

### Tabele:

* **players** - wszyscy zawodnicy
* **poland_players** i **all_players** - nazwiska tych zawodników, którzy występują w tabelach poland_games i all_games
  relacja do
  * players
* **chess_events** - nazwy i daty turniejów
* **sites** - miejsca
* **eco** - kody eco, nazwy systematyczne debiutów i wariantów
* **all_games** i **poland_games** - tabele zawierające wszystkie gry i tylko te z Polski
  relacje do
  * chess_events
  * sites
  * eco
  * all_playesrs/poland_players

## strona

/

* content.php - kontener z zawartością strony, wymaga left_content i manifest
* footer.php - stopka
* header.php - nagłówek `<head>`
* index.php - plik domyślny, wymaga header, menu, content, footer
* left_content.php - zawiera przydatne linki
* LICENSE - licencja
* manifest.php - manifett
* menu.php - linki do poruszania się po stronie
* API/ - API, patrz docs/API.md
* contact/ - formularz kontaktowy
  * content.php - formularz, przekierowuje do send
  * index.php - strona domyślna, wymaga content
  * send - wysyła wiadomość na maila
* css/ - arkusze stylów
  * chessicons.css - arkusz do wyświetlania partii (dla game/)
  * player_data.css - arkusz dla player_data/
  * style.css - domyślny arkusz stylów
* docs/ - dokumentacja
  * API.md - opis API
  * struktura.md ten plik
* game/ - przeglądarka gier
  * chessicons/
    * \[bw\]\[bknpqr\].svg - grafiki bierek
    * license.txt - plik z linkiem do strony autora grafik
  * board.html - plik z [zewnętrznej bibliteki](https://github.com/mliebelt/PgnViewerJS/)
  * content.php - kontener na zawartość
  * index.php - plik domyślny, ustawia osobny nagłówek, wymaga menu,content,footer
  * pgnv.js - [zewnętrzna bibliteka](https://github.com/mliebelt/PgnViewerJS/) 
* game_raw/ - partia w formacie [PGN](http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm)
  * content.php - zawartość strony, wymaga login_data
  * index.php - plik domyślny, wymaga content
  * login_data.php - plik z danymi do łączenia z bazą
  trzeba ustawić zmienne:
  *  $host = "localhost" - host;
  *  $user = "user" - użytkownik;
  *  $password = "password" - hasło;
  *  $base = "base" - baza;
  *  $table = "games" - tabela z grami;
  *  $players_table = "players" - tamela z zawodnikami;
  *  $events_table = "events" - tabela z turniejami;
  *  $sites_table = "sites" - tabela z miejscami;
  *  $rounds_table = "rounds" - tabela z rundami;
  *  $results_table = "results" - tabela z rezultatami;
* license/ - licencja
  * index.php - plik domyślny, wymaga header, menu, content, footer
  * content.php - faktyczna licencja
* player_data/ - dane o zawodniku
  * content - kontener na dane
  * index.php - plik domyślny
* players/ - wyszukiwarka graczy
  * content.php - formularz do wyszukiwania i skrypt do wyszukiwania w bazie
  * index.php - plik domyślny
  * login_data.php - plik z danymi do łączenia z bazą danych
  trzeba ustawić zmienne:
*  $host = "localhost" - host;
  *  $user = "user" - użytkownik;
  *  $password = "password" - hasło;
  *  $base = "base" - baza;
  *  $table1 = "used_players" - tabela z użytymi graczami;
  *  $table2 = "players" - tabela ze wszystkimi graczami;
* rodo/ - informacja dla fanów RODO
  * content.php -informacja
  * index.php - plik domyślny
* script/ - katalog ze skryptami javascripta 
  * game_display_functions.js - funkcje do wyświetlania gier
  * game.js - główna skrypt game/
  * player_data_functions.js - funkcje do danych zawodnika
  * player_data.js - główny skrypt player_data/
  * search_functions.js - funckje do wyszukiwania gier 
  * search.js - główny skrypt search/
* search/ - wyszukiwarka partii
  * content.php - kontener na zawartość
  * index.php - plik domyślny
