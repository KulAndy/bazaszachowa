import SETTINGS from "./settings.js";
import { Chess } from "./chess.js";
const cutStringToPenultimateSpace = (inputString) =>
  inputString.substring(
    0,
    inputString.lastIndexOf(" ", inputString.lastIndexOf(" ") - 1)
  );

class ChessProcessor {
  constructor() {
    this.chess = new Chess();
    this.currentFEN = "";
    this.fensObj = {};
    this.games = [];
    this.boardFenInput = document.getElementById("boardFen");
    this.loadingTree = document.getElementById("loading_tree");
    this.statsTable = document.getElementById("stats");
  }

  async getTree(rows) {
    this.games = rows;
    this.loadingTree.style.display = "block";

    this.fensObj = {};

    const promises = rows.map((row) => this.getFENs(row));

    try {
      await Promise.all(promises);
    } finally {
      this.loadingTree.style.display = "none";
    }
  }

  async getFENs(row) {
    const pgn = row.moves;

    const moves = pgn.match(
      /\b(?:[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8]|[NBRQK][a-h]?[1-8]?x?[a-h][1-8]|O-O-O|O-O|\+\+|#)\b/g
    );
    const result = row.Result;
    const points = result === "1-0" ? 1 : result === "0-1" ? 0 : 0.5;

    let chess = new Chess();
    const promises = moves.map((move) =>
      this.processMove(chess, move, points, row.Year, row.id)
    );

    await Promise.all(promises);
  }

  async processMove(chess, move, points, year, index) {
    return new Promise((resolve) => {
      const raw_fen = chess.fen();
      const fen = cutStringToPenultimateSpace(raw_fen);

      chess.move(move);

      if (this.fensObj[fen]) {
        this.fensObj[fen][move] = this.fensObj[fen][move] || {
          games: 0,
          last: 0,
          points: 0,
        };
        this.fensObj[fen][move].games++;
        this.fensObj[fen][move].last = Math.max(
          this.fensObj[fen][move].last,
          year
        );
        this.fensObj[fen][move].points += points;
        this.fensObj[fen].indexes.push(index);
      } else {
        this.fensObj[fen] = {};
        this.fensObj[fen][move] = { games: 1, last: year, points };
        this.fensObj[fen].indexes = [index];
      }

      resolve(true);
    });
  }

  searchFEN(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    board
  ) {
    if (fen.trim() === "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    fen = cutStringToPenultimateSpace(fen);

    const table = document.getElementById("stats");
    table.innerHTML = "";
    const headers = document.createElement("tr");
    const moveHeader = document.createElement("th");
    moveHeader.innerText = "ruch";
    const countHeader = document.createElement("th");
    countHeader.innerText = "liczba gier";
    const percentHeader = document.createElement("th");
    percentHeader.innerText = "%";
    const lastHeader = document.createElement("th");
    lastHeader.innerText = "najnowsze";
    headers.appendChild(moveHeader);
    headers.appendChild(countHeader);
    headers.appendChild(percentHeader);
    headers.appendChild(lastHeader);
    table.appendChild(headers);

    const table2 = document.getElementById("games");
    table2.innerHTML = "";
    const headers2 = document.createElement("tr");
    const whiteHeader = document.createElement("th");
    whiteHeader.innerText = "białe";
    const blackHeader = document.createElement("th");
    blackHeader.innerText = "czarne";
    const resultHeader = document.createElement("th");
    resultHeader.innerText = "wynik";
    const yearHeader = document.createElement("th");
    yearHeader.innerText = "rok";
    headers2.append(whiteHeader);
    headers2.append(resultHeader);
    headers2.append(blackHeader);
    headers2.append(yearHeader);
    table2.append(headers2);

    fen = fen.trim();
    if (fen === "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    const fens = this.fensObj[fen];
    const played = [];

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

    const movesStats = [];
    try {
      for (const key of Object.keys(fens)) {
        if (key !== "indexes") {
          const move = fens[key];
          move.move = key;
          movesStats.push(move);
        }
      }
    } catch {}

    movesStats.sort((a, b) => {
      return b.games - a.games;
    });

    for (const stat of movesStats) {
      const tr = document.createElement("tr");
      tr.onclick = () => {
        this.moveSan(stat.move, board);
      };
      const moveCell = document.createElement("td");
      moveCell.innerText = stat.move;
      const countCell = document.createElement("td");
      countCell.innerText = stat.games;
      const percentCell = document.createElement("td");
      percentCell.innerText = Math.round((stat.points / stat.games) * 100, 2);
      const lastCell = document.createElement("td");
      lastCell.innerText = stat.last;
      tr.appendChild(moveCell);
      tr.appendChild(countCell);
      tr.appendChild(percentCell);
      tr.appendChild(lastCell);
      table.append(tr);
    }

    if (played.length > 0) {
      for (let i = 0; i < played.length; i++) {
        const game = played[i];
        const tr = document.createElement("tr");

        tr.onclick = () => {
          const ids = played.map((value) => value.id);
          const form = document.createElement("form");
          form.style.visibility = "hidden";
          form.method = "POST";
          form.action = `${SETTINGS.NOMENU_URLS.game}?id=${ids[i]}&base=all`;
          const inputList = document.createElement("input");
          inputList.value = ids;
          inputList.name = "list";
          const inputCurrent = document.createElement("input");
          inputCurrent.value = i;
          const inputBase = document.createElement("input");
          inputBase.name = "base";
          inputBase.value = "all";
          inputCurrent.name = "current";
          form.appendChild(inputList);
          form.appendChild(inputCurrent);
          form.appendChild(inputBase);
          document.body.append(form);
          form.submit();
        };

        const whiteCell = document.createElement("td");
        whiteCell.innerText = game.White;
        const blackCell = document.createElement("td");
        blackCell.innerText = game.Black;
        const resultCell = document.createElement("td");
        resultCell.innerText = game.Result;
        const yearCell = document.createElement("td");
        yearCell.innerText = game.Year;
        tr.append(whiteCell);
        tr.append(resultCell);
        tr.append(blackCell);
        tr.append(yearCell);
        table2.append(tr);
      }
    }
  }

  moveSan(san, board) {
    const moves = board.base.chess.moves({ verbose: true });
    for (const move of moves) {
      if (move.san.replace(/\+|#/g, "") === san) {
        board.base.manualMove(move);
      }
    }
  }
}

export default ChessProcessor;
