"use strict";

let game_searching = {
  async search(id, table, list, current) {
    const xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", "/API/get_game.php", true);

    let messenge =
      "id=" + encodeURIComponent(id) + "&base=" + encodeURIComponent(table);
    xhttp2.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          let json = JSON.parse(this.responseText);
          if (list.length > 1) {
            switch (current) {
              case 0:
                next.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = current + 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                last.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = list.length - 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                next.disabled = false;
                last.disabled = false;
                break;
              case list.length - 1:
                first.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = 0;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                previous.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = current - 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                first.disabled = false;
                previous.disabled = false;

                break;

              default:
                first.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = 0;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                previous.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = current - 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                next.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = current + 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                last.onclick = () => {
                  let form = document.createElement("form");
                  form.style.visibility = "hidden";
                  form.method = "POST";
                  form.action = "/game/index.php";
                  form.target = "_self";
                  let inputList = document.createElement("input");
                  inputList.value = list;
                  inputList.name = "list";
                  let inputCurrent = document.createElement("input");
                  inputCurrent.value = list.length - 1;
                  let inputBase = document.createElement("input");
                  inputBase.name = "base";
                  inputBase.value = table;
                  inputCurrent.name = "current";
                  form.appendChild(inputList);
                  form.appendChild(inputCurrent);
                  form.appendChild(inputBase);
                  document.body.append(form);
                  form.submit();
                };
                next.disabled = false;
                last.disabled = false;
                first.disabled = false;
                previous.disabled = false;
                break;
            }
          }

          game_searching.viewGame(json.rows[0]);
        } catch (error) {}
      }
    };
    xhttp2.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xhttp2.send(messenge);

    let loading = document.getElementById("dialog");
    loading.innerText = "Ładowanie ";
    loading.open = true;
    let counter = 0;
    const interval = setInterval(function () {
      loading.innerText = "Ładowanie ";
      for (let i = 0; i < (counter % 10) + 1; i++) {
        loading.innerText += ".";
      }
      counter++;
    }, 500);
    xhttp2.onloadend = function () {
      clearInterval(interval);
      document.getElementById("dialog").open = false;
    };
  },

  async viewGame(data) {
    let pre = document.getElementById("pre");
    let info = document.createElement("div");
    info.id = "info";
    let players = document.createElement("p");
    players.style.textAlign = "center";
    let playersData =
      `<a href='/player_data/?fullname=${encodeURIComponent(data.White)}'>` +
      data.White +
      "</a>";
    if (data.WhiteElo != null) {
      playersData += " " + data.WhiteElo;
    }
    playersData +=
      " - " +
      `<a href='/player_data/?fullname=${encodeURIComponent(data.Black)}'>` +
      data.Black +
      "</a>";
    if (data.BlackElo != null) {
      playersData += " " + data.BlackElo;
    }
    players.innerHTML = playersData;
    let siteDate = document.createElement("p");
    siteDate.style.textAlign = "center";
    let siteDateData = data.Year + ".";
    if (data.Month == null) {
      siteDateData += "?.";
    } else {
      siteDateData += data.Month + ".";
    }
    if (data.Day == null) {
      siteDateData += "?";
    } else {
      siteDateData += data.Day;
    }
    siteDateData += " , " + data.Site;
    siteDate.innerText = siteDateData;
    siteDate.style.marginTop = "5px";

    let result = document.createElement("p");
    result.innerText += data.Result;
    result.style.textAlign = "center";
    result.style.marginTop = "5px";

    let Event = document.createElement("p");
    Event.innerText += data.Event;
    Event.style.textAlign = "center";
    Event.style.marginTop = "5px";

    let buttonP = document.createElement("p");
    buttonP.style.textAlign = "center";
    buttonP.style.marginTop = "5px";
    buttonP.style.marginBottom = "15px";
    buttonP.id = "buttonP";

    let button = document.createElement("button");
    button.id = "download";
    button.innerText = "Pobierz";
    button.title = "Ctrl + S";

    let game = "";
    game += '[Event "' + data.Event + '"]\n';
    game += '[Site "' + data.Site + '"]\n';
    game += '[Date "' + data.Year + ".";
    if (data.Month == null) {
      game += "?.";
    } else {
      game += data.Month + ".";
    }
    if (data.Day == null) {
      game += '?"]\n';
    } else {
      game += data.Day + '"]\n';
    }
    game += '[Round "' + data.Round + '"]\n';
    game += '[White "' + data.White + '"]\n';
    game += '[Black "' + data.Black + '"]\n';
    game += '[Result "' + data.Result + '"]\n';
    if (data.ECO != null) {
      game += '[ECO "' + data.ECO + '"]\n';
    }
    if (data.WhiteElo != null) {
      game += '[WhiteElo "' + data.WhiteElo + '"]\n';
    }
    if (data.BlackElo != null) {
      game += '[BlackElo "' + data.BlackElo + '"]\n';
    }
    game += "\n" + data.moves + "\n\n";
    button.onclick = () => {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(
        new Blob([game], { type: "text/plain" })
      );
      a.download = "game.pgn";
      a.click();
    };
    buttonP.append(button);

    pre.prepend(buttonP);
    info.append(players);
    info.append(siteDate);
    info.append(Event);
    info.append(result);
    pre.prepend(info);
    let pgnView = PGNV.pgnEdit;
    if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
      pgnView("board", {
        pgn: data.moves,
        pieceStyle: "chessicons",
        layout: "left",
        resizable: true,
        figurine: true,
        showCoords: false,
        notationLayout: "list",
      });
    } else {
      pgnView("board", {
        pgn: data.moves,
        pieceStyle: "chessicons",
        resizable: true,
        figurine: true,
        showCoords: false,
      });
      document.getElementById("engine_container").classList.add("inactive");
    }

    let div = document.createElement("div");
    div.id = "tabs";
    let bt1 = document.createElement("button");
    bt1.innerText = "notacja";
    bt1.onclick = () => {
      let engine_container = document.getElementById("engine_container");
      let moves = document.getElementById("boardMoves");
      engine_container.classList.add("inactive");
      engine_container.classList.remove("active");
      moves.classList.add("active");
      moves.classList.remove("inactive");
    };
    let bt2 = document.createElement("button");
    bt2.innerText = "stockfish";
    bt2.onclick = () => {
      let engine_container = document.getElementById("engine_container");
      let moves = document.getElementById("boardMoves");
      engine_container.classList.add("active");
      engine_container.classList.remove("inactive");
      moves.classList.add("inactive");
      moves.classList.remove("active");
    };
    div.appendChild(bt1);
    div.appendChild(bt2);

    document
      .getElementById("board")
      .insertBefore(div, document.getElementById("boardMoves"));

    document
      .getElementById("board")
      .insertBefore(
        document.getElementById("engine_container"),
        document.getElementById("boardMoves")
      );

    let input = document.getElementById("boardFen");

    window.setInterval(() => {
      analyzeCurrent();
    }, 500);

    currentFEN =
      input.value == ""
        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        : input.value;

    this.analyzeFEN(currentFEN);

    for (let san of document.getElementsByTagName("san")) {
      san.addEventListener("click", function () {
        analyzeCurrent();
      });
    }

    for (let button of document.getElementsByClassName("pgnvbutton")) {
      button.addEventListener("click", function () {
        analyzeCurrent();
      });
    }

    window.addEventListener("resize", function () {
      if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
        document.getElementById("boardMoves").className = "moves list";
        document.getElementById("board").className =
          "blue pgnvjs viewMode layout-left";
      } else {
        document.getElementById("boardMoves").className = "moves inline";
        document.getElementById("board").className =
          "blue pgnvjs viewMode layout-top";
      }
    });

    window.addEventListener("wheel", function (e) {
      if (e.deltaY > 1) {
        document.getElementById("boardButtonprev").click();
      } else {
        document.getElementById("boardButtonnext").click();
      }
    });

    window.addEventListener("keydown", function (e) {
      if (e.ctrlKey) {
        switch (e.which) {
          case 70:
            document.getElementById("boardButtonflipper").click();
            break;
          case 82:
            this.location.reload();
            break;
          case 83:
            document.getElementById("download").click();
            break;
          case 37:
            document.getElementById("previous").click();
            break;
          case 39:
            document.getElementById("next").click();
            break;
          case 38:
            document.getElementById("first").click();
            break;
          case 40:
            document.getElementById("last").click();
            break;
        }
      } else {
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
      }
      switch (e.which) {
        case 37:
        case 39:
        case 38:
        case 40:
          analyzeCurrent();
      }
    });

    let buttons = document.getElementById("boardButton");
    buttons.tabIndex = -1;
    buttons.focus();
    let style = document.createElement("style");
    style.innerText = "#board{width: fit-content!important}";

    document.body.append(style);
    document.getElementById("board").style.width = "fit-content";
  },
  analyzeFEN(fen) {
    if (fen != currentFEN) {
      variants = {};
      currentFEN = fen;
      stockfish.postMessage("stop");
      depth = MIN_DEPTH;
      document.getElementById("bestmove").innerText = "";
    }

    if (depth < MAX_DEPTH) {
      stockfish.postMessage("uci");
      stockfish.postMessage("setoption name Threads value 4");
      stockfish.postMessage("setoption name MultiPV value 4");
      stockfish.postMessage("setoption name Hash value 1024");
      stockfish.postMessage("position fen " + fen);
      stockfish.postMessage("go depth " + depth++);
    }
  },
};
