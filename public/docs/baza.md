# baza danych

![struktura](/docs/struktura.png "Struktura")

## Tabele:

### all_games

| Kolumna         | Typ        | Null | Ustawienia domyślne | Odsyłacze do       |
| --------------- | ---------- | ---- | ------------------- | ------------------ |
| id (Podstawowy) | int        | Nie  |                     |                    |
| moves_blob      | blob       | Tak  | NULL                |                    |
| eventID         | mediumint  | Nie  |                     | chess_events -> id |
| siteID          | mediumint  | Nie  |                     | sites -> id        |
| Year            | smallint   | Nie  |                     |                    |
| Month           | tinyint    | Tak  | NULL                |                    |
| Day             | tinyint    | Tak  | NULL                |                    |
| Round           | varchar(6) | Tak  | NULL                |                    |
| WhiteID         | mediumint  | Nie  |                     | all_players -> id  |
| BlackID         | mediumint  | Nie  |                     | all_players -> id  |
| Result          | varchar(7) | Tak  | NULL                |                    |
| WhiteElo        | smallint   | Tak  | NULL                |                    |
| BlackElo        | smallint   | Tak  | NULL                |                    |
| ecoID           | smallint   | Nie  |                     | eco -> id          |

#### Indeksy

| Nazwa klucza | Typ   | Jednoznaczny | Spakowany | Kolumna | Metoda porównywania napisów | Null |
| ------------ | ----- | ------------ | --------- | ------- | --------------------------- | ---- |
| PRIMARY      | BTREE | Tak          | Nie       | id      | A                           | Nie  |
| WhiteID      | BTREE | Nie          | Nie       | WhiteID | A                           | Nie  |
| BlackID      | BTREE | Nie          | Nie       | BlackID | A                           | Nie  |
| eventID      | BTREE | Nie          | Nie       | eventID | A                           | Nie  |
| siteID       | BTREE | Nie          | Nie       | siteID  | A                           | Nie  |
| Year         | BTREE | Nie          | Nie       | Year    | A                           | Nie  |
|              |       |              |           | Month   |                             |      |
|              |       |              |           | Day     |                             |      |
| ecoID        | BTREE | Nie          | Nie       | ecoID   | A                           | Nie  |
| Result       | BTREE | Nie          | Nie       | Result  | A                           | Tak  |

### all_players

| Kolumna         | Typ         | Null | Ustawienia domyślne | Odsyłacze do        |
| --------------- | ----------- | ---- | ------------------- | ------------------- |
| id (Podstawowy) | mediumint   | Nie  |                     | players -> id       |
| fullname        | varchar(80) | Nie  |                     | players -> fullname |

#### Indeksy

| Nazwa klucza | Typ      | Jednoznaczny | Spakowany | Kolumna  | Metoda porównywania napisów | Null |
| ------------ | -------- | ------------ | --------- | -------- | --------------------------- | ---- |
| PRIMARY      | BTREE    | Tak          | Nie       | id       | A                           | Nie  |
| fullname     | BTREE    | Tak          | Nie       | fullname | A                           | Nie  |
| all_players  | BTREE    | Nie          | Nie       | id       | A                           | Nie  |
|              |          |              |           | fullname |                             |      |
| fullname_2   | FULLTEXT | Nie          | Nie       | fullname |                             | Nie  |

### chess_events

| Kolumna         | Typ          | Null |
| --------------- | ------------ | ---- |
| id (Podstawowy) | mediumint    | Nie  |
| name            | varchar(100) | Nie  |

#### Indeksy

| Nazwa klucza | Typ      | Jednoznaczny | Spakowany | Kolumna  | Metoda porównywania napisów | Null |
| ------------ | -------- | ------------ | --------- | -------- | --------------------------- | ---- |
| PRIMARY      | BTREE    | Tak          | Nie       | id       | A                           | Nie  |
| name         | BTREE    | Tak          | Nie       | fullname | A                           | Nie  |
| name_2       | FULLTEXT | Nie          | Nie       | fullname |                             | Nie  |

### eco

| Kolumna         | Typ         | Null | Ustawienia domyślne |
| --------------- | ----------- | ---- | ------------------- |
| id (Podstawowy) | smallint    | Nie  |                     |
| ECO             | char(3)     | Nie  |                     |
| opening         | varchar(35) | Tak  | NULL                |
| variant         | text        | Tak  | NULL                |

#### Indeksy

| Nazwa klucza | Typ   | Jednoznaczny | Spakowany | Kolumna | Metoda porównywania napisów | Null |
| ------------ | ----- | ------------ | --------- | ------- | --------------------------- | ---- |
| PRIMARY      | BTREE | Tak          | Nie       | id      | A                           | Nie  |
| ECO          | BTREE | Tak          | Nie       | ECO     | A                           | Nie  |
| ECO_2        | BTREE | Nie          | Nie       | ECO     | A                           | Nie  |

### eco

| Kolumna             | Typ         | Null | Ustawienia domyślne |
| ------------------- | ----------- | ---- | ------------------- |
| fideid (Podstawowy) | int         | Nie  |                     |
| name                | varchar(90) | Tak  | NULL                |
| country             | char(3)     | Tak  | NULL                |
| sex                 | char(3)     | Tak  | NULL                |
| title               | varchar(3)  | Tak  | NULL                |
| w_title             | varchar(3)  | Tak  | NULL                |
| o_title             | varchar(9)  | Tak  | NULL                |
| foa_title           | varchar(3)  | Tak  | NULL                |
| rating              | smallint    | Tak  | NULL                |
| games               | smallint    | Tak  | NULL                |
| k                   | tinyint     | Tak  | NULL                |
| rapid_rating        | smallint    | Tak  | NULL                |
| rapid_games         | smallint    | Tak  | NULL                |
| rapid_k             | tinyint     | Tak  | NULL                |
| blitz_rating        | smallint    | Tak  | NULL                |
| blitz_games         | smallint    | Tak  | NULL                |
| blitz_k             | tinyint     | Tak  | NULL                |
| birthday            | mediumint   | Tak  | NULL                |
| flag                | varchar(2)  | Tak  | NULL                |

#### Indeksy

| Nazwa klucza | Typ      | Jednoznaczny | Spakowany | Kolumna | Metoda porównywania napisów | Null |
| ------------ | -------- | ------------ | --------- | ------- | --------------------------- | ---- |
| PRIMARY      | BTREE    | Tak          | Nie       | fideid  | A                           | Nie  |
| name         | FULLTEXT | Nie          | Nie       | name    |                             | Tak  |

### players

| Kolumna         | Typ         | Null |
| --------------- | ----------- | ---- |
| id (Podstawowy) | mediumint   | Nie  |
| fullname        | varchar(80) | Nie  |

#### Indeksy

| Nazwa klucza         | Typ      | Jednoznaczny | Spakowany | Kolumna  | Metoda porównywania napisów | Null |
| -------------------- | -------- | ------------ | --------- | -------- | --------------------------- | ---- |
| PRIMARY              | BTREE    | Tak          | Nie       | id       | A                           | Nie  |
| fullname             | BTREE    | Tak          | Nie       | fullname | A                           | Nie  |
| idx_players_relation | BTREE    | Nie          | Nie       | id       | A                           | Nie  |
|                      |          |              |           | fullname | A                           | Nie  |
| fullname_2           | BTREE    | Nie          | Nie       | fullname | A                           | Nie  |
| fullname_3           | FULLTEXT | Nie          | Nie       | fullname |                             | Nie  |

### poland_games

| Kolumna         | Typ        | Null | Ustawienia domyślne | Odsyłacze do         |
| --------------- | ---------- | ---- | ------------------- | -------------------- |
| id (Podstawowy) | int        | Nie  |                     |                      |
| moves_blob      | blob       | Tak  | NULL                |                      |
| eventID         | mediumint  | Nie  |                     | chess_events -> id   |
| siteID          | mediumint  | Nie  |                     | sites -> id          |
| Year            | smallint   | Nie  |                     |                      |
| Month           | tinyint    | Tak  | NULL                |                      |
| Day             | tinyint    | Tak  | NULL                |                      |
| Round           | varchar(6) | Tak  | NULL                |                      |
| WhiteID         | mediumint  | Nie  |                     | poland_players -> id |
| BlackID         | mediumint  | Nie  |                     | poland_players -> id |
| Result          | varchar(7) | Tak  | NULL                |                      |
| WhiteElo        | smallint   | Tak  | NULL                |                      |
| BlackElo        | smallint   | Tak  | NULL                |                      |
| ecoID           | smallint   | Nie  |                     | eco -> id            |

#### Indeksy

| Nazwa klucza | Typ   | Jednoznaczny | Spakowany | Kolumna | Metoda porównywania napisów | Null |
| ------------ | ----- | ------------ | --------- | ------- | --------------------------- | ---- |
| PRIMARY      | BTREE | Tak          | Nie       | id      | A                           | Nie  |
| Year         | BTREE | Nie          | Nie       | Year    | A                           | Nie  |
| WhiteID      | BTREE | Nie          | Nie       | WhiteID | A                           | Nie  |
| BlackID      | BTREE | Nie          | Nie       | BlackID | A                           | Nie  |
| eventID      | BTREE | Nie          | Nie       | eventID | A                           | Nie  |
| siteID       | BTREE | Nie          | Nie       | siteID  | A                           | Nie  |
| ecoID        | BTREE | Nie          | Nie       | ecoID   | A                           | Nie  |

### poland_players

| Kolumna         | Typ         | Null | Ustawienia domyślne | Odsyłacze do |
| --------------- | ----------- | ---- | ------------------- | ------------ |
| id (Podstawowy) | mediumint   | Nie  | players -> id       |              |
| fullname        | varchar(80) | Nie  | players -> fullname |              |

#### Indeksy

| Nazwa klucza | Typ      | Jednoznaczny | Spakowany | Kolumna  | Metoda porównywania napisów | Null |
| ------------ | -------- | ------------ | --------- | -------- | --------------------------- | ---- |
| PRIMARY      | BTREE    | Tak          | Nie       | id       | A                           | Nie  |
| fullname     | BTREE    | Tak          | Nie       | fullname | A                           | Nie  |
| pol_players  | BTREE    | Nie          | Nie       | id       | A                           | Nie  |
|              |          |              |           | fullname | A                           | Nie  |
| fullname_2   | FULLTEXT | Nie          | Nie       | fullname |                             | Nie  |

### sites

| Kolumna         | Typ         | Null |
| --------------- | ----------- | ---- |
| id (Podstawowy) | mediumint   | Nie  |
| site            | varchar(80) | Nie  |

#### Indeksy

| Nazwa klucza | Typ   | Jednoznaczny | Spakowany | Kolumna | Metoda porównywania napisów | Null |
| ------------ | ----- | ------------ | --------- | ------- | --------------------------- | ---- |
| PRIMARY      | BTREE | Tak          | Nie       | id      | A                           | Nie  |
| sites        | BTREE | Tak          | Nie       | site    | A                           | Nie  |
| site         | BTREE | Nie          | Nie       | site    | A                           | Nie  |

## blob

w `all_games` i `poland_games` to sekwencja 2-bajtowych uci

- 6 bitów - pole początkowe (0,1,...,63 - A1,B1,...,H8)
- 6 bitów - pole docelowe (0,1,...,63 - A1,B1,...,H8)
- 3 bity - promowana figura (0-6 - p, n, b, r, q, k, null)

### kodowanie

- packed = src << 10 | dest << 4 | (piece &0x07)

### dekodowanie

- src = (packed >> 10) & 0x3f
- dst = (packed >> 4) & 0x3f
- promoted = packed & 0x07
