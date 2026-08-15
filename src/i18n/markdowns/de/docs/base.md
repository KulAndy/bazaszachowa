# Datenbank

![Struktur](/docs/struct.png "Struktur")

## Tabellen:

### all_games

| Spalte          | Typ        | Null | Standardwert | Verweise             |
| --------------- | ---------- | ---- | ------------ | -------------------- |
| id (Primärschlüssel) | int    | Nein |              |                      |
| moves_blob      | blob       | Ja   | NULL         |                      |
| eventID         | mediumint | Nein |              | chess_events -> id   |
| siteID          | mediumint | Nein |              | sites -> id          |
| Year            | smallint  | Nein |              |                      |
| Month           | tinyint   | Ja   | NULL         |                      |
| Day             | tinyint   | Ja   | NULL         |                      |
| Round           | varchar(6) | Ja  | NULL         |                      |
| WhiteID         | mediumint | Nein |              | all_players -> id    |
| BlackID         | mediumint | Nein |              | all_players -> id    |
| Result          | varchar(7) | Ja  | NULL         |                      |
| WhiteElo        | smallint  | Ja   | NULL         |                      |
| BlackElo        | smallint  | Ja   | NULL         |                      |
| ecoID           | smallint  | Nein |              | eco -> id            |

#### Indizes

| Schlüsselname | Typ      | Eindeutig | Gepackt | Spalte   | Sortierung | Null |
| ------------- | -------- | --------- | ------- | -------- | ---------- | ---- |
| PRIMARY       | BTREE    | Ja        | Nein    | id       | A          | Nein |
| WhiteID       | BTREE    | Nein      | Nein    | WhiteID  | A          | Nein |
| BlackID       | BTREE    | Nein      | Nein    | BlackID  | A          | Nein |
| eventID       | BTREE    | Nein      | Nein    | eventID  | A          | Nein |
| siteID        | BTREE    | Nein      | Nein    | siteID   | A          | Nein |
| Year          | BTREE    | Nein      | Nein    | Year     | A          | Nein |
|               |          |           |         | Month    |            |      |
|               |          |           |         | Day      |            |      |
| ecoID         | BTREE    | Nein      | Nein    | ecoID    | A          | Nein |
| Result        | BTREE    | Nein      | Nein    | Result   | A          | Ja   |

### all_players

| Spalte              | Typ          | Null | Verweise          |
| ------------------- | ------------ | ---- | ----------------- |
| id (Primärschlüssel) | mediumint   | Nein | players -> id     |
| fullname            | varchar(255) | Nein | players -> fullname |

#### Indizes

| Schlüsselname | Typ      | Eindeutig | Gepackt | Spalte   | Sortierung | Null |
| ------------- | -------- | --------- | ------- | -------- | ---------- | ---- |
| PRIMARY       | BTREE    | Ja        | Nein    | id       | A          | Nein |
| fullname      | BTREE    | Ja        | Nein    | fullname | A          | Nein |
| all_players   | BTREE    | Nein      | Nein    | id       | A          | Nein |
|               |          |           |         | fullname |            |      |
| fullname_2    | FULLTEXT | Nein      | Nein    | fullname |            | Nein |

### chess_events

| Spalte              | Typ          | Null |
| ------------------- | ------------ | ---- |
| id (Primärschlüssel) | mediumint    | Nein |
| name                | varchar(100) | Nein |

#### Indizes

| Schlüsselname | Typ      | Eindeutig | Gepackt | Spalte   | Sortierung | Null |
| ------------- | -------- | --------- | ------- | -------- | ---------- | ---- |
| PRIMARY       | BTREE    | Ja       | Nein     | id       | A          | Nein |
| name          | BTREE    | Ja       | Nein     | fullname | A          | Nein |
| name_2        | FULLTEXT | Nein     | Nein    | fullname |            | Nein |

### eco

| Spalte          | Typ           | Null | Standardwert |
| -------------- | ------------- | ---- | ------------ |
| id (Primärschlüssel) | smallint | Nein |              |
| uci            | varbinary(255) | Nein |             |
| ECO            | char(3)        | Nein |             |
| opening        | varchar(35)    | Ja   | NULL         |
| variant        | text           | Ja   | NULL         |

#### Indizes

| Schlüsselname | Typ   | Eindeutig | Gepackt | Spalte | Sortierung | Null |
| ------------- | ----- | --------- | ------- | ------ | --------- | ---- |
| PRIMARY       | BTREE | Ja        | Nein    | id     | A          | Nein |
| uci           | BTREE | Ja        | Nein    | uci    | A          | Nein |
| ECO            | BTREE | Ja        | Nein    | ECO    | A          | Nein |
| ECO_2          | BTREE | Nein      | Nein    | ECO    | A          | Nein |

### fide_players

| Spalte              | Typ                                                       | Null | Standardwert |
| ------------------- | --------------------------------------------------------- | ---- | ------------ |
| fideid (Primärschlüssel) | int                                                   | Nein |              |
| name                | varchar(255)                                              | Ja   | NULL         |
| country             | enum('AFG', 'AHO', 'ALB', 'ALG', 'AND', 'ANG', ...)       | Ja   | NULL         |
| sex                 | enum('M', 'F')                                            | Ja   | NULL         |
| title               | enum('GM', 'IM', 'FM', 'CM', 'WGM', 'WIM', ...)           | Ja   | NULL         |
| w_title             | enum('WGM', 'WIM', 'WFM', 'WCM')                          | Ja   | NULL         |
| o_title             | set('IA', 'FA', 'FST', 'FT', 'FI', 'NI', 'DI', 'IO', ...) | Ja   | NULL         |
| rating              | smallint                                                  | Ja   | NULL         |
| rapid_rating        | smallint                                                  | Ja   | NULL         |
| blitz_rating        | smallint                                                  | Ja   | NULL         |
| birthday            | year                                                      | Ja   | NULL         |

#### Indizes

| Schlüsselname | Typ   | Eindeutig | Gepackt | Spalte | Sortierung | Null |
| ------------- | ----- | --------- | ------- | ------ | --------- | ---- |
| PRIMARY       | BTREE | Ja        | Nein    | fideid | A         | Nein |
| name          | BTREE | Nein      | Nein    | name   | A         | Ja   |

### players

| Spalte          | Typ          | Null |
| --------------- | ------------ | ---- |
| id (Primärschlüssel) | mediumint | Nein |
| fullname        | varchar(255) | Nein |

#### Indizes

| Schlüsselname          | Typ      | Eindeutig | Gepackt | Spalte   | Sortierung | Null |
| ---------------------- | -------- | --------- | ------- | -------- | ---------- | ---- |
| PRIMARY                | BTREE    | Ja        | Nein    | id       | A          | Nein |
| fullname               | BTREE    | Ja        | Nein    | fullname | A          | Nein |
| idx_players_relation   | BTREE    | Nein      | Nein    | id       | A          | Nein |
|                        |          |           |         | fullname | A          | Nein |
| fullname_3             | FULLTEXT | Nein      | Nein    | fullname |            | Nein |

### poland_games

| Spalte          | Typ        | Null | Standardwert | Verweise              |
| --------------- | ---------- | ---- | ------------ | --------------------- |
| id (Primärschlüssel) | int     | Nein |              |                       |
| moves_blob      | blob       | Ja   | NULL         |                       |
| eventID         | mediumint | Nein |              | chess_events -> id    |
| siteID          | mediumint | Nein |              | sites -> id           |
| Year            | smallint  | Nein |              |                       |
| Month           | tinyint   | Ja   | NULL         |                       |
| Day             | tinyint   | Ja   | NULL         |                       |
| Round           | varchar(6) | Ja  | NULL         |                       |
| WhiteID         | mediumint | Nein |              | poland_players -> id  |
| BlackID         | mediumint | Nein |              | poland_players -> id  |
| Result          | varchar(7) | Ja   | NULL         |                       |
| WhiteElo        | smallint  | Ja   | NULL         |                       |
| BlackElo        | smallint  | Ja   | NULL         |                       |
| ecoID           | smallint  | Nein |              | eco -> id             |

#### Indizes

| Schlüsselname | Typ   | Eindeutig | Gepackt | Spalte  | Sortierung | Null |
| ------------- | ----- | --------- | ------- | ------- | --------- | ---- |
| PRIMARY       | BTREE | Ja        | Nein    | id      | A          | Nein |
| Year          | BTREE | Nein      | Nein    | Year    | A          | Nein |
|               |       |           |         | Month   |           |      |
|               |       |           |         | Day     |           |      |
| WhiteID       | BTREE | Nein      | Nein    | WhiteID | A          | Nein |
| BlackID       | BTREE | Nein      | Nein    | BlackID | A          | Nein |
| eventID       | BTREE | Nein      | Nein    | eventID | A          | Nein |
| siteID        | BTREE | Nein      | Nein    | siteID  | A          | Nein |
| ecoID         | BTREE | Nein      | Nein    | ecoID   | A          | Nein |

### poland_players

| Spalte          | Typ          | Null | Verweise          |
| --------------- | ------------ | ---- | ----------------- |
| id (Primärschlüssel) | mediumint | Nein | players -> id     |
| fullname        | varchar(255) | Nein | players -> fullname |

#### Indizes

| Schlüsselname | Typ      | Eindeutig | Gepackt | Spalte   | Sortierung | Null |
| ------------- | -------- | --------- | ------- | -------- | ---------- | ---- |
| PRIMARY       | BTREE    | Ja        | Nein    | id       | A          | Nein |
| fullname      | BTREE    | Ja        | Nein    | fullname | A          | Nein |
| pol_players   | BTREE    | Nein      | Nein    | id       | A          | Nein |
|               |          |           |         | fullname | A          | Nein |
| fullname_2    | FULLTEXT | Nein      | Nein    | fullname |            | Nein |

### sites

| Spalte       | Typ          | Null |
| ------------ | ------------ | ---- |
| id (Primärschlüssel) | mediumint | Nein |
| site         | varchar(255) | Nein |

#### Indizes

| Schlüsselname | Typ   | Eindeutig | Gepackt | Spalte | Sortierung | Null |
| ------------- | ----- | --------- | ------- | ------ | --------- | ---- |
| PRIMARY       | BTREE | Ja        | Nein    | id     | A          | Nein |
| sites         | BTREE | Ja        | Nein    | site   | A          | Nein |
| site          | BTREE | Nein      | Nein    | site   | A          | Nein |

## blob

In `all_games` und `poland_games` ist dies eine Folge von 2-Byte-UCI-Werten:

- 6 Bit – Ausgangsfeld (0,1,...,63 – A1,B1,...,H8)
- 6 Bit – Zielfeld (0,1,...,63 – A1,B1,...,H8)
- 3 Bit – Umwandlungsfigur (0-6 – p, n, b, r, q, k, null)

### Kodierung

- packed = src << 10 | dest << 4 | (piece &0x07)

### Dekodierung

- src = (packed >> 10) & 0x3f
- dst = (packed >> 4) & 0x3f
- promoted = packed & 0x07
