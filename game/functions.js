function checkMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function search(id, table, list, current) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/game/get.php", true);

  let messenge =
    "id=" + encodeURIComponent(id) + "&table=" + encodeURIComponent(table);
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(this.responseText);
      if (list.length > 1) {
        switch (current) {
          case 0:
            next.onclick = () => {
              let form = document.createElement("form");
              form.style.visibility = "hidden";
              form.method = "POST";
              form.action = "/game/index.php";
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

async function viewGame(data) {
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
  info.append(players);
  info.append(siteDate);
  info.append(Event);
  info.append(result);
  pre.prepend(info);
  let pgnView = PGNV.pgnView;
  if (window.screen.availWidth >= 768 && window.innerWidth >= 768) {
    pgnView("board", {
      pgn: data.moves,
      pieceStyle: "chessicons",
      layout: "left",
      coordsInner: false,
      resizable: true,
      figurine: true,
      coordsFactor: 1.25,
      // colorMarker: "cm-big",
    });
  } else {
    pgnView("board", {
      pgn: data.moves,
      pieceStyle: "chessicons",
      coordsInner: false,
      resizable: true,
      figurine: true,
      coordsFactor: 1.25,
    });
  }

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
  let style = document.createElement("style");
  style.innerText = "#board{width: fit-content!important}";

  document.body.append(style);
  document.getElementById("board").style.width = "fit-content";
}

function replaceNationalCharacters(text) {
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
  toReplace = toReplace.replace(/o/g, "o");
  toReplace = toReplace.replace(/O/g, "o");
  toReplace = toReplace.replace(/ś/g, "s");
  toReplace = toReplace.replace(/Ś/g, "s");
  toReplace = toReplace.replace(/ź/g, "z");
  toReplace = toReplace.replace(/Ź/g, "Z");
  toReplace = toReplace.replace(/ż/g, "z");
  toReplace = toReplace.replace(/Ż/g, "Z");
  return toReplace;
}
