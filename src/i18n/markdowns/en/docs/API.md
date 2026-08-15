# API

The API is available at `api.bazaszachowa.smallhost.pl/(function)`.

`/(function)/:param1/:param2/:param3?` means that parameters 1 and 2 are required for the function, while parameter 3 is optional.

Functions with parameters can be called using GET or POST methods.
Functions without parameters, and functions requiring input data, must be called using POST.

- `/player/cr/:player`
  - input data:

    ```text
    {
      player - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    {
      id: CR-ID
      kat: category/title
      fide_id: FIDE-ID
      name: LASTNAME Firstname
    }
    ```

- `/player/fide/:player`
  - input data:

    ```text
    {
        name - lastname, firstname
    }
    ```

  - output data:

    ```text
    {
        fideid: fideid - FIDE ID,
        name: name - lastname, firstname,
        title: title - title,
        rating: rating - rating,
        rapid_rating: rating - rapid rating,
        blitz_rating: rating - blitz rating,
        birthday: year - year of birth
    }[]
    ```

- `/player/tournaments/poland/:player`
  - input data:

    ```text
    {
      player - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    {
      end: ISO date,
      id: CR ID,
      name: name,
      players: int[],
      start: ISO date,
      url: tournament service
    }
    ```

- `/player/tournaments/fide/:player`
  - input data:

    ```text
    {
      player - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    {
      country: country (char[3]),
      id: FIDE ID,
      name: name,
      players: int[],
      start: ISO date
    }
    ```

- `/player/plot/:format/:player`
  - input data:

    ```text
    {
      format - jpeg|svg
      player - Lastname, Firstname
    }
    ```

  - output data:

    a jpeg / svg file

- `/player/limit/:player`
  - input data:

    ```text
    {
      name - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    {
      maxElo: maximum rating in the database,
      minYear: year of the oldest game,
      maxYear: year of the newest game
    }
    ```

- `/player/openings/:player`
  - input data:

    ```text
    {
      player - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    {
      whites|blacks: {
        opening: opening,
        count: number,
        percent: average score in percent
      }
    }
    ```

- `/player/opening/:player/:color/:opening?`
  - input data:

    ```text
    {
      player - Lastname, Firstname,
      color - color (white/black)
      [, opening: opening]
    }
    ```

  - output data:

    ```text
    {
      id: id,
      moves: {
          from: square,
          to: square,
          promotion?: p/n/b/r/q/k
        }[],
      Event: tournament,
      Site: location,
      Year: year,
      Month: month,
      Day: day of the month,
      Round: round,
      White: white,
      Black: black,
      Result: result,
      WhiteElo: white's rating,
      BlackElo: black's rating
      [, ECO: ECO]
    }[]
    ```

- `/players/:player`
  - input data:

    ```text
    {
      player - Lastname, Firstname
    }
    ```

  - output data:

    ```text
    string[]
    Lastname, Firstname
    ```

- `/game/:base/:id`
  - input data:

    ```text
    {
      id: id,
      base - poland/all
    }
    ```

  - output data:

    ```text
    {
        id,
        moves: {
            from: square,
            to: square,
            promotion?: p/n/b/r/q/k
        }[],
        Event: tournament,
        Site: location,
        Year: year,
        Month: month,
        Day: day,
        Round: round,
        White: white,
        Black: black,
        Result: result,
        WhiteElo: white's rating,
        BlackElo: black's rating,
        ECO: ECO
    }[],
    ```

- `/games`
  - input data:

    ```text
    {
      white: white player (optional if black is set),
      black: black player (optional if white is set),
      [ignore: ignore colors (true/false, default false)],
      [minYear: minimum game year (inclusive)],
      [maxYear: maximum game year (inclusive)],
      [event: tournament (name beginning with tournament name)],
      [minEco: minimum ECO (inclusive, [A-E][0-9][0-9])],
      [maxEco: maximum ECO (inclusive, [A-E][0-9][0-9])],
      base: game database,
      searching: search method (classic - starts with ... / fulltext - exact match)
    }
    ```

  - output data:

    ```text
    {
      rows: {
        id,
        moves: {
            from: square,
            to: square,
            promotion?: p/n/b/r/q/k
        }[],
        Event: tournament,
        Site: location,
        Year: year,
        Month: month,
        Day: day,
        Round: round,
        White: white,
        Black: black,
        Result: result,
        WhiteElo: white's rating,
        BlackElo: black's rating
        [, ECO: ECO]
      }[],
      table: all|poland
    }
    ```

- `/mail/send`
  - input data:

    ```text
    {
      email - sender,
      subject - subject,
      content - content,
      file - attachment (as a file in req.file, not as a value in res.body)
    }
    ```
