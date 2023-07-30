import SETTINGS from "./settings.js";
import { Chess } from "./chess.js";

const TREE = {
  current_fen: "",
  fens_obj: {},
  games: [],
  async get_tree(rows) {
    this.games = rows;
    const promises = rows.map((row) => this.get_fens(row));
    try {
      try {
        const results = await Promise.all(promises);
        const mergedFens = this.merge_fens_results(results);
        this.fens_obj = mergedFens;
      } catch (error) {}
    } finally {
      return [(document.getElementById("loading_tree").style.display = "none")];
    }
  },
  get_fens(row) {
    const pgn = row.moves;
    const moves = pgn
      .replace(/1-0|0-1|1\/2-1\/2|\*/, "")
      .split(/\d+\.| /)
      .filter(Boolean);
    const result = row.Result;
    const points = result === "1-0" ? 1 : result === "0-1" ? 0 : 0.5;

    let chess = new Chess();
    const promises = moves.map((move) =>
      this.process_move(chess, move, points, row.Year, row.id)
    );

    return Promise.all(promises).then((results) => {
      const fens = results.reduce((merged, result) => {
        for (const fen in result) {
          if (!merged[fen]) {
            merged[fen] = result[fen];
          } else {
            for (const sanMove in result[fen]) {
              if (!merged[fen][sanMove]) {
                merged[fen][sanMove] = result[fen][sanMove];
              } else {
                merged[fen][sanMove].games += result[fen][sanMove].games;
                merged[fen][sanMove].points += result[fen][sanMove].points;
                merged[fen][sanMove].last = max(
                  merged[fen][sanMove].last,
                  result[fen][sanMove].last
                );
                merged[fen].indexes.push(...result[fen].indexes);
              }
            }
          }
        }
        return merged;
      }, {});
      return fens;
    });
  },
  process_move(chess, move, points, year, index) {
    return new Promise((resolve) => {
      const sanMove = move.trim();
      const fen = chess.fen();
      const result = {};

      result[fen] = {};
      result[fen][sanMove] = { games: 1, last: year, points };
      result[fen].indexes = [index];

      chess.move(sanMove);
      chess = new Chess(chess.fen());

      resolve(result);
    });
  },
  merge_fens_results(results) {
    const mergedFens = {};
    for (const fens of results) {
      for (const fen in fens) {
        if (!mergedFens[fen]) {
          mergedFens[fen] = fens[fen];
        } else {
          for (const sanMove in fens[fen]) {
            if (!mergedFens[fen][sanMove]) {
              mergedFens[fen][sanMove] = fens[fen][sanMove];
            } else {
              mergedFens[fen][sanMove].games += fens[fen][sanMove].games;
              mergedFens[fen][sanMove].points += fens[fen][sanMove].points;
              mergedFens[fen].indexes.push(...fens[fen].indexes);
              mergedFens[fen].indexes = Array.from(
                new Set(mergedFens[fen].indexes)
              );
            }
          }
        }
      }
    }
    return mergedFens;
  },
  search_fen(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    board
  ) {
    if (fen.trim() == "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    let table = document.getElementById("stats");
    table.innerHTML = "";
    let headers = document.createElement("tr");
    let move_header = document.createElement("th");
    move_header.innerText = "ruch";
    let count_header = document.createElement("th");
    count_header.innerText = "liczba gier";
    let percent_header = document.createElement("th");
    percent_header.innerText = "%";
    let last_header = document.createElement("th");
    last_header.innerText = "najnowsze";
    headers.appendChild(move_header);
    headers.appendChild(count_header);
    headers.appendChild(percent_header);
    headers.appendChild(last_header);
    table.appendChild(headers);
    let table2 = document.getElementById("games");
    table2.innerHTML = "";
    let headers2 = document.createElement("tr");
    let white_header = document.createElement("th");
    white_header.innerText = "białe";
    let black_header = document.createElement("th");
    black_header.innerText = "czarne";
    let result_header = document.createElement("th");
    result_header.innerText = "wynik";
    let year_ehader = document.createElement("th");
    year_ehader.innerText = "rok";
    headers2.append(white_header);
    headers2.append(result_header);
    headers2.append(black_header);
    headers2.append(year_ehader);
    table2.append(headers2);
    fen = fen.trim();
    if (fen == "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    let fens = this.fens_obj[fen];
    let played = [];
    try {
      for (const game of this.games) {
        if (fens.indexes.includes(game.id)) {
          played.push(game);
          if (played.length >= 100) {
            break;
          }
        }
      }
    } catch (err) {
      return;
    }
    let moves_stats = [];
    try {
      for (const key of Object.keys(fens)) {
        if (key != "indexes") {
          let move = fens[key];
          move.move = key;
          moves_stats.push(move);
        }
      }
    } catch {}
    moves_stats.sort((a, b) => {
      return b.games - a.games;
    });
    for (const stat of moves_stats) {
      let tr = document.createElement("tr");
      tr.onclick = function () {
        TREE.move_san(stat.move, board);
      };
      let move_cell = document.createElement("td");
      move_cell.innerText = stat.move;
      let count_cell = document.createElement("td");
      count_cell.innerText = stat.games;
      let percent_cell = document.createElement("td");
      percent_cell.innerText = Math.round((stat.points / stat.games) * 100, 2);
      let last_cell = document.createElement("td");
      last_cell.innerText = stat.last;
      tr.appendChild(move_cell);
      tr.appendChild(count_cell);
      tr.appendChild(percent_cell);
      tr.appendChild(last_cell);
      table.append(tr);
    }

    if (played.length > 0) {
      for (let i = 0; i < played.length; i++) {
        const game = played[i];
        let tr = document.createElement("tr");

        tr.onclick = () => {
          let ids = played.map(function (value) {
            return value.id;
          });
          let form = document.createElement("form");
          form.style.visibility = "hidden";
          form.method = "POST";
          form.action = `${SETTINGS.NOMENU_URLS.game}?id=${ids[i]}&base=all`;
          let inputList = document.createElement("input");
          inputList.value = ids;
          inputList.name = "list";
          let inputCurrent = document.createElement("input");
          inputCurrent.value = i;
          let inputBase = document.createElement("input");
          inputBase.name = "base";
          inputBase.value = "all";
          inputCurrent.name = "current";
          form.appendChild(inputList);
          form.appendChild(inputCurrent);
          form.appendChild(inputBase);
          document.body.append(form);
          form.submit();
        };

        let white_cell = document.createElement("td");
        white_cell.innerText = game.White;
        let black_cell = document.createElement("td");
        black_cell.innerText = game.Black;
        let result_cell = document.createElement("td");
        result_cell.innerText = game.Result;
        let year_cell = document.createElement("td");
        year_cell.innerText = game.Year;
        tr.append(white_cell);
        tr.append(result_cell);
        tr.append(black_cell);
        tr.append(year_cell);
        table2.append(tr);
      }
    }
  },
  move_san(san, board) {
    const moves = board.base.chess.moves({ verbose: true });
    for (const move of moves) {
      if (move.san == san) {
        board.base.manualMove(move);
      }
    }
  },
};

export default TREE;
