"use strict";
var gameMoves;
var mode;
window.onload = async () => {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let id = url.searchParams.get("id");
  let table = url.searchParams.get("table");
  search(id, table);
};

function search(id, table) {
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

  let content = document.getElementById("content2");
  let loading = document.createElement("p");
  loading.id = "loading";
  loading.innerText = "Ładowanie ";
  content.append(loading);
  let counter = 0;
  const interval = setInterval(function () {
    loading.innerText = "Ładowanie ";
    for (let i = 0; i < (counter % 10) + 1; i++) {
      loading.innerText += ".";
    }
    counter++;
  }, 500);
  xhttp2.onloadend = function () {
    document.getElementById("loading").remove();
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

  pre.prepend(result);
  pre.prepend(siteDate);
  pre.prepend(players);
  let pgnView = PGNV.pgnView;
  pgnView("board", { pgn: data.moves, pieceStyle: "chessicons" });
  if (!checkMobile() && window.screen.availWidth >= 768 && window.innerWidth >= 768) {
    mode = "desktop";
    let notation = document.getElementById("boardMoves");
    let td2 = document.getElementById("td2");
    td2.append(notation);
    let td3 = document.getElementById("td3");
    let boardButton = document.getElementById("boardButton");
    td3.style.width = boardButton.clientWidth;
    let boardDiv = document.getElementById("board");
    boardDiv.style.height = boardButton.clientHeight;
    boardDiv.style.width = boardButton.clientWidth;
    let td1 = document.getElementById("td1");
    let board = document.getElementsByClassName("outerBoard")[0];
    td1.append(board);
    notation.style.height = board.clientHeight - boardDiv.clientHeight;
    board.style.height = board.clientWidth;
    let moves = document.getElementsByTagName("move");
    for (let i = 1; i < moves.length; i = i + 2) {
      let move = moves[i];
      let br = document.createElement("br");
      move.after(br);
    }
  }
  else{
    mode = "mobile"
  }

  window.addEventListener("resize", function () {
    console.log(window.screen.availWidth, window.innerWidth);
    if (!checkMobile()) {
      let newMode;
      if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
        newMode = "desktop";
      } else {
        newMode = "mobile";
      }
      if (mode != newMode) {
        let td1 = document.getElementById("td1")
        let td2 = document.getElementById("td2")
        td1.innerHTML = ''
        td2.innerHTML = ''
        let board = document.getElementById("board");
        board.innerHTML = "";
        board.style.width = ''
        mode = newMode;
        pgnView("board", { pgn: data.moves, pieceStyle: "chessicons" });
        if (newMode == "desktop") {
          let notation = document.getElementById("boardMoves");
          let td2 = document.getElementById("td2");
          td2.append(notation);
          let td3 = document.getElementById("td3");
          let boardButton = document.getElementById("boardButton");
          td3.style.width = boardButton.clientWidth;
          let boardDiv = document.getElementById("board");
          boardDiv.style.height = boardButton.clientHeight;
          boardDiv.style.width = boardButton.clientWidth;
          let td1 = document.getElementById("td1");
          let board = document.getElementsByClassName("outerBoard")[0];
          td1.append(board);
          notation.style.height = board.clientHeight - boardDiv.clientHeight;
          board.style.height = board.clientWidth;
          let moves = document.getElementsByTagName("move");
          for (let i = 1; i < moves.length; i = i + 2) {
            let move = moves[i];
            let br = document.createElement("br");
            move.after(br);
          }
        }
      }
    }
  });
}
