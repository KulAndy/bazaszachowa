# PHP

pod adresem bazaszachowa.smallhost.pl/php_functions/(plik) są następujące pliki

functions.php jest główny plikiem importujące pozostałe z danego katalogu
funkcje mają te same nazwy co pliki (bez.php)

*  db
    *  close_connection.php - zamyka połączenia
    *  functions.php
    *  get_game.php - pobiera konkretną grę
    *  min_max_year_elo.php - pobiera zakres lat i maks. elo
    *  query.php - wykonuje zapytanie
        * bind params
        * query
    *  search_game.php - szuka gier
    *  search_opening_game.php - gry z danego debiutu
    *  search_players.php - szuka graczy zaczynających się od
    *  start_connection.php - zaczyna opłączenie
*  functions.php
*  graph
    *  functions.php
    *  jpeg.php - tworzy obraz jpeg
    *  svg.php - tworzy obraz svg
*  html
    *  create_request_js_module.php - tworzy tag ```<script>``` z danymi ```$_POST```, ```$_GET``` i ```$_REQUEST``` 
    *  footer.php - stopkę ( do importowanie)
    *  functions.php
    *  header.php - nagłówek ( do importowanie)
    *  menu.php - menu ( do importowanie)
*  player_data
    *  cr_data.php - wyszukuje zawodnikóœ w cr
    *  fide_data.php - wyszukuje zawodników w fide
    *  functions.php
    *  player_opening_stats.php - wyszukuje staystyki debiutów 
*  row_to_pgn.php - rekord gry na pgn
