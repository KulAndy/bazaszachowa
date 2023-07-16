const MIN_DEPTH = 1;
const MAX_DEPTH = 15;
var stockfish = new Worker("/script/stockfish.js");
var currentFEN = "";
var depth = MIN_DEPTH;
var variants = {};

stockfish.onmessage = function (event) {
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
      document.getElementById("depth").innerText = depth;
      if (match) {
        var evaluationType = match[1];
        var evaluationValue = parseInt(match[2]);
      }
      let info_arr = message.split(" pv ");
      if (info_arr.length == 2) {
        variants[info_arr[1].split(" ")[0]] = {
          value: evaluationValue,
          type: evaluationType,
          variant: info_arr[1],
        };
      }
    }
  } else if (message.startsWith("bestmove")) {
    game_searching.analyzeFEN(
      document.getElementById("boardFen").value == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : document.getElementById("boardFen").value
    );
    message = message.replace(/bestmove |ponder |\(none\) /g, "");
    let best = message.trim().split(" ")[0];
    if (best != "(none)") {
      document.getElementById("bestmove").innerText = getSanMoveFromUci(
        best,
        document.getElementById("boardFen").value
      );
    }

    let best_moves_list = best_moves();
    best_moves_list = best_moves_list.filter(
      (elem) => elem != best && elem != "ponder" && elem != "(none)"
    );

    document.getElementById("eval").innerText = get_value(best);
    let first = document.getElementById("first_v");
    let second = document.getElementById("second_v");
    let third = document.getElementById("third_v");
    first.innerText = "";
    second.innerText = "";
    third.innerText = "";
    try {
      first.innerHTML =
        "<span class='bold'>" +
        get_value(best) +
        "</span>" +
        " " +
        getSanMoveFromUci(
          variants[best].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
    try {
      second.innerHTML =
        "<span class='bold'>" +
        get_value(best_moves_list[0]) +
        "</span>" +
        " " +
        getSanMoveFromUci(
          variants[best_moves_list[0]].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
    try {
      third.innerHTML =
        "<span class='bold'>" +
        get_value(best_moves_list[1]) +
        "</span>" +
        " " +
        getSanMoveFromUci(
          variants[best_moves_list[1]].variant,
          document.getElementById("boardFen").value
        );
    } catch (error) {}
  }
};

function analyzeCurrent() {
  let input = document.getElementById("boardFen");
  const FEN =
    input.value == ""
      ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      : input.value;

  game_searching.analyzeFEN(FEN);
}

function best_moves() {
  const sortedEntries = Object.entries(variants).sort(
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
}

function get_value(move) {
  try {
    let evalType = variants[move].type;
    let evalValue = parseInt(variants[move].value);
    let value = "";

    if (evalType == "cp") {
      value = (evalValue / 100) * (currentFEN.split(" ")[1] == "b" ? -1 : 1);
    } else {
      if (
        (evalValue < 0 && currentFEN.split(" ")[1] == "w") ||
        (evalValue > 0 && currentFEN.split(" ")[1] == "b")
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
}

function getSanMoveFromUci(uciMoves, fen) {
  let fen_data = fen.split(" ");
  var board = new Chess(fen);

  var uciMoveArray = uciMoves.split(" ");

  var sanMoves = [];
  if (fen_data[1] == "b") {
    sanMoves.push("...");
  }

  for (var j = 0; j < uciMoveArray.length; j++) {
    var uciMove = uciMoveArray[j];
    let moves = board.moves({ verbose: true });

    for (var i = 0; i < moves.length; i++) {
      if (uciMove === moves[i].from + moves[i].to) {
        board.move(moves[i]);
        sanMoves.push(moves[i].san);
        break;
      }
    }
  }

  let moveNumber = parseInt(fen_data[fen_data.length - 1]);
  let notation = "";
  for (let i = 0; i < sanMoves.length; i++) {
    if (i % 2 == 0) {
      notation += moveNumber++ + ". ";
    }
    notation += sanMoves[i] + " ";
  }
  return notation;
}
