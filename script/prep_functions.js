var fens_obj = {};
var games;

async function searchGames(
  white,
  black,
  ignore,
  minYear,
  maxYear,
  events,
  minEco,
  maxEco,
  base,
  searching
) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/search_game.php", true);

  white = replaceNationalCharacters(white);
  black = replaceNationalCharacters(black);
  events = replaceNationalCharacters(events);

  const message = `white=${encodeURIComponent(
    white
  )}&black=${encodeURIComponent(black)}&ignore=${encodeURIComponent(
    ignore
  )}&minYear=${encodeURIComponent(minYear)}&maxYear=${encodeURIComponent(
    maxYear
  )}&event=${encodeURIComponent(events)}&minEco=${encodeURIComponent(
    minEco
  )}&maxEco=${encodeURIComponent(maxEco)}&base=${encodeURIComponent(
    base
  )}&searching=${encodeURIComponent(searching)}`;

  xhttp2.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const json = JSON.parse(this.responseText);
        games = json.rows;
        const promises = json.rows.map((row) => getFens(row));
        Promise.all(promises)
          .then((results) => {
            const mergedFens = mergeFensResults(results);
            fens_obj = mergedFens;
            searchFen(document.getElementById("boardFen").value);
          })
          .catch((error) => {});
      } catch (err) {}
    }
  };

  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(message);

  xhttp2.onloadend = function () {
    document.getElementById("loading").remove();
  };
}

async function loadGames(request) {
  const { minEco = "", maxEco = "", color, name } = request;

  const searchWhite = color === "white";
  const searchBlack = color !== "white";

  await searchGames(
    searchWhite ? name : "",
    searchBlack ? name : "",
    false,
    "",
    "",
    "",
    minEco,
    maxEco,
    "all",
    "fulltext"
  );
}

function getFens(row) {
  const pgn = row.moves;
  const moves = pgn
    .replace(/1-0|0-1|1\/2-1\/2|\*/, "")
    .split(/\d+\.| /)
    .filter(Boolean);
  const result = row.Result;
  const points = result === "1-0" ? 1 : result === "0-1" ? 0 : 0.5;

  let chess = new Chess();
  const promises = moves.map((move) =>
    processMove(chess, move, points, row.Year, row.id)
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
}

function processMove(chess, move, points, year, index) {
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
}

function replaceNationalCharacters(text) {
  if (text != null) {
    let toReplace = text;
    toReplace = toReplace.replace(/ą/g, "a");
    toReplace = toReplace.replace(/Ą/g, "A");
    toReplace = toReplace.replace(/ć/g, "c");
    toReplace = toReplace.replace(/Ć/g, "C");
    toReplace = toReplace.replace(/ę/g, "e");
    toReplace = toReplace.replace(/Ę/g, "E");
    toReplace = toReplace.replace(/ł/g, "l");
    toReplace = toReplace.replace(/Ł/g, "L");
    toReplace = toReplace.replace(/ń/g, "n");
    toReplace = toReplace.replace(/Ń/g, "n");
    toReplace = toReplace.replace(/ó/g, "o");
    toReplace = toReplace.replace(/Ó/g, "o");
    toReplace = toReplace.replace(/ś/g, "s");
    toReplace = toReplace.replace(/Ś/g, "s");
    toReplace = toReplace.replace(/ź/g, "z");
    toReplace = toReplace.replace(/Ź/g, "Z");
    toReplace = toReplace.replace(/ż/g, "z");
    toReplace = toReplace.replace(/Ż/g, "Z");
    return toReplace;
  }
}

function mergeFensResults(results) {
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
}

function searchFen(
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
) {
  let table = document.getElementById("stats");
  table.innerHTML = "";
  let headers = document.createElement("tr");
  let header1 = document.createElement("th");
  header1.innerText = "ruch";
  let header2 = document.createElement("th");
  header2.innerText = "liczba gier";
  let header3 = document.createElement("th");
  header3.innerText = "%";
  let header4 = document.createElement("th");
  header4.innerText = "najnowsze";
  headers.appendChild(header1);
  headers.appendChild(header2);
  headers.appendChild(header3);
  headers.appendChild(header4);
  table.appendChild(headers);
  let table2 = document.getElementById("games");
  table2.innerHTML = "";
  let headers2 = document.createElement("tr");
  let header5 = document.createElement("th");
  header5.innerText = "białe";
  let header6 = document.createElement("th");
  header6.innerText = "czarne";
  let header7 = document.createElement("th");
  header7.innerText = "wynik";
  let header8 = document.createElement("th");
  header8.innerText = "rok";
  headers2.append(header5);
  headers2.append(header6);
  headers2.append(header7);
  headers2.append(header8);
  table2.append(headers2);
  fen = fen.trim();
  if (fen == "") {
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  }
  let fens = fens_obj[fen];
  let played = [];
  try {
    for (const game of games) {
      if (fens.indexes.includes(game.id)) {
        played.push(game);
        if (played.length >= 100) {
          break;
        }
      }
    }
  } catch {
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
      moveSan(stat.move);
    };
    let td1 = document.createElement("td");
    td1.innerText = stat.move;
    let td2 = document.createElement("td");
    td2.innerText = stat.games;
    let td3 = document.createElement("td");
    td3.innerText = Math.round((stat.points / stat.games) * 100, 2);
    let td4 = document.createElement("td");
    td4.innerText = stat.last;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
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
        form.action = `/game/index.php?id=${ids[i]}&base=all`;
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

      let td1 = document.createElement("td");
      td1.innerText = game.White;
      let td2 = document.createElement("td");
      td2.innerText = game.Black;
      let td3 = document.createElement("td");
      td3.innerText = game.Result;
      let td4 = document.createElement("td");
      td4.innerText = game.Year;
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      table2.append(tr);
    }
  }
}

function moveSan(san) {
  const moves = board.base.chess.moves({ verbose: true });
  for (const move of moves) {
    if (move.san == san) {
      board.base.manualMove(move);
    }
  }
}
