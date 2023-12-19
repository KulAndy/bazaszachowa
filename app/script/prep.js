import SEARCH from "./search_functions.js";
import ChessProcessor from "./tree_functions.js";
import DISPLAY from "./display_functions.js";

const REQUEST_GET = get_data();

window.onload = async () => {
  var board = PGNV.pgnEdit("board", {
    theme: "zeit",
    resizable: false,
    figurine: true,
    showCoords: false,
    orientation: REQUEST_GET.color == "white" ? "black" : "white",
  });

  let result;
  console.time();
  if (REQUEST_GET.color == "white") {
    result = await SEARCH.games(REQUEST_GET.name, "", false);
  } else {
    result = await SEARCH.games("", REQUEST_GET.name, false);
  }
  console.timeLog();
  const processor = new ChessProcessor();
  console.timeLog();
  await processor.getTree(result.rows);
  console.timeEnd();

  window.addEventListener("mouseup", function () {
    window.setTimeout(function () {
      const fens = processor.searchFEN(
        document.getElementById("boardFen").value
      );
      DISPLAY.tree(fens, processor.games, "stats", "games", board);
    }, 100);
  });

  window.addEventListener("keydown", function () {
    window.setTimeout(function () {
      const fens = processor.searchFEN(
        document.getElementById("boardFen").value
      );
      DISPLAY.tree(fens, processor.games, "stats", "games", board);
    }, 100);
  });

  document.getElementById("games").addEventListener("wheel", function (e) {
    e.stopPropagation();
  });

  document.getElementById("stats").addEventListener("wheel", function (e) {
    e.stopPropagation();
  });

  document.getElementById("boardMoves").addEventListener("wheel", function (e) {
    e.stopPropagation();
  });

  window.addEventListener("keydown", function (e) {
    switch (e.which) {
      case 37:
        document.getElementById("boardButtonprev").click();
        break;
      case 39:
        document.getElementById("boardButtonnext").click();
        break;
      case 38:
        document.getElementById("boardButtonfirst").click();
        break;
      case 40:
        document.getElementById("boardButtonlast").click();
        break;
    }
  });

  document.getElementById("download").addEventListener("click", function () {
    const obj_moves = board.base.getPgn().moves;
    let pgn = `[Event "*"]
      [Site "*"]
      [Date "*"]
      [Round "*"]
      [White "*"]
      [Black "*"]
      [Result "*"]
      
      ${write_move(obj_moves, 0, false)}*`;

    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "preparation.pgn";
    link.click();

    URL.revokeObjectURL(url);
  });

  window.addEventListener("wheel", function (e) {
    if (e.deltaY > 1) {
      document.getElementById("boardButtonnext").click();
    } else {
      document.getElementById("boardButtonprev").click();
    }
    e.stopPropagation();
    window.setTimeout(function () {
      const fens = processor.searchFEN(
        document.getElementById("boardFen").value
      );
      DISPLAY.tree(fens, processor.games, "stats", "games", board);
    }, 100);
  });

  window.setInterval(function () {
    if (processor.currentFEN != document.getElementById("boardFen").value) {
      processor.currentFEN = document.getElementById("boardFen").value;
      const fens = processor.searchFEN(
        document.getElementById("boardFen").value
      );
      DISPLAY.tree(fens, processor.games, "stats", "games", board);
    }
  }, 500);

  function write_move(moves, index, variant, forked) {
    let notation = "";
    const move = moves[index];
    const moveNumber = move.moveNumber;
    if (variant) {
      notation += "(";
    }
    if (move.turn == "w") {
      notation += moveNumber + ". ";
    } else if (variant || forked) {
      notation += moveNumber + "... ";
    }
    notation += move.notation.notation + " ";
    let hasVariant = false;
    for (const variant of move.variations) {
      notation += write_move(moves, variant.index, true, true);
      hasVariant = true;
    }

    if (move.next) {
      notation += write_move(moves, move.next, false, hasVariant);
    }

    if (variant) {
      notation += ")";
    }

    return notation;
  }
};
