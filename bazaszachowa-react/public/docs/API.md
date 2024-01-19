# API

pod adresem api.bazaszachowa.smallhost.pl/(funkcja) jest następujące API

/(funkcja)/:param1/:param2/:param3?
oznacza, że dla funkcji parametry 1 i 2 są obwiązkowe, 3 opcjonalny

funkcje z parametrami można wywoływać metodą GEt i POST
bez parametrów, a wymagające dane wejściowe metodą POST

* cr_data/:player
  * dane wejściowe:
  ```
  {
    player - Nazwisko, Imię
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
*   fide_data/:player
    * dane wejściowe
    ```
    {
        name - nazwisko, imię
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

* game/:base/:id
  * dane wejściowe:
  ```
  {
    id: id,
    base - poland/all
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
* graph/:format/:player
  * dane wejściowe:
  ```
  {
    format - jpeg
    player - Nazwisko, Imię
    }
    ```

  * dane wyjściowe:
    plik jpeg / svg

* min_max_year_eco/:player
  * dane wejściowe
  ```
  {
    name - Nazwisko, Imię
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
* player_opening_stats/:player
  * dane wejściowe:
  ```
  {
    player - Nazwisko, Imię
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

* search_game
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
* search_player_opening_game/:player/:color/:opening?
  * dane wejściowe:
 ```
  {
    player - Nazwisko, Imię,
    color - kolor (white/black)
    [, opening: debiut]
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

   
* search_player/:player
    * dane wejściowe
    ```    
    {
        player - Nazwisko, Imię
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
* send-email
    * dane wejściowe
    ```    
    {
        email - nadawca 
        subject - temat
        content - zawartość
        file - załącznik (jako plik, a nie w res.file, a nie wartość w res.body)    
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
