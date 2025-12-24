# API

pod adresem api.bazaszachowa.smallhost.pl/(funkcja) jest następujące API

`/(funkcja)/:param1/:param2/:param3?`
oznacza, że dla funkcji parametry 1 i 2 są obwiązkowe, 3 opcjonalny

funkcje z parametrami można wywoływać metodą GETi POST
bez parametrów, a wymagające dane wejściowe metodą POST

- `/player/cr/:player`
  - dane wejściowe:

  ```
  {
    player - Nazwisko, Imię
  }
  ```

  - dane wyjściowe:

  ```
  {
    id: CR-ID
    kat: kategoria/tytuł
    fide_id: FIDE-ID
    name: NAZWISKO Imię
  }
  ```

- `/player/fide/:player`
  - dane wejściowe

  ```
  {
      name - nazwisko, imię
  }
  ```

  - dane wyjściowe

  ```
  {
      fideid: fideid - id FIDE,
      name: name - nazwisko, imię,
      title: title - tytuł,
      rating: rating - ranking,
      rapid_rating: rating - ranking w rapidzie,
      blitz_rating: rating - rankingu w blitzu,
      birthday: rok - rocznik
  }[]
  ```

- `/player/tournaments/poland/:player`
  - dane wejściowe:

  ```
  {
    player - Nazwisko, Imię
  }
  ```

  - dane wyjściowe:

  ```
  {
    end: data ISO,
    id: ID CR,
    name: nazwa,
    players: int[],
    start: data ISO,
    url: serwis turniejowy
  }
  ```

- `/player/tournaments/fide/:player`
  - dane wejściowe:

  ```
  {
    player - Nazwisko, Imię
  }
  ```

  - dane wyjściowe:

  ```
  {
    country: kraj (char[3])
    id: ID FIDE,
    name: nazwa,
    players: int[],
    start: data ISO
  }
  ```

- `/player/plot/:format/:player`
  - dane wejściowe:

  ```
  {
    format - jpeg|svg
    player - Nazwisko, Imię
    }
  ```

  - dane wyjściowe:
    plik jpeg / svg

- `/player/limit/:player`
  - dane wejściowe

  ```
  {
    name - Nazwisko, Imię
    }
  ```

  - dane wyjściowe:

  ```
  {
    maxElo: maksymalny ranking w bazie
    minYear: rok najstarszej partii
    maxYear: rok najnowszej partii
    }
  ```

- `/player/openings/:player`
  - dane wejściowe:

  ```
  {
    player - Nazwisko, Imię
  }
  ```

  - dane wyjściowe:

  ```
  {
    whites|blacks:  {
      opening: debiut,
      count: ilość,
      percent: średni wynik w procentach,
      }
  }
  ```

- `/player/opening/:player/:color/:opening?`
  - dane wejściowe:

  ```
  {
    player - Nazwisko, Imię,
    color - kolor (white/black)
    [, opening: debiut]
    }
  ```

  - dane wyjściowe:

```

    {
      id: id,
      moves: {
          from:pole,
          to:pole,
          promotion?:p/n/b/r/q/k
        }[],
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
      }[]
```

- `/players/:player`
  - dane wejściowe:

  ```
  {
  player - Nazwisko, Imię
  }
  ```

  - dane wyjściowe:

  ```
  string[]
  Nazwisko, Imię
  ```

- `/game/:base/:id`
  - dane wejściowe:

  ```
  {
    id: id,
    base - poland/all
  }
  ```

  - dane wyjściowe:

  ```
      {
          id,
          moves: {
              from:pole,
              to:pole,
              promotion?:p|n|b|r|q|k
          }[],
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
      }[],
  ```

- `/games`
  - dane wejściowe:

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

  - dane wyjściowe:

  ```
  {
    id,
    moves: {
        from:pole,
        to:pole,
        promotion?:p/n/b/r/q/k
    }[],
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
    }[]
  ```

- `/mail/send`
  - dane wejściowe

  ```
  {
  email - nadawca
  subject - temat
  content - zawartość
  file - załącznik (jako plik, w req.file, a nie wartość w res.body)
  }

  ```
