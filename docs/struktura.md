<style>
    table, th, td {
        border: .1em solid #000;
    }    
    table{
        border-collapse: collapse;
    }
    th{
        background-color: #e5e5e5;
    }
    th, td {
        padding: 0.2em;
    }
</style>
# Struktura

## baza danych

![struktura](./struktura.png "Struktura")

### Tabele:

#### all_games
| Kolumna | Typ | Null | Ustawienia domyślne| Odsyłacze do |
| ------- | --- | ---- | -------------------| --------------- |
|id (Podstawowy)|	int	|Nie			|	|
|moves|	text|	Tak|	NULL	|		|
|eventID|	mediumint|	Nie|	|	chess_events -> id	|	
|siteID|	mediumint|	Nie	|	|sites -> id|		
|Year|	smallint|	Nie	|			|
|Month|	tinyint	|Tak	|NULL	|		|
|Day|	tinyint|	Tak	|NULL	|		|
|Round|	varchar(6)|	Tak	|NULL	|		|
|WhiteID|	mediumint|	Nie|	|	all_players -> id|		
|BlackID|	mediumint|	Nie	|	|all_players -> id|		
|Result|	varchar(7)|	Tak|	NULL	|		|
|WhiteElo|	smallint|	Tak	|NULL	|	|	
|BlackElo|	smallint|	Tak	|NULL	|	|	
|ecoID|	smallint|	Nie	|	|eco -> id	|

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	| Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|WhiteID	|BTREE	|Nie	|Nie	|WhiteID	|A	|Nie	|
|BlackID	|BTREE	|Nie	|Nie	|BlackID	|A	|Nie	|
|eventID	|BTREE	|Nie	|Nie	|eventID	|A	|Nie|	
|siteID	|BTREE	|Nie	|Nie	|siteID	|A	|Nie	|
|Year	|BTREE	|Nie	|Nie	|Year	|A	|Nie	|
|ecoID	|BTREE	|Nie	|Nie	|ecoID	|A	|Nie	|
|Result	|BTREE	|Nie	|Nie	|Result	|A	|Tak	|

#### all_players
| Kolumna | Typ | Null | Ustawienia domyślne| Odsyłacze do |
| ------- | --- | ---- | -------------------| --------------- |
|id (Podstawowy)	|mediumint	|Nie |		|players -> id|		
|fullname	|varchar(80)	|Nie |		|players -> fullname|	

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id     	|A	|Nie|	
|fullname	|BTREE	|Tak	|Nie	|fullname	|A	|Nie|	
|all_players	|BTREE |	Nie	|Nie	|id 	|A	|Nie	|
|               |      |     |       |fullname	|A|	Nie|
|fullname_2	|FULLTEXT	|Nie	|Nie	|fullname	|	|Nie|	

#### chess_events
| Kolumna | Typ | Null | 
| ------- | --- | ---- | 
|id (Podstawowy)	|mediumint	|Nie	|		
|name	|varchar(100)	|Nie|	

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|name	|BTREE	|Tak	|Nie	|fullname	|A	|Nie|	
|name_2	|FULLTEXT	|Nie	|Nie	|fullname|	|Nie|	

#### eco
| Kolumna | Typ | Null | Ustawienia domyślne |
| ------- | --- | ---- | ------------------- |
|id (Podstawowy)	|smallint	|Nie		|		
|ECO	|char(3)	|Nie		|		|
|opening|	varchar(35)|	Tak	|NULL|			
|variant	|text	|Tak	|NULL|	

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|ECO	|BTREE	|Tak	|Nie	|ECO	|A	|Nie|	
|ECO_2	|BTREE	|Nie	|Nie	|ECO	|A	|Nie|	

#### eco
| Kolumna | Typ | Null | Ustawienia domyślne |
| ------- | --- | ---- | ------------------- |
|fideid (Podstawowy)	|int	|Nie|	|			
|name	|varchar(90)	|Tak	|NULL|			
|country	|char(3)	|Tak	|NULL|			
|sex	|char(3)	|Tak	|NULL	|		
|title	|varchar(3)	|Tak	|NULL	|		
|w_title	|varchar(3)	|Tak	|NULL|			
|o_title	|varchar(9)	|Tak	|NULL|			
|foa_title	|varchar(3)	|Tak	|NULL|			
|rating	|smallint	|Tak	|NULL	|		
|games	|smallint	|Tak	|NULL	|		
|k	|tinyint	|Tak	|NULL		|	
|rapid_rating	|smallint	|Tak	|NULL|			
|rapid_games	|smallint	|Tak	|NULL|			
|rapid_k	|tinyint	|Tak	|NULL	|		
|blitz_rating	|smallint	|Tak	|NULL|			
|blitz_games	|smallint	|Tak	|NULL|			
|blitz_k	|tinyint	|Tak	|NULL	|		
|birthday	|mediumint	|Tak	|NULL	|		
|flag	|varchar(2)	|Tak	|NULL		|

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|fideid	|A	|Nie|	
|name	|FULLTEXT	|Nie	|Nie	|name	|	|Tak|	

#### players
| Kolumna | Typ | Null |  
| ------- | --- | ---- | 
|id (Podstawowy)	|mediumint	|Nie|		
|fullname	|varchar(80)	|Nie|

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|fullname	|BTREE	|Tak	|Nie	|fullname	|A	|Nie|	
|idx_players_relation	|BTREE |	Nie	|Nie	|id|	A	|Nie	|
|               |      |     |       |fullname|	A|	Nie|
|fullname_2	|BTREE	|Nie	|Nie	|fullname	|	A|Nie|	
|fullname_3	|FULLTEXT	|Nie	|Nie	|fullname	|	|Nie|	


#### poland_games
| Kolumna | Typ | Null | Ustawienia domyślne| Odsyłacze do |
| ------- | --- | ---- | -------------------| --------------- |
|id (Podstawowy)|	int	|Nie			|	|
|moves|	text|	Tak|	NULL	|		|
|eventID|	mediumint|	Nie|	|	chess_events -> id	|	
|siteID|	mediumint|	Nie	|	|sites -> id|		
|Year|	smallint|	Nie	|			|
|Month|	tinyint	|Tak	|NULL	|		|
|Day|	tinyint|	Tak	|NULL	|		|
|Round|	varchar(6)|	Tak	|NULL	|		|
|WhiteID|	mediumint|	Nie|	|	poland_players -> id|		
|BlackID|	mediumint|	Nie	|	|poland_players -> id|		
|Result|	varchar(7)|	Tak|	NULL	|		|
|WhiteElo|	smallint|	Tak	|NULL	|	|	
|BlackElo|	smallint|	Tak	|NULL	|	|	
|ecoID|	smallint|	Nie	|	|eco -> id	|

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|Year	|BTREE	|Nie	|Nie	|Year	|A	|Nie	|
|WhiteID	|BTREE	|Nie	|Nie	|WhiteID	|A	|Nie	|
|BlackID	|BTREE	|Nie	|Nie	|BlackID	|A	|Nie	|
|eventID	|BTREE	|Nie	|Nie	|eventID	|A	|Nie|	
|siteID	|BTREE	|Nie	|Nie	|siteID	|A	|Nie	|
|ecoID	|BTREE	|Nie	|Nie	|ecoID	|A	|Nie	|


#### poland_players
| Kolumna | Typ | Null | Ustawienia domyślne| Odsyłacze do |
| ------- | --- | ---- | -------------------| --------------- |
|id (Podstawowy)	|mediumint	|Nie		|players -> id|		
|fullname	|varchar(80)	|Nie		|players -> fullname|	

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|fullname	|BTREE	|Tak	|Nie	|fullname	|A	|Nie|	
|pol_players	|BTREE |	Nie	|Nie	|id |A	|Nie	|
|               |      |     |       |fullname|	A|	Nie|
|fullname_2	|FULLTEXT	|Nie	|Nie	|fullname	|	|Nie|	

#### sites
| Kolumna | Typ | Null | 
| ------- | --- | ---- | 
|id (Podstawowy)	|mediumint	|Nie	|		
|site	|varchar(80)	|Nie|	

##### Indeksy
|Nazwa klucza	|Typ	|Jednoznaczny	|Spakowany	|Kolumna	|Metoda porównywania napisów	|Null|
|-------------- |------ | ------------- |---------- | --------- | ------------------------------ | -- |
|PRIMARY	|BTREE	|Tak	|Nie	|id	|A	|Nie|	
|sites	|BTREE	|Tak	|Nie	|site	|A	|Nie|	
|site	|BTREE	|Nie	|Nie	|site	|A	|Nie|	


## strona

/

* **content.php** - kontener z zawartością strony, wymaga left_content i manifest
* **index.php** - plik domyślny, wymaga header, menu, content, footer
* **left_content.php** - zawiera przydatne linki
* **LICENSE** - licencja
* **manifest.php** - manifest
* **API/** - API, patrz [/docs/API.md](/docs/API.md)
* **contact/** - formularz kontaktowy
  * **content.php** - formularz, przekierowuje do send
  * **index.php** - strona domyślna, wymaga content
  * **send** - wysyła wiadomość na maila
* **css/** - arkusze stylów
  * **chessicons.css** - arkusz do wyświetlania partii (dla game/)
  * **player_data.css** - arkusz dla player_data/
  * **reset.css** - reset css-a
  * **search.css** - arkusz wyszukiwarki partii
  * **style.css** - domyślny arkusz stylów
  * **chessicons/**
        * **\[bw\]\[bknpqr\].svg** - grafiki bierek
* **docs/** - dokumentacja
  * **API.md** - opis API
  * **struktura.md** - ten plik
  * **struktura.png** - grafika z relacją bazy danych
* **game/** - przeglądarka gier
    * **license.txt** - plik z linkiem do strony autora grafik
  * **content.php** - kontener na zawartość
  * **index.php** - plik domyślny, ustawia osobny nagłówek, wymaga menu,content,footer
* **game_raw/** - partia w formacie [PGN](http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm)
  * **content.php** - zawartość strony, wymaga login_data
  * **index.php** - plik domyślny, wymaga content
* **license/** - licencja
  * **index.php** - plik domyślny, wymaga header, menu, content, footer
  * **content.php** - faktyczna licencja
* **markodwn** - parser markdown
    * **MarkodowParser.php** - opakowanie klasy
    * **parse.php** - skrypt do parsowania stron markdown
        * metoda: GET
        * ```
          {
              url: url - adres
          }
          ```
* **php_functions** - funkcje php patrz [/docs/php.md](/docs/php.md)
* **player_data/** - dane o zawodniku
  * **content** - kontener na dane
  * **index.php** - plik domyślny
* **players/** - wyszukiwarka graczy
  * **content.php** - formularz do wyszukiwania i skrypt do wyszukiwania w bazie
  * **index.php** - plik domyślny
* **rodo**/ - informacja dla fanów RODO
  * **content.php** -informacja
  * **index.php** - plik domyślny
* **script/** - katalog ze skryptami javascripta patrz [/docs/javascript.md](/docs/javascript.md)
* **search/** - wyszukiwarka partii
  * **content.php** - kontener na zawartość
  * **index.php** - plik domyślny
* **vendor/** - katalog z bibliotekami