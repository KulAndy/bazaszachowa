# JAVASCRIPT

pod adresem bazaszachowa.smallhost.pl/script/(plik) są następujące pliki

pliki kończące się na functions.js są modułami

* chess.js - zewnętrzna biblioteka (moduł)
* display_functions.js - funckje wyświetlające
    * games_list(data, base = "all", games_list_id = "games") -  listę gier z API/search_game.php
    * update_data_list(input, optlist, base = "all") - pobiera podpowiedzi dla inputa (nazwiska graczy)
    * players_hints(players, optlist)- wyświetla podpowiedzi dla inputa (nazwiska graczy)
    * min_max_year_elo(data, max_elo_id = "maxElo", years_range_id = "yearRange") - zakres lat i maks. elo
    * cr_data(containerID, data, display_home_page = false) - zawodników z cr-u
    * opening_stats(data, fullname, container_id = "stats") - statystyki debiutów (obydwa kolory)
    * color_stats(color, data, fullname, container) - statystyki koloru 
    * game( data, main_container = "pre", board_id = "board", engine_container_id = "engine_container", moves_id = "boardMoves") - grę na szachownicy (pgnv.js)
    *   async game_controls( table, list, current, first_game = "first", previous_game = "previous", next_game = "next", last_game = "last" ) - przełączniki kolejnych gier
* game.js - głowny plik dla /game
* generic_functions.js - funckje ogólne
    * replaceNationalCharacters(text) - zwraca tekst bez polskich znaków
    * categoryToRanking(category) - zwraca wartość liczbową kategorii
* pgnv.js - biblioteka do przeglądania pgn-ów (zwykły skrypt)
* players_data.js - główny plik /players_data
* players.js - główny plik /players
* prep.js - główny plik /prep
* search_functions.js - wyszukiwanie
    * games( white, black, ignore = true, minYear = "", maxYear = "", events = "", minEco = 1, maxEco = 500, base = "all", searching = "classic" ) - gier
    * players(player, base = "all") - graczy
    * min_max_year_elo(fullname) - zakresu lat i maks. elo
    * cr_data(fullname) - danych z cr-u
    * fide_data(fullname) - danych z fide
    * player_opening_stats(fullname) - statystyk debiutów
    * opening_games(player, color, opening = null) - goer z danego debiutu
    * game(id, table) - konkretnej gry
* search.js - główny plik /search
* settings.js - adresy generowane przez php
    * URLS - menu
    * API - api
    * NOMENU_URLS - nie będące w menu, a występujące na stronie
* stockfish_controller.js - kontroler stockfisha (moduł)
    * analyze_board(fen_id = "boardFen", best_move = "bestmove") - analiza pozycji z szachownicy
    * analyze_fen(fen, best_move = "bestmove") - analiza pozycji
    * best_moves() - sortowanie ruchów
    * get_value(move) - wartość ruchu
    * get_san_from_uci(uci_moves, fen) - ruch uci na san (standardowa notacja)
* stockfish.js - silnik szachowy (zewn.)
* tree_functions.js - funkcje biblioteki
    * get_tree(rows) - utwórz drzewo z gier (z Api/search_game.php)
    * get_fens(row) - pobierz fen z gry
    * process_move(chess, move, points, year, index) - przetwazranie ruchu (zapisywanie danych do obiektu wariantów)
    * merge_fens_results(results) - scalanie wyników
    * search_fen(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board) - szukanie fen-a (board to **obiekt** z pgnv!!!)
    * move_san(san, board) - wykonuje ruch na szachownicy (board to **obiekt** z pgnv!!!)
