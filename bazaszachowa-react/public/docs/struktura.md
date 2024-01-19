# Struktura

## baza danych

![struktura](/docs/struktura.png "Struktura")

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
* **App.css** - główny plik css
* **App.js** - główny plik aplikacji
* **ChessEditor** - szachownica z możliwością edycji
    * **ButtonsBar.js** - pasek przycisków
    * **Chessboard.js** - szachownica
    * **HalfMove.js** - półruchy do notacji
    * **index.js** - główny plik modułu
    * **Notation.js** - notacja
    * **style.css** - style
    * **TouchableIcon.js** - klikalna ikona
* **ChessProcessor** - generator drzewa wariantów
    * **index.js** - główny plik modułu
* **components** - komponenty
    * **ColorStats.js** - statystki koloru
    * **Content.js** - kontener na główną zawartość
    * **CrPlayer.js** - karta zawodnika PZSzach
    * **CrPlayerList.js** - lista zawodników PZSzach
    * **FidePlayer.js** - karta zawodnika FIDE
    * **FidePlayerList.js** - lista zawodników FIDE
    * **Footer.js** - stopka
    * **GamesTable.js** - tabela gier
    * **LinkGamesTable.js** - tabela gier, kliknięcie w wiersz przenosi do partii
    * **MarkdownFileReader.js** - czytnik plików .md
    * **Menu.js** - menu
    * **OpeningStats.js** - statystyki dla obu kolorów
    * **PositionsMoves.js** - preferowane ruchy w pozycji
    * **SearchPlayersWithHint.js** - input podpowiadający zawodników
    * **StockfishAnalysis.js** - ocena pozycji silnika
* **index.css** - globalne style
* **index.js** - główny plik reacta
* **logo.svg** - logo reacta
* **reportWebVitals.js** - zależności reacta
* **reset.css** - arkusz zerujący
* **screens** - pliki szablonów stron
    * **Bug.css** - arkusz stylów
    * **Bug.js** - zgłaszanie błędów
    * **Contact.css** - arkusz stylów
    * **Contact.js** - kontalt
    * **Docs.js** - dokumentacja
    * **Game.css** - arkusz stylów
    * **Game.js** - gra
    * **Games.css** - arkusz stylów
    * **Games.js** - wyszukiwarka gier
    * **Home.js** - strona główna
    * **License.js** - licencja
    * **NotFound.js** - dla http 404
    * **Player.css** - arkusz stylów
    * **Player.js** - profil gracza
    * **Players.css** - arkusz stylów
    * **Players.js** - wyszukiwarka graczy
    * **Preparation.css** - arkusz stylów
    * **Preparation.js** - przygotowanie
    * **PreparationForm.css** - arkusz stylów
    * **PreparationForm.js** - wyszukiwarka przygtowań graczy
    * **PreparationPlayer.css** - arkusz stylów
    * **PreparationPlayer.js** - przygotowanie gracza, drzewo wariantów
    * **Rodo.js** - rodo
