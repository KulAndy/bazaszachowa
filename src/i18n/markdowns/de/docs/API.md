# API

Die API ist unter `api.bazaszachowa.smallhost.pl/(funktion)` verfügbar.

`/(funktion)/:param1/:param2/:param3?` bedeutet, dass die Parameter 1 und 2 für die Funktion erforderlich sind, während Parameter 3 optional ist.

Funktionen mit Parametern können mit GET oder POST aufgerufen werden.
Funktionen ohne Parameter sowie Funktionen, die Eingabedaten benötigen, müssen mit POST aufgerufen werden.

- `/player/cr/:player`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
      id: CR-ID
      kat: Kategorie/Titel
      fide_id: FIDE-ID
      name: NACHNAME Vorname
    }
    ```

- `/player/fide/:player`
  - Eingabedaten:

    ```text
    {
        name - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
        fideid: fideid - FIDE-ID,
        name: name - Nachname, Vorname,
        title: title - Titel,
        rating: rating - Wertungszahl,
        rapid_rating: rating - Schnellschach-Wertungszahl,
        blitz_rating: rating - Blitz-Wertungszahl,
        birthday: Jahr - Geburtsjahr
    }[]
    ```

- `/player/tournaments/poland/:player`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
      end: ISO-Datum,
      id: CR-ID,
      name: Name,
      players: int[],
      start: ISO-Datum,
      url: Turnierservice
    }
    ```

- `/player/tournaments/fide/:player`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
      country: Land (char[3]),
      id: FIDE-ID,
      name: Name,
      players: int[],
      start: ISO-Datum
    }
    ```

- `/player/plot/:format/:player`
  - Eingabedaten:

    ```text
    {
      format - jpeg|svg
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    eine jpeg-/svg-Datei

- `/player/limit/:player`
  - Eingabedaten:

    ```text
    {
      name - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
      maxElo: höchste Wertungszahl in der Datenbank,
      minYear: Jahr der ältesten Partie,
      maxYear: Jahr der neuesten Partie
    }
    ```

- `/player/openings/:player`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    {
      whites|blacks: {
        opening: Eröffnung,
        count: Anzahl,
        percent: durchschnittliches Ergebnis in Prozent
      }
    }
    ```

- `/player/opening/:player/:color/:opening?`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname,
      color - Farbe (white/black)
      [, opening: Eröffnung]
    }
    ```

  - Ausgabedaten:

    ```text
    {
      id: id,
      moves: {
          from: Feld,
          to: Feld,
          promotion?: p/n/b/r/q/k
        }[],
      Event: Turnier,
      Site: Ort,
      Year: Jahr,
      Month: Monat,
      Day: Tag des Monats,
      Round: Runde,
      White: Weiß,
      Black: Schwarz,
      Result: Ergebnis,
      WhiteElo: Wertungszahl von Weiß,
      BlackElo: Wertungszahl von Schwarz
      [, ECO: ECO]
    }[]
    ```

- `/players/:player`
  - Eingabedaten:

    ```text
    {
      player - Nachname, Vorname
    }
    ```

  - Ausgabedaten:

    ```text
    string[]
    Nachname, Vorname
    ```

- `/game/:base/:id`
  - Eingabedaten:

    ```text
    {
      id: id,
      base - poland/all
    }
    ```

  - Ausgabedaten:

    ```text
    {
        id,
        moves: {
            from: Feld,
            to: Feld,
            promotion?: p/n/b/r/q/k
        }[],
        Event: Turnier,
        Site: Ort,
        Year: Jahr,
        Month: Monat,
        Day: Tag,
        Round: Runde,
        White: Weiß,
        Black: Schwarz,
        Result: Ergebnis,
        WhiteElo: Wertungszahl von Weiß,
        BlackElo: Wertungszahl von Schwarz,
        ECO: ECO
    }[],
    ```

- `/games`
  - Eingabedaten:

    ```text
    {
      white: weißer Spieler (optional, wenn black gesetzt ist),
      black: schwarzer Spieler (optional, wenn white gesetzt ist),
      [ignore: Farben ignorieren (true/false, standardmäßig false)],
      [minYear: minimales Jahr der Partie (einschließlich)],
      [maxYear: maximales Jahr der Partie (einschließlich)],
      [event: Turnier (Name beginnt mit dem Turniernamen)],
      [minEco: minimale ECO (einschließlich, [A-E][0-9][0-9])],
      [maxEco: maximale ECO (einschließlich, [A-E][0-9][0-9])],
      base: Partiedatenbank,
      searching: Suchmethode (classic - beginnt mit ... / fulltext - genaue Übereinstimmung)
    }
    ```

  - Ausgabedaten:

    ```text
    {
      rows: {
        id,
        moves: {
            from: Feld,
            to: Feld,
            promotion?: p/n/b/r/q/k
        }[],
        Event: Turnier,
        Site: Ort,
        Year: Jahr,
        Month: Monat,
        Day: Tag,
        Round: Runde,
        White: Weiß,
        Black: Schwarz,
        Result: Ergebnis,
        WhiteElo: Wertungszahl von Weiß,
        BlackElo: Wertungszahl von Schwarz
        [, ECO: ECO]
      }[],
      table: all|poland
    }
    ```

- `/mail/send`
  - Eingabedaten:

    ```text
    {
      email - Absender,
      subject - Betreff,
      content - Inhalt,
      file - Anhang (als Datei in req.file, nicht als Wert in res.body)
    }
    ```
