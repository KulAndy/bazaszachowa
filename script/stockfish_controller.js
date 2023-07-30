import { Chess } from "./chess.js";

const MIN_DEPTH = 1;
const MAX_DEPTH = 15;

const STOCKFISH_CONTROLLER = {
  MIN_DEPTH,
  MAX_DEPTH,
  stockfish: new Worker("/script/stockfish.js"),
  variants: {},
  currentFEN: "",
  depth: MIN_DEPTH,
  analyze_board(fen_id = "boardFen", best_move = "bestmove") {
    let input = document.getElementById(fen_id);
    const FEN =
      input.value == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : input.value;

    this.analyze_fen(FEN, best_move);
  },
  analyze_fen(fen, best_move = "bestmove") {
    if (fen != this.currentFEN) {
      this.variants = {};
      this.currentFEN = fen;
      this.stockfish.postMessage("stop");
      this.depth = MIN_DEPTH;
      document.getElementById(best_move).innerText = "";
    }

    if (this.depth < MAX_DEPTH) {
      this.stockfish.postMessage("uci");
      this.stockfish.postMessage("setoption name Threads value 4");
      this.stockfish.postMessage("setoption name MultiPV value 4");
      this.stockfish.postMessage("setoption name Hash value 1024");
      this.stockfish.postMessage("position fen " + fen);
      this.stockfish.postMessage("go depth " + this.depth++);
    }
  },
  best_moves() {
    const sortedEntries = Object.entries(this.variants).sort(
      ([key1, value1], [key2, value2]) => {
        if (value1.type === "mate" && value2.type !== "mate") {
          return -1;
        } else if (value1.type !== "mate" && value2.type === "mate") {
          return 1;
        } else {
          return value2.value - value1.value;
        }
      }
    );

    const sortedUCIMoves = sortedEntries.map(([key]) => key);
    return sortedUCIMoves;
  },
  get_value(move) {
    try {
      let evalType = this.variants[move].type;
      let evalValue = parseInt(this.variants[move].value);
      let value = "";

      if (evalType == "cp") {
        value =
          (evalValue / 100) * (this.currentFEN.split(" ")[1] == "b" ? -1 : 1);
      } else {
        if (
          (evalValue < 0 && this.currentFEN.split(" ")[1] == "w") ||
          (evalValue > 0 && this.currentFEN.split(" ")[1] == "b")
        ) {
          value = "-";
        } else {
          value = "";
        }
        value += "#" + Math.abs(evalValue);
      }

      return value;
    } catch (error) {
      return "";
    }
  },
  get_san_from_uci(uci_moves, fen) {
    fen =
      fen == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : fen;

    let fen_data = fen.split(" ");
    var board = new Chess(fen);

    var uciMoveArray = uci_moves.split(" ");

    var san_moves = [];
    if (fen_data[1] == "b") {
      san_moves.push("...");
    }

    for (var j = 0; j < uciMoveArray.length; j++) {
      var uci_move = uciMoveArray[j];
      let moves = board.moves({ verbose: true });

      for (var i = 0; i < moves.length; i++) {
        if (uci_move === moves[i].from + moves[i].to) {
          board.move(moves[i]);
          san_moves.push(moves[i].san);
          break;
        }
      }
    }

    let move_number = parseInt(fen_data[fen_data.length - 1]);
    let notation = "";
    for (let i = 0; i < san_moves.length; i++) {
      if (i % 2 == 0) {
        notation += move_number++ + ". ";
      }
      notation += san_moves[i] + " ";
    }
    return notation;
  },
};

STOCKFISH_CONTROLLER.stockfish.onmessage = function (event) {
  var message = event.data;

  if (message.startsWith("info depth")) {
    var match = message.match(/score (cp|mate) ([-\d]+) .*$/);

    var depth_v = message.split(" ")[2];

    if (depth_v == 0) {
      document.getElementById("depth").innerText = "-";
      document.getElementById("eval").innerText = "-";
      let first = document.getElementById("first_v");
      let second = document.getElementById("second_v");
      let third = document.getElementById("third_v");
      first.innerText = "";
      second.innerText = "";
      third.innerText = "";
    } else {
      document.getElementById("depth").innerText = STOCKFISH_CONTROLLER.depth;
      if (match) {
        var evaluationType = match[1];
        var evaluationValue = parseInt(match[2]);
      }
      let info_arr = message.split(" pv ");
      if (info_arr.length == 2) {
        STOCKFISH_CONTROLLER.variants[info_arr[1].split(" ")[0]] = {
          value: evaluationValue,
          type: evaluationType,
          variant: info_arr[1],
        };
      }
    }
  } else if (message.startsWith("bestmove")) {
    STOCKFISH_CONTROLLER.analyze_fen(
      document.getElementById("boardFen").value == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : document.getElementById("boardFen").value
    );
    message = message.replace(/bestmove |ponder |\(none\) /g, "");
    let best = message.trim().split(" ")[0];
    if (best != "(none)") {
      document.getElementById("bestmove").innerText =
        STOCKFISH_CONTROLLER.get_san_from_uci(
          best,
          document.getElementById("boardFen").value
        );
    }

    let best_moves_list = STOCKFISH_CONTROLLER.best_moves();
    best_moves_list = best_moves_list.filter(
      (elem) => elem != best && elem != "ponder" && elem != "(none)"
    );

    document.getElementById("eval").innerText =
      STOCKFISH_CONTROLLER.get_value(best);
    let first = document.getElementById("first_v");
    let second = document.getElementById("second_v");
    let third = document.getElementById("third_v");
    first.innerText = "";
    second.innerText = "";
    third.innerText = "";
    try {
      first.innerHTML =
        "<span class='bold'>" +
        STOCKFISH_CONTROLLER.get_value(best) +
        "</span>" +
        " " +
        STOCKFISH_CONTROLLER.get_san_from_uci(
          STOCKFISH_CONTROLLER.variants[best].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
    try {
      second.innerHTML =
        "<span class='bold'>" +
        STOCKFISH_CONTROLLER.get_value(best_moves_list[0]) +
        "</span>" +
        " " +
        STOCKFISH_CONTROLLER.get_san_from_uci(
          STOCKFISH_CONTROLLER.variants[best_moves_list[0]].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
    try {
      third.innerHTML =
        "<span class='bold'>" +
        STOCKFISH_CONTROLLER.get_value(best_moves_list[1]) +
        "</span>" +
        " " +
        STOCKFISH_CONTROLLER.get_san_from_uci(
          STOCKFISH_CONTROLLER.variants[best_moves_list[1]].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
  }
};

export default STOCKFISH_CONTROLLER;
