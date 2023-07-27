let params = new URLSearchParams(location.search);
let request = {
  name: params.get("name"),
  color: params.get("color"),
};

var current_fen = "";

loadGames(request);

var board = PGNV.pgnEdit("board", {
  theme: "zeit",
  resizable: false,
  figurine: true,
  showCoords: false,
  orientation: request.color == "white" ? "black" : "white",
});

window.addEventListener("wheel", function (e) {
  if (e.deltaY > 1) {
    document.getElementById("boardButtonnext").click();
  } else {
    document.getElementById("boardButtonprev").click();
  }
  e.stopPropagation();
  window.setTimeout(function () {
    searchFen(document.getElementById("boardFen").value);
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

window.addEventListener("mouseup", function () {
  window.setTimeout(function () {
    searchFen(document.getElementById("boardFen").value);
  }, 100);
});

window.addEventListener("keydown", function () {
  window.setTimeout(function () {
    searchFen(document.getElementById("boardFen").value);
  }, 100);
});

window.setInterval(function () {
  if (current_fen != document.getElementById("boardFen").value) {
    current_fen = document.getElementById("boardFen").value;
    searchFen(document.getElementById("boardFen").value);
  }
}, 500);

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

${writeMove(obj_moves, 0, false)}*`;

  const blob = new Blob([pgn], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "preparation.pgn";
  link.click();

  URL.revokeObjectURL(url);
});

function writeMove(moves, index, variant, forked) {
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
    notation += writeMove(moves, variant.index, true, true);
    hasVariant = true;
  }

  if (move.next) {
    notation += writeMove(moves, move.next, false, hasVariant);
  }

  if (variant) {
    notation += ")";
  }

  return notation;
}
