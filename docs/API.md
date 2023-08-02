# API

pod adresem bazaszachowa.smallhost.pl/API/(plik) jest następujące API

zawsze metodą POST lub GET trzeba podać bazę partii

* cr_data.php
  * dane wejściowe:
  ```
  {
    name: Nazwisko, Imię
  }
    ```

  * dane wyjściowe:
  ```
  {
    id: CR-ID
    kat: kategoria/tytuł
    fide_id: FIDE-ID
    name: NAZWISKO Imię
  }
    ```
*   fide_data.php
    * dane wejściowe
    ```
    {
        name: name - nazwisko, imię
    }
    ```

    * dane wyjściowe
    ```
    {
        fideid: fideid - id FIDE,
        name: name - nazwisko, imię,
        title: title - tytuł,
        rating: rating - ranking,
        rapid_rating: rating - ranking w rapidzie,
        blitz_rating: rating - rankingu w blitzu,
        birthday: rok - rocznik
    }
    ```

* get_game.php
  * dane wejściowe:
  ```
  {
    id: id,
    table: tabela
  }
    ```

  * dane wyjściowe:
  ```
    [
        {
            id: id1,
            moves: ruchy,
            Event: turniej,
            Site: miejsce,
            Year: rok,
            Month: miesiąc,
            Day: dzień miesiąca,
            Round: runda,
            White: biały,
            Black: czarny,
            Result: wynik,
            WhiteElo: elo białego,
            BlackElo: elo czarnego,
            ECO: eco
        },
        {
            id: id2,
            moves: ruchy,
            Event: turniej,
            Site: miejsce,
            Year: rok,
            Month: miesiąc,
            Day: dzień miesiąca,
            Round: runda,
            White: biały,
            Black: czarny,
            Result: wynik,
            WhiteElo: elo białego,
            BlackElo: elo czarnego,
            ECO: eco
        }
    ]
    ```
* graph_jpeg.php / graph_svg.php
  * dane wejściowe:
  ```
  {
    name: "Nazisko, Imię"
    }
    ```

  * dane wyjściowe:
    plik jpeg / svg

* min_max_year_eco.php
  * dane wejściowe
  ```
  {
    name: Nazwisko, Imię
    }
    ```

  * dane wyjściowe:
  ```
  {
    maxElo: maksymalny ranking w bazie
    minYear: rok najstarszej partii
    maxYear: rok najnowszej partii
    }
    ```
* player_opening_stats.php
  * dane wejściowe:
  ```
  {
    name: "Nazwisko, Imię"
    }
    ```

  * dane wyjściowe:
  ```
  {
    whites: białe
    {
      opening: debiut,
      count: ilość,
      percent: średni wynik w procentach,
      },
    blacks: czarne
    {
      opening: debiut,
      count: ilość,
      percent: średni wynik w procentach,
      }
    }
    ```

* search_game.php
  * dane wejściowe:
    ```
  {
    white: biały (opcjonalne, jeśli ustawiono black),
    black: czarny (opcjonalne, jeśli ustawiono white),
    [ignore: ignorowanie kolorów (true/false, domyślnie false)],
    [minYear: minimalny rok gry (włącznie)],
    [maxYear: maksymalny rok gry (włącznie)],
    [event: turniej (nazwa zaczynająca się od turniej)],
    [minEco: minimalne eco (włącznie, [A-E][0-9][0-9])]
    [maxEco: maksymalne eco (włącznie, [A-E][0-9][0-9])]
    base: baza partii
    searching: metoda wyszukiwania (classic - zaczynające się od ... / fulltext - dokładne dopasowanie)
    }
    ```

   * dane wyjściowe:
    ```
    {
      id: id,
      moves: ruchy,
      Event: turniej,
      Site: miejsce,
      Year: rok,
      Month: miesiąc,
      Day: dzień miesiąca,
      Round: runda,
      White: biały,
      Black: czarny,
      Result: wynik,
      WhiteElo: elo białego,
      BlackElo: elo czarnego
      [, ECO: eco]
      }
      ```
* search_player_opening_game.php
  * dane wejściowe:
  ```
  {
    name: "Nazwisko, Imię"
  }
  ```
  * dane wyjściowe
    ```
  {
    player: Nazwisko, Imię,
    color: kolor (white/black)
    [, opening: debiut]
    }
    ```
* search_player.php
    * dane wejściowe
    ```    
    {
        name: "Nazwisko, Imię
    }

    ```
    * dane wyjściowe
    ```    
    [
            {
                fullname: player1
            },
            {
                fullname: player2
            },
            .
            .
            .
    ]
    ```