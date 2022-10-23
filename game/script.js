"use strict";
var gameMoves;
var mode;
window.onload = async () => {
  let url_string = window.location.href;
  let url = new URL(url_string);
  while (!request) {
    window.setTimeout(function () {}, 1000);
  }
  let id = request.id;
  let table = request.table;
  let query = request.query;
  const regex =
    /[^\W](insert|update|delete|create|alter|index|drop (table|database|view)|truncate|trigger|lock|references)[\W$]/i;
  if (regex.test(query)) {
    let dialog = document.getElementById("dialog");
    dialog.innerText =
      "Błąd bezpieczeństwa - wykryto potencjalnie niebezpieczne zapytanie do bazy danych";
    dialog.open = true;
  } else {
    let param;
    try {
      param = JSON.parse(request.param);
    } catch {
      param = [];
    }
    await execQuery(query, param, table, id);
  }
};

async function search(id, table) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/game/get.php", true);

  let messenge =
    "id=" + encodeURIComponent(id) + "&table=" + encodeURIComponent(table);

  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(this.responseText);
      viewGame(json.rows[0]);
    }
  };
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
}

async function checkReise() {
  if (window.screen.availWidth <= 390) {
    let board = document.getElementById("board");
    board.style.width = window.screen.availWidth * 0.9 + "px";
    board.style.margin = "auto!important";
    let notation = document.getElementById("boardMoves");
    notation.style.width = window.screen.availWidth * 0.9 + "px";
    notation.style.margin = "auto!important";
    let outerBoard = document.getElementsByClassName("outerBoard")[0];
    outerBoard.style.width = window.screen.availWidth * 0.9 + "px";
    outerBoard.style.margin = "auto!important";
    let boardButton = document.getElementById("boardButton");
    let innerBoard = document.getElementById("boardInner");
    innerBoard.style.width = window.screen.availWidth * 0.9 + "px";
    notation.style.position = "";
    notation.style.right = "";
    outerBoard.style.position = "";
    outerBoard.style.left = "";
    boardButton.style.position = "";
    boardButton.style.left = "";
    document.body.style.overflowY = "";
    boardButton.style.position = "";
    boardButton.style.top = "";
    boardButton.style.left = "";
  }
}

function checkMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function viewGame(data) {
  let pre = document.getElementById("pre");
  let info = document.createElement("div");
  info.id = "info";
  let players = document.createElement("p");
  players.style.textAlign = "center";
  let playersData = "<b>" + data.White + "</b>";
  if (data.WhiteElo != null) {
    playersData += " " + data.WhiteElo;
  }
  playersData += " - " + "<b>" + data.Black + "</b>";
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

  let buttonP = document.createElement("p");
  buttonP.style.textAlign = "center";
  buttonP.style.marginTop = "5px";
  buttonP.style.marginBottom = "15px";
  buttonP.id = "buttonP";

  let button = document.createElement("button");
  button.id = "download";
  button.innerText = "Pobierz";
  button.title = "Ctrl + S";

  button.onclick = () => {
    let game = "";
    game += '[Event "' + data.Event + '"]\n';
    game += '[Site "' + data.Site + '"]\n';
    game += '[Date "' + data.Year + ".";
    if (data.Month == null) {
      game += "?.";
    } else {
      game += data.Month;
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

    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(
      new Blob([game], { type: "text/plain" })
    );
    a.download = "game.pgn";
    a.click();
  };
  buttonP.append(button);

  pre.prepend(buttonP);
  //   pre.prepend(result);
  //   pre.prepend(siteDate);
  //   pre.prepend(players);
  info.append(players);
  info.append(siteDate);
  info.append(result);
  pre.prepend(info);
  let pgnView = PGNV.pgnView;
  pgnView("board", { pgn: data.moves, pieceStyle: "chessicons" });

  if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
    mode = "desktop";
    let notation = document.getElementById("boardMoves");
    let td2 = document.getElementById("td2");
    td2.append(notation);
    let td3 = document.getElementById("td3");
    let boardButton = document.getElementById("boardButton");
    td3.style.width = boardButton.clientWidth;
    let boardDiv = document.getElementById("board");
    boardDiv.style.height = boardButton.clientHeight + "px";
    boardDiv.style.width = boardButton.clientWidth + "px";
    let td1 = document.getElementById("td1");
    let board = document.getElementsByClassName("outerBoard")[0];
    td1.append(board);
    notation.style.height =
      board.clientHeight - boardDiv.clientHeight - 5 + "px";
    notation.style.width = "fit-content";
    notation.style.overflowX = "auto";
    board.style.height = board.clientWidth + "px";
    let moves = document.getElementsByTagName("move");
    for (let i = 1; i < moves.length; i = i + 2) {
      let move = moves[i];
      let br = document.createElement("br");
      move.after(br);
    }
  } else {
    mode = "mobile";
  }

  window.addEventListener("resize", function () {
    let newMode;
    if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
      newMode = "desktop";
    } else {
      newMode = "mobile";
    }
    if (mode != newMode) {
      let td1 = document.getElementById("td1");
      let td2 = document.getElementById("td2");
      td1.innerHTML = "";
      td2.innerHTML = "";
      let board = document.getElementById("board");
      board.innerHTML = "";
      board.style.width = "";
      mode = newMode;
      pgnView("board", { pgn: data.moves, pieceStyle: "chessicons" });
      if (newMode == "desktop") {
        let notation = document.getElementById("boardMoves");
        td2.append(notation);
        let td3 = document.getElementById("td3");
        let boardButton = document.getElementById("boardButton");
        td3.style.width = boardButton.clientWidth;
        let boardDiv = document.getElementById("board");
        boardDiv.style.height = boardButton.clientHeight + "px";
        boardDiv.style.width = boardButton.clientWidth + "px";
        let board = document.getElementsByClassName("outerBoard")[0];
        td1.append(board);
        notation.style.height =
          board.clientHeight - boardDiv.clientHeight - 5 + "px";
        notation.style.width = "fit-content";
        notation.style.overflowX = "auto";
        board.style.height = board.clientWidth + "px";
        let moves = document.getElementsByTagName("move");
        for (let i = 1; i < moves.length; i = i + 2) {
          let move = moves[i];
          let br = document.createElement("br");
          move.after(br);
        }
      }
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
  });

  let buttons = document.getElementById("boardButton");
  buttons.tabIndex = -1;
  buttons.focus();
}

function goToGame(id, table, query, param) {
  let idInput = document.getElementById("idInput");
  idInput.value = id;
  let tableInput = document.getElementById("tableInput");
  tableInput.value = table;
  let queryInput = document.getElementById("queryInput");
  queryInput.value = query;
  let paramInput = document.getElementById("paramInput");
  paramInput.value = JSON.stringify(param);
  let form = document.getElementById("form");
  form.submit();
}

async function execQuery(query, param, table, id) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/game/exec.php", true);
  let messenge =
    "query=" +
    encodeURIComponent(query) +
    "&param" +
    encodeURIComponent(JSON.stringify(param)) +
    "&table=" +
    table;

  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        let previous = document.getElementById("previous");
        let first = document.getElementById("first");
        let next = document.getElementById("next");
        let last = document.getElementById("last");
        if (json.length > 1) {
          for (let index = 0; index < json.length; index++) {
            if (json[index] == id) {
              let firstGame;
              let previousGame;
              let nextGame;
              let lastGame;

              switch (index) {
                case 0:
                  nextGame = json[index + 1];
                  lastGame = json[json.length - 1];
                  next.onclick = () => {
                    goToGame(nextGame, table, query, param);
                  };
                  last.onclick = () => {
                    goToGame(lastGame, table, query, param);
                  };
                  next.disabled = false;
                  last.disabled = false;
                  break;
                case json.length - 1:
                  firstGame = json[0];
                  previousGame = json[index - 1];
                  first.onclick = () => {
                    goToGame(firstGame, table, query, param);
                  };
                  previous.onclick = () => {
                    goToGame(previousGame, table, query, param);
                  };
                  first.disabled = false;
                  previous.disabled = false;

                  break;

                default:
                  if (json.length > 1) {
                    firstGame = json[0];
                    previousGame = json[index - 1];
                    nextGame = json[index + 1];
                    lastGame = json[json.length - 1];
                    first.onclick = () => {
                      goToGame(firstGame, table, query, param);
                    };
                    previous.onclick = () => {
                      goToGame(previousGame, table, query, param);
                    };
                    next.onclick = () => {
                      goToGame(nextGame, table, query, param);
                    };
                    last.onclick = () => {
                      goToGame(lastGame, table, query, param);
                    };
                    next.disabled = false;
                    last.disabled = false;
                    first.disabled = false;
                    previous.disabled = false;
                  }
                  break;
              }
            }
          }
        }
      } catch (error) {
      } finally {
        search(id, table);
      }
    }
  };
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);
}
