# API

pod adresem bazaszachowa.smallhost.pl/API/(plik) jest następujące API

zawsze metodą POST lub GET trzeba podać bazę partii

* login_data.php - dane logowania
  
  koniecznie w php-ie trzeba ustawić zmienne
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
  
* cr_data.php
  dane wejściowe:
  * meoda POST
  * {
    * name: Nazwisko, Imię
    }

  dane wyjściowe:
  * json
  * {
    * id: CR-ID
    * kat: kategoria/tytuł
    * fide_id: FIDE-ID
    * name: NAZWISKO Imię
    }

* get_game.php
  dane wejściowe:

  * metoda POST
  * {
    * "id": id
      }

  dane wyjściowe:

  * json z grami o danym id
  * {
    * id: id,
    * moves: ruchy,
    * Event: turniej,
    * Site: miejsce,
    * Year: rok,
    * Month: miesiąc,
    * Day: dzień miesiąca,
    * Round: runda,
    * White: biały,
    * Black: czarny,
    * Result: wynik,
    * WhiteElo: elo białego,
    * BlackElo: elo czarnego,
    * ECO: eco
      }
* graph.php
  dane wejściowe:

  * metoda GET
  * {
    * name: "Nazisko, Imię"
      }

  dane wyjściowe:

  * plik jpeg

* min_max_year_eco
  * dane wejściowe metoda GET/POST
  * {
    * name: Nazwisko, Imię
    }

  dane wyjściowe:
  * json
  * {
    * maxElo: maksymalny ranking w bazie
    * minYear: rok najstarszej partii
    * maxYear: rok najnowszej partii
    }
* player_opening_stats.php
  dane wejściowe:

  * metoda POST lub GET
  * {
    * name: "Nazwisko, Imię"
      }

  dane wyjściowe:

  * json:
  * {
    * whites: białe
    * {
      * opening: debiut,
      * count: ilość,
      * percent: średni wynik w procentach,
        },
    * blacks: czarne
    * {
      * opening: debiut,
      * count: ilość,
      * percent: średni wynik w procentach,
        }
        }
* search_game.php
  dane wejściowe:

  * metoda POST
  * {

    * white: biały (opcjonalne, jeśli ustawiono black),
    * black: czarny (opcjonalne, jęsli ustawiono white),
    * \[ignore: ignorowanie kolorów (true/false, domyślnie false)\],
    * \[minYear: minimalny rok gry (włącznie)\],
    * \[maxYear: maksymalny rok gry (włącznie)\],
    * \[event: turniej (nazwa zaczynająca się od turniej)\],
    * \[minEco: minimalne eco (włącznie, [A-E][0-9][0-9])\]
    * \[maxEco: maksymalne eco (włącznie, [A-E][0-9][0-9])\]
    * base: baza partii
    * searching: metoda wyszukiwania (classic - zaczynające się od ... / fulltext - dokładne dopasowanie)
      }

    dane wyjściowe:

    * json
    * {
      * id: id,
      * moves: ruchy,
      * Event: turniej,
      * Site: miejsce,
      * Year: rok,
      * Month: miesiąc,
      * Day: dzień miesiąca,
      * Round: runda,
      * White: biały,
      * Black: czarny,
      * Result: wynik,
      * WhiteElo: elo białego,
      * BlackElo: elo czarnego,
      * [ECO: eco]
        }
* search_player_opening_game.php
  dane wejściowe:

  * metoda POST
  * {
    * player: Nazwisko, Imię,
    * color: kolor (white/black)
    * \[opening: debiut\]
      }
