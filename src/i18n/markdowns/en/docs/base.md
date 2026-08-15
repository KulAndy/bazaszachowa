# database

![structure](/docs/struct.png "Structure")

## Tables:

### all_games

| Column          | Type       | Null | Default | References          |
| --------------- | ---------- | ---- | ------- | ------------------- |
| id (Primary)    | int        | No   |         |                     |
| moves_blob      | blob       | Yes  | NULL    |                     |
| eventID         | mediumint  | No   |         | chess_events -> id  |
| siteID          | mediumint  | No   |         | sites -> id         |
| Year            | smallint   | No   |         |                     |
| Month           | tinyint    | Yes  | NULL    |                     |
| Day             | tinyint    | Yes  | NULL    |                     |
| Round           | varchar(6) | Yes  | NULL    |                     |
| WhiteID         | mediumint  | No   |         | all_players -> id   |
| BlackID         | mediumint  | No   |         | all_players -> id   |
| Result          | varchar(7) | Yes  | NULL    |                     |
| WhiteElo        | smallint   | Yes  | NULL    |                     |
| BlackElo        | smallint   | Yes  | NULL    |                     |
| ecoID           | smallint   | No   |         | eco -> id           |

#### Indexes

| Key name | Type   | Unique | Packed | Column  | Collation | Null |
| -------- | ------ | ------ | ------ | ------- | --------- | ---- |
| PRIMARY  | BTREE  | Yes    | No     | id      | A         | No   |
| WhiteID  | BTREE  | No     | No     | WhiteID | A         | No   |
| BlackID  | BTREE  | No     | No     | BlackID | A         | No   |
| eventID  | BTREE  | No     | No     | eventID | A         | No   |
| siteID   | BTREE  | No     | No     | siteID  | A         | No   |
| Year     | BTREE  | No     | No     | Year    | A         | No   |
|          |        |        |        | Month   |           |      |
|          |        |        |        | Day     |           |      |
| ecoID    | BTREE  | No     | No     | ecoID   | A         | No   |
| Result   | BTREE  | No     | No     | Result  | A         | Yes  |

### all_players

| Column          | Type         | Null | References        |
| --------------- | ------------ | ---- | ----------------- |
| id (Primary)    | mediumint    | No   | players -> id     |
| fullname        | varchar(255) | No   | players -> fullname |

#### Indexes

| Key name    | Type     | Unique | Packed | Column   | Collation | Null |
| ----------- | -------- | ------ | ------ | -------- | --------- | ---- |
| PRIMARY     | BTREE    | Yes    | No     | id       | A         | No   |
| fullname    | BTREE    | Yes    | No     | fullname | A         | No   |
| all_players | BTREE    | No     | No     | id       | A         | No   |
|             |          |        |        | fullname |           |      |
| fullname_2  | FULLTEXT | No     | No     | fullname |           | No   |

### chess_events

| Column          | Type         | Null |
| --------------- | ------------ | ---- |
| id (Primary)    | mediumint    | No   |
| name            | varchar(100) | No   |

#### Indexes

| Key name | Type     | Unique | Packed | Column   | Collation | Null |
| -------- | -------- | ------ | ------ | -------- | --------- | ---- |
| PRIMARY  | BTREE    | Yes    | No     | id       | A         | No   |
| name     | BTREE    | Yes    | No     | fullname | A         | No   |
| name_2   | FULLTEXT | No     | No     | fullname |           | No   |

### eco

| Column          | Type          | Null | Default |
| --------------- | ------------- | ---- | ------- |
| id (Primary)    | smallint      | No   |         |
| uci             | varbinary(255) | No   |         |
| ECO             | char(3)       | No   |         |
| opening         | varchar(35)   | Yes  | NULL    |
| variant         | text          | Yes  | NULL    |

#### Indexes

| Key name | Type   | Unique | Packed | Column | Collation | Null |
| -------- | ------ | ------ | ------ | ------ | --------- | ---- |
| PRIMARY  | BTREE  | Yes    | No     | id     | A         | No   |
| uci      | BTREE  | Yes    | No     | uci    | A         | No   |
| ECO      | BTREE  | Yes    | No     | ECO    | A         | No   |
| ECO_2    | BTREE  | No     | No     | ECO    | A         | No   |

### fide_players

| Column              | Type                                                       | Null | Default |
| ------------------- | ---------------------------------------------------------- | ---- | ------- |
| fideid (Primary)    | int                                                        | No   |         |
| name                | varchar(255)                                               | Yes  | NULL    |
| country             | enum('AFG', 'AHO', 'ALB', 'ALG', 'AND', 'ANG', ...)        | Yes  | NULL    |
| sex                 | enum('M', 'F')                                             | Yes  | NULL    |
| title               | enum('GM', 'IM', 'FM', 'CM', 'WGM', 'WIM', ...)            | Yes  | NULL    |
| w_title             | enum('WGM', 'WIM', 'WFM', 'WCM')                           | Yes  | NULL    |
| o_title             | set('IA', 'FA', 'FST', 'FT', 'FI', 'NI', 'DI', 'IO', ...)  | Yes  | NULL    |
| rating              | smallint                                                   | Yes  | NULL    |
| rapid_rating        | smallint                                                   | Yes  | NULL    |
| blitz_rating        | smallint                                                   | Yes  | NULL    |
| birthday            | year                                                       | Yes  | NULL    |

#### Indexes

| Key name | Type  | Unique | Packed | Column | Collation | Null |
| -------- | ----- | ------ | ------ | ------ | --------- | ---- |
| PRIMARY  | BTREE | Yes    | No     | fideid | A         | No   |
| name     | BTREE | No    | No     | name   | A         | Yes  |

### players

| Column       | Type         | Null |
| ------------ | ------------ | ---- |
| id (Primary) | mediumint    | No   |
| fullname     | varchar(255) | No   |

#### Indexes

| Key name            | Type     | Unique | Packed | Column   | Collation | Null |
| ------------------- | -------- | ------ | ------ | -------- | --------- | ---- |
| PRIMARY             | BTREE    | Yes    | No     | id       | A         | No   |
| fullname            | BTREE    | Yes    | No     | fullname | A         | No   |
| idx_players_relation | BTREE    | No     | No     | id       | A         | No   |
|                     |          |        |        | fullname | A         | No   |
| fullname_3          | FULLTEXT | No     | No     | fullname |           | No   |

### poland_games

| Column          | Type       | Null | Default | References           |
| --------------- | ---------- | ---- | ------- | -------------------- |
| id (Primary)    | int        | No   |         |                      |
| moves_blob      | blob       | Yes  | NULL    |                      |
| eventID         | mediumint  | No   |         | chess_events -> id   |
| siteID          | mediumint  | No   |         | sites -> id          |
| Year            | smallint   | No   |         |                      |
| Month           | tinyint    | Yes  | NULL    |                      |
| Day             | tinyint    | Yes  | NULL    |                      |
| Round           | varchar(6) | Yes  | NULL    |                      |
| WhiteID         | mediumint  | No   |         | poland_players -> id |
| BlackID         | mediumint  | No   |         | poland_players -> id |
| Result          | varchar(7) | Yes  | NULL    |                      |
| WhiteElo        | smallint   | Yes  | NULL    |                      |
| BlackElo        | smallint   | Yes  | NULL    |                      |
| ecoID           | smallint   | No   |         | eco -> id            |

#### Indexes

| Key name | Type   | Unique | Packed | Column  | Collation | Null |
| -------- | ------ | ------ | ------ | ------- | --------- | ---- |
| PRIMARY  | BTREE  | Yes    | No     | id      | A         | No   |
| Year     | BTREE  | No     | No     | Year    | A         | No   |
|          |        |        |        | Month   |           |      |
|          |        |        |        | Day     |           |      |
| WhiteID  | BTREE  | No     | No     | WhiteID | A         | No   |
| BlackID  | BTREE  | No     | No     | BlackID | A         | No   |
| eventID  | BTREE  | No     | No     | eventID | A         | No   |
| siteID   | BTREE  | No     | No     | siteID  | A         | No   |
| ecoID    | BTREE  | No     | No     | ecoID   | A         | No   |

### poland_players

| Column       | Type         | Null | References        |
| ------------ | ------------ | ---- | ----------------- |
| id (Primary) | mediumint    | No   | players -> id     |
| fullname     | varchar(255) | No   | players -> fullname |

#### Indexes

| Key name   | Type     | Unique | Packed | Column   | Collation | Null |
| ---------- | -------- | ------ | ------ | -------- | --------- | ---- |
| PRIMARY    | BTREE    | Yes    | No     | id       | A         | No   |
| fullname   | BTREE    | Yes    | No     | fullname | A         | No   |
| pol_players | BTREE   | No     | No     | id       | A         | No   |
|            |          |        |        | fullname | A         | No   |
| fullname_2 | FULLTEXT | No     | No     | fullname |           | No   |

### sites

| Column       | Type         | Null |
| ------------ | ------------ | ---- |
| id (Primary) | mediumint    | No   |
| site         | varchar(255) | No   |

#### Indexes

| Key name | Type  | Unique | Packed | Column | Collation | Null |
| -------- | ----- | ------ | ------ | ------ | --------- | ---- |
| PRIMARY  | BTREE | Yes    | No     | id     | A         | No   |
| sites    | BTREE | Yes    | No     | site   | A         | No   |
| site     | BTREE | No     | No     | site   | A         | No   |

## blob

In `all_games` and `poland_games`, this is a sequence of 2-byte UCI values:

- 6 bits - source square (0,1,...,63 - A1,B1,...,H8)
- 6 bits - destination square (0,1,...,63 - A1,B1,...,H8)
- 3 bits - promoted piece (0-6 - p, n, b, r, q, k, null)

### encoding

- packed = src << 10 | dest << 4 | (piece &0x07)

### decoding

- src = (packed >> 10) & 0x3f
- dst = (packed >> 4) & 0x3f
- promoted = packed & 0x07
