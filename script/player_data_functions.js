"use strict";

async function search(
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
  let messenge =
    "white=" +
    encodeURIComponent(white) +
    "&black=" +
    encodeURIComponent(black) +
    "&ignore=" +
    encodeURIComponent(ignore) +
    "&minYear=" +
    encodeURIComponent(minYear) +
    "&maxYear=" +
    encodeURIComponent(maxYear) +
    "&event=" +
    encodeURIComponent(events) +
    "&minEco=" +
    encodeURIComponent(minEco) +
    "&maxEco=" +
    encodeURIComponent(maxEco) +
    "&base=" +
    encodeURIComponent(base) +
    "&searching=" +
    encodeURIComponent(searching);

  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        displayData(
          json.rows,
          json.white,
          json.black,
          json.ignore,
          json.minYear,
          json.maxYear,
          json.event,
          json.minEco,
          json.maxEco,
          json.base,
          json.searching
        );
        return json.rows;
      } catch (err) {
        try {
          let rmTable = document.getElementById("table");
          rmTable.remove();
        } catch {}
        let table = document.createElement("table");
        table.id = "table";
        let caption = document.createElement("caption");
        caption.innerText = "Wystapił błąd";
        caption.style.width = "13em";
        table.append(caption);
        pre.append(table);
      }
    }
  };
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);

  try {
    let rmTable = document.getElementById("table");
    rmTable.remove();
  } catch {}
  let content = document.getElementById("content");
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
    clearInterval(interval);
    document.getElementById("loading").remove();
  };
}

function displayData(data, base) {
  try {
    let rmTable = document.getElementById("table");
    rmTable.remove();
  } catch {}

  let pre = document.getElementById("pre");
  let table = document.createElement("table");
  table.id = "table";
  let caption = document.createElement("caption");
  caption.innerText = "Znalezionych partii: " + data.length;
  if (data.length == 10000) {
    caption.innerText += " (limit)";
  }
  caption.innerText += " ";
  let save = document.createElement("button");
  save.innerText = "Pobierz";
  save.onclick = function () {
    download(data);
    save.style.color = "purple";
  };
  caption.append(save);
  table.append(caption);
  let colmns = document.createElement("tr");
  let th1 = document.createElement("th");
  th1.innerText = "Biały";
  let th2 = document.createElement("th");
  th2.innerText = "Elo białego";
  th2.classList.add("not_mobile");
  let th3 = document.createElement("th");
  th3.innerText = "Czarny";
  let th4 = document.createElement("th");
  th4.innerText = "Elo czarnego";
  th4.classList.add("not_mobile");
  let th5 = document.createElement("th");
  th5.style.width = "3.25em";
  th5.innerText = "Wynik";
  let th6 = document.createElement("th");
  th6.innerText = "Data";
  let th7 = document.createElement("th");
  th7.innerText = "Turniej";
  th7.classList.add("not_mobile");
  let th8 = document.createElement("th");
  th8.innerText = "ECO";
  th8.style.width = "2.5em";
  th8.classList.add("not_mobile");
  let th9 = document.createElement("th");
  th9.innerText = "Zobacz partię";
  let th10 = document.createElement("th");
  th10.innerText = "RAW";
  th10.classList.add("not_mobile");
  for (let i = 1; i <= 10; i++) {
    eval("colmns.append(th" + i + ")");
  }
  table.append(colmns);
  let ids = [];
  for (let i = 0; i < data.length; i++) {
    ids.push(data[i].id);
  }
  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement("tr");
    if (i % 2 == 0) {
      tr.style.backgroundColor = "LemonChiffon";
    } else {
      tr.style.backgroundColor = "LightCyan";
    }
    let td1 = document.createElement("td");
    td1.innerText = data[i].White;
    let td2 = document.createElement("td");
    td2.style.textAlign = "center";
    td2.innerText = data[i].WhiteElo;
    td2.classList.add("not_mobile");
    let td3 = document.createElement("td");
    td3.innerText = data[i].Black;
    let td4 = document.createElement("td");
    td4.style.textAlign = "center";
    td4.innerText = data[i].BlackElo;
    td4.classList.add("not_mobile");
    let td5 = document.createElement("td");
    td5.innerText = data[i].Result;
    let td6 = document.createElement("td");
    td6.innerText = data[i].Year + ".";
    if (data[i].Month == null) {
      td6.innerText += "?";
    } else {
      td6.innerText += data[i].Month;
    }
    td6.innerText += ".";
    if (data[i].Day == null) {
      td6.innerText += "?";
    } else {
      td6.innerText += data[i].Day;
    }
    let td7 = document.createElement("td");
    td7.innerText = data[i].Event;
    td7.classList.add("not_mobile");
    let td8 = document.createElement("td");
    td8.innerText = data[i].ECO;
    td8.classList.add("not_mobile");
    let td9 = document.createElement("td");
    td9.style.textAlign = "center";
    let viewButton = document.createElement("button");
    viewButton.innerText = "zobacz";
    viewButton.style.fontWeight = "bolder";
    viewButton.onclick = () => {
      let form = document.createElement("form");
      form.style.visibility = "hidden";
      form.method = "POST";
      form.action = "/game/index.php";
      let inputList = document.createElement("input");
      let ids = data.map(function (value) {
        return value.id;
      });
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
    td9.append(viewButton);
    let td10 = document.createElement("td");
    td10.innerHTML =
      "<button><a style='color: black;' href='/game_raw/?id=" +
      data[i].id +
      "&table=" +
      data[i].table +
      "'>zobacz</a></button>";
    td10.classList.add("not_mobile");
    for (let i = 1; i <= 10; i++) {
      eval("tr.append(td" + i + ")");
    }
    table.append(tr);
  }
  pre.append(table);
}

function download(data) {
  let games = "";
  for (let i = 0; i < data.length; i++) {
    games += '[Event "' + data[i].Event + '"]\n';
    games += '[Site "' + data[i].Site + '"]\n';
    games += '[Date "' + data[i].Year + ".";
    if (data[i].Month == null) {
      games += "?.";
    } else {
      games += data[i].Month;
    }
    if (data[i].Day == null) {
      games += '?"]\n';
    } else {
      games += data[i].Day + '"]\n';
    }
    games += '[Round "' + data[i].Round + '"]\n';
    games += '[White "' + data[i].White + '"]\n';
    games += '[Black "' + data[i].Black + '"]\n';
    games += '[Result "' + data[i].Result + '"]\n';
    if (data[i].ECO != null) {
      games += '[ECO "' + data[i].ECO + '"]\n';
    }
    if (data[i].WhiteElo != null) {
      games += '[WhiteElo "' + data[i].WhiteElo + '"]\n';
    }
    if (data[i].BlackElo != null) {
      games += '[BlackElo "' + data[i].BlackElo + '"]\n';
    }
    games += "\n" + data[i].moves + "\n\n";
  }
  let a = document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob([games], { type: "text/plain" })
  );
  a.download = "games.pgn";
  a.click();
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

async function loadGames(request) {
  let minEco = typeof request.minEco == "undefined" ? "" : request.minEco;
  let maxEco = typeof request.maxEco == "undefined" ? "" : request.maxEco;
  await search(
    request.fullname,
    "",
    true,
    "",
    "",
    "",
    minEco,
    maxEco,
    "all",
    "fulltext"
  );
}

function loadStats(request) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/player_opening_stats.php", true);
  let messenge = "name=" + encodeURIComponent(request.fullname) + "&base=all";
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        displayStats(json, request);
      } catch (err) {}
    }
  };

  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);

  let content = document.getElementById("stats");
  let loading = document.createElement("p");
  loading.id = "loadingStats";
  loading.innerText = "Ładowanie statystyk\n";
  content.append(loading);
  let counter = 0;
  const intervalStats = setInterval(function () {
    loading.innerText = "Ładowanie statystyk\n";
    for (let i = 0; i < (counter % 10) + 1; i++) {
      loading.innerText += ".";
    }
    counter++;
  }, 500);
  xhttp2.onloadend = function () {
    clearInterval(intervalStats);
    document.getElementById("loadingStats").remove();
  };
}

function displayStats(json, request) {
  let table = document.createElement("table");
  let sum = 0;
  if (json.whites.length > 0) {
    let whiteTableRow = document.createElement("tr");
    let whiteTableCell = document.createElement("td");
    whiteTableCell.colSpan = "4";
    whiteTableCell.style.padding = 0;
    let whiteDetails = document.createElement("details");
    whiteDetails.classList.add("details");
    if (window.outerWidth >= 768) {
      whiteDetails.open = true;
    }

    let whiteSummary = document.createElement("summary");
    let whiteTable = document.createElement("table");
    let tr1 = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.innerText = "debiut";
    let th2 = document.createElement("th");
    th2.innerText = "ilość";
    let th3 = document.createElement("th");
    th3.innerText = "%";
    let th4 = document.createElement("th");
    th4.innerText = "filtr";
    tr1.append(th1, th2, th3, th4);
    whiteTable.append(tr1);

    let whiteFilter = document.createElement("a");
    whiteFilter.target = "_self";
    whiteFilter.innerText = "filtruj";
    whiteFilter.href = `/player_data/?fullname=${encodeURIComponent(
      request.fullname
    )}&color=white&opening=`;

    whiteSummary.innerHTML = "<b>Białe</b>";
    whiteSummary.append(whiteFilter);
    whiteDetails.append(whiteTable);
    whiteDetails.append(whiteSummary);
    whiteTableCell.append(whiteDetails);
    whiteTableRow.append(whiteTableCell);
    table.append(whiteTableRow);

    for (let i = 0; i < json.whites.length; i++) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.innerText = json.whites[i][0];
      let td2 = document.createElement("td");
      td2.innerText = json.whites[i][1];
      let td3 = document.createElement("td");
      sum += json.whites[i][1];
      td3.innerText = json.whites[i][2];
      let td4 = document.createElement("td");
      let filter = document.createElement("a");
      filter.innerText = "filtruj";
      filter.target = "_self";
      filter.href = `/player_data/?fullname=${encodeURIComponent(
        request.fullname
      )}&color=white&opening=${encodeURIComponent(json.whites[i][0])}`;

      td4.append(filter);
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      whiteTable.append(tr);
    }
  }

  if (json.blacks.length > 0) {
    let blackFilter = document.createElement("a");
    blackFilter.innerText = "filtruj";
    blackFilter.href = `/player_data/?fullname=${encodeURIComponent(
      request.fullname
    )}&color=black&opening=`;
    blackFilter.target = "_self";

    let blackTableRow = document.createElement("tr");
    let blackTableCell = document.createElement("td");
    blackTableCell.colSpan = "4";
    blackTableCell.style.padding = 0;
    let blackDetails = document.createElement("details");
    blackDetails.classList.add("details");
    if (window.outerWidth >= 768) {
      blackDetails.open = true;
    }
    let blackSummary = document.createElement("summary");
    let blackTable = document.createElement("table");

    let tr2 = document.createElement("tr");
    let th5 = document.createElement("th");
    th5.innerText = "debiut";
    let th6 = document.createElement("th");
    th6.innerText = "ilość";
    let th7 = document.createElement("th");
    th7.innerText = "%";
    let th8 = document.createElement("th");
    th8.innerText = "filtr";
    tr2.append(th5, th6, th7, th8);
    blackTable.append(tr2);

    blackSummary.innerHTML = "<b>Czarne</b>";
    blackSummary.append(blackFilter);
    blackDetails.append(blackTable);
    blackDetails.append(blackSummary);
    blackTableCell.append(blackDetails);
    blackTableRow.append(blackTableCell);
    table.append(blackTableRow);

    for (let i = 0; i < json.blacks.length; i++) {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.innerText = json.blacks[i][0];
      let td2 = document.createElement("td");
      td2.innerText = json.blacks[i][1];
      sum += json.blacks[i][1];
      let td3 = document.createElement("td");
      td3.innerText = json.blacks[i][2];
      let td4 = document.createElement("td");
      let filter = document.createElement("a");
      filter.innerText = "filtruj";
      filter.href = `/player_data/?fullname=${encodeURIComponent(
        request.fullname
      )}&color=black&opening=${encodeURIComponent(json.blacks[i][0])}`;
      filter.target = "_self";
      td4.append(filter);
      tr.append(td1);
      tr.append(td2);
      tr.append(td3);
      tr.append(td4);
      blackTable.append(tr);
    }
  }

  let trSum = document.createElement("tr");
  let tdSum1 = document.createElement("td");
  tdSum1.innerText = "Suma";
  let tdSum2 = document.createElement("td");
  tdSum2.innerText = sum;
  tdSum2.colSpan = 2;
  let tdSum3 = document.createElement("td");
  let resetFilter = document.createElement("a");
  resetFilter.innerText = "resetuj filtr";
  resetFilter.target = "_self";
  resetFilter.href = `/player_data/?fullname=${encodeURIComponent(
    request.fullname
  )}`;
  tdSum3.append(resetFilter);
  trSum.append(tdSum1);
  trSum.append(tdSum2);
  trSum.append(tdSum3);
  table.append(trSum);
  document.getElementById("stats").append(table);
}

async function filter(player, color, opening) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/search_player_opening_game.php", true);
  player = replaceNationalCharacters(player);
  let messenge =
    "player=" +
    encodeURIComponent(player) +
    "&base=all" +
    "&color=" +
    encodeURIComponent(color) +
    "&opening=" +
    encodeURIComponent(opening);

  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        displayFilter(json);
        return json.rows;
      } catch (err) {}
    }
  };
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);

  try {
    let rmTable = document.getElementById("table");
    rmTable.remove();
  } catch {}
  let content = document.getElementById("content");
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
    clearInterval(interval);
    document.getElementById("loading").remove();
  };
}

function displayFilter(data) {
  try {
    let rmTable = document.getElementById("table");
    rmTable.remove();
  } catch {}

  let pre = document.getElementById("pre");
  let table = document.createElement("table");
  table.id = "table";
  let caption = document.createElement("caption");
  caption.innerText = "Znalezionych partii: " + data.length;
  if (data.length == 10000) {
    caption.innerText += " (limit)";
  }
  caption.innerText += " ";
  let save = document.createElement("button");
  save.innerText = "Pobierz";
  save.onclick = function () {
    download(data);
    save.style.color = "purple";
  };
  caption.append(save);
  table.append(caption);
  let colmns = document.createElement("tr");
  let th1 = document.createElement("th");
  th1.innerText = "Biały";
  let th2 = document.createElement("th");
  th2.innerText = "Elo białego";
  th2.classList.add("not_mobile");
  let th3 = document.createElement("th");
  th3.innerText = "Czarny";
  let th4 = document.createElement("th");
  th4.innerText = "Elo czarnego";
  th4.classList.add("not_mobile");
  let th5 = document.createElement("th");
  th5.style.width = "3.25em";
  th5.innerText = "Wynik";
  let th6 = document.createElement("th");
  th6.innerText = "Data";
  let th7 = document.createElement("th");
  th7.innerText = "Turniej";
  th7.classList.add("not_mobile");
  let th8 = document.createElement("th");
  th8.innerText = "ECO";
  th8.style.width = "2.5em";
  th8.classList.add("not_mobile");
  let th9 = document.createElement("th");
  th9.innerText = "Zobacz partię";
  let th10 = document.createElement("th");
  th10.innerText = "RAW";
  th10.classList.add("not_mobile");
  for (let i = 1; i <= 10; i++) {
    eval("colmns.append(th" + i + ")");
  }
  table.append(colmns);
  let ids = [];
  for (let i = 0; i < data.length; i++) {
    ids.push(data[i].id);
  }
  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement("tr");
    if (i % 2 == 0) {
      tr.style.backgroundColor = "LemonChiffon";
    } else {
      tr.style.backgroundColor = "LightCyan";
    }
    let td1 = document.createElement("td");
    td1.innerText = data[i].White;
    let td2 = document.createElement("td");
    td2.style.textAlign = "center";
    td2.innerText = data[i].WhiteElo;
    td2.classList.add("not_mobile");
    let td3 = document.createElement("td");
    td3.innerText = data[i].Black;
    let td4 = document.createElement("td");
    td4.style.textAlign = "center";
    td4.innerText = data[i].BlackElo;
    td4.classList.add("not_mobile");
    let td5 = document.createElement("td");
    td5.innerText = data[i].Result;
    let td6 = document.createElement("td");
    td6.innerText = data[i].Year + ".";
    if (data[i].Month == null) {
      td6.innerText += "?";
    } else {
      td6.innerText += data[i].Month;
    }
    td6.innerText += ".";
    if (data[i].Day == null) {
      td6.innerText += "?";
    } else {
      td6.innerText += data[i].Day;
    }
    let td7 = document.createElement("td");
    td7.innerText = data[i].Event;
    td7.classList.add("not_mobile");
    let td8 = document.createElement("td");
    td8.innerText = data[i].ECO;
    td8.classList.add("not_mobile");
    let td9 = document.createElement("td");
    td9.style.textAlign = "center";
    let viewButton = document.createElement("button");
    viewButton.innerText = "zobacz";
    viewButton.style.fontWeight = "bolder";
    viewButton.onclick = () => {
      let form = document.createElement("form");
      form.style.visibility = "hidden";
      form.method = "POST";
      form.action = "/game/index.php";
      let inputList = document.createElement("input");
      let ids = data.map(function (value) {
        return value.id;
      });
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
    td9.append(viewButton);
    let td10 = document.createElement("td");
    td10.innerHTML =
      "<button><a style='color: black;' href='/game_raw/?id=" +
      data[i].id +
      "&table=all'>zobacz</a></button>";
    td10.classList.add("not_mobile");
    for (let i = 1; i <= 10; i++) {
      eval("tr.append(td" + i + ")");
    }
    table.append(tr);
  }
  pre.append(table);
}

function loadCrData(request) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/cr_data.php", true);
  let messenge = "name=" + encodeURIComponent(request.fullname);
  xhttp2.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        if (document.getElementById("maxElo")) {
          json = json.filter((elem) => {
            return elem.fide_id > 0;
          });
        }

        if (json.length == 1) {
          await displayCrData("info", json[0]);
        } else if (json.length > 1) {
          let info = document.getElementById("info");
          let ambigousAlert = document.createElement("h3");
          ambigousAlert.id = "ambigousAlert";
          ambigousAlert.innerHTML =
            "<span style='color:red;'>UWAGA: Znaleziono więcej niż jednego zawodnika o tym nazwisku</span>\
            <br />najbardziej prawdopodobne:";
          info.append(ambigousAlert);

          json.forEach((element) => {});
          json.sort((a, b) =>
            categoryToRanking(a.kat) < categoryToRanking(b.kat)
              ? 1
              : categoryToRanking(b.kat) < categoryToRanking(a.kat)
              ? -1
              : 0
          );

          displayCrData("info", json[0]);
          let ambigous = document.createElement("details");
          ambigous.id = "ambigous";
          let description = document.createElement("summary");
          description.innerText = "inni znalezieni zawodnicy CR";
          description.style.width = "fit-content";
          description.style.margin = "auto";
          ambigous.append(description);
          info.append(ambigous);
          for (let i = 1; i < json.length; i++) {
            await displayCrData("ambigous", json[i]);
          }
        }
      } catch (err) {
      } finally {
        loadFIDEData(request);
      }
    }
  };

  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);
}

async function displayCrData(containerID, data) {
  let container = crateTableData(data);
  document.getElementById(containerID).append(container);
}

function crateTableData(data) {
  let container = document.createElement("table");
  container.id = "cr-data";

  let caption = document.createElement("caption");
  caption.innerHTML = "dane z <a href='https://www.cr-pzszach.pl'>CR</a>";
  container.append(caption);

  let tr0 = document.createElement("tr");
  let td0_1 = document.createElement("th");
  td0_1.colSpan = "2";
  td0_1.innerText = data.name;
  let td0_2 = document.createElement("td");
  let photo = document.createElement("img");
  photo.src = `http://www.cr-pzszach.pl/ew/ew/images/${data.id}.jpg`;
  photo.onerror = function () {
    this.parentElement.remove();
  };
  photo.id = "cr-foto";
  td0_2.append(photo);
  td0_2.rowSpan = "4";

  tr0.append(td0_1);
  tr0.append(td0_2);

  let tr1 = document.createElement("tr");
  let td1_1 = document.createElement("th");
  td1_1.innerText = "Tytuł/Kat.:";
  let td1_2 = document.createElement("td");
  td1_2.innerText = data.kat;
  tr1.append(td1_1);
  tr1.append(td1_2);

  let tr2 = document.createElement("tr");
  let td2_1 = document.createElement("th");
  td2_1.innerText = "CR ID:";
  let td2_2 = document.createElement("td");
  let crLink = document.createElement("a");
  crLink.href = `http://www.cr-pzszach.pl/ew/viewpage.php?page_id=1&zwiazek=&typ_czlonka=&pers_id=${data.id}`;
  crLink.innerText = data.id;
  td2_2.append(crLink);
  tr2.append(td2_1);
  tr2.append(td2_2);

  container.append(tr0);
  container.append(tr1);
  container.append(tr2);
  if (data.fide_id > 0) {
    let tr3 = document.createElement("tr");
    let td3_1 = document.createElement("th");
    td3_1.innerText = "FIDE ID:";
    let td3_2 = document.createElement("td");
    let fideLink = document.createElement("a");
    fideLink.href = `https://ratings.fide.com/profile/${data.fide_id}`;
    fideLink.innerText = data.fide_id;
    td3_2.append(fideLink);
    tr3.append(td3_1);
    tr3.append(td3_2);
    container.append(tr3);
  }

  return container;
}

function categoryToRanking(category) {
  switch (category.toUpperCase()) {
    case "GM":
      return 2600;
    case "IM":
      return 2450;
    case "WGM":
      return 2400;
    case "M":
      return 2400;
    case "FM":
      return 2300;
    case "K++":
      return 2300;
    case "K+":
      return 2275;
    case "WIM":
      return 2250;
    case "CM":
      return 2200;
    case "K":
      return 2200;
    case "WFM":
      return 2100;
    case "I++":
      return 2100;
    case "I+":
      return 2075;
    case "WCM":
      return 2050;
    case "I":
      return 2000;
    case "II+":
      return 1900;
    case "II":
      return 1800;
    case "III":
      return 1600;
    case "IV":
      return 1250;
    case "V":
      return 1200;
    default:
      return 1000;
  }
}

function designateMinMaxYearElo(request) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/min_max_year_elo.php", true);
  let messenge = "name=" + encodeURIComponent(request.fullname) + "&base=all";
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        putOnPageMinMaxYearElo(json);
      } catch (err) {}
    }
  };

  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);
}

function putOnPageMinMaxYearElo(data) {
  try {
    let eloDiv = document.getElementById("maxElo");
    if (data.maxElo)
      eloDiv.innerText = `najwyższy osiągnięty ranking: ${data.maxElo}`;
  } catch {}
  try {
    let yearsDiv = document.getElementById("yearRange");
    if (data.minYear && data.maxYear)
      yearsDiv.innerText = `gry z lat: ${data.minYear} - ${data.maxYear}`;
  } catch {}
}

function loadFIDEData(request) {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/API/fide_data.php", true);
  let messenge = "name=" + encodeURIComponent(request.fullname) + "&base=all";
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        if (json.length > 0) {
          json.sort((a, b) => {
            return b.rating - a.rating;
          });
          displayFideData(json);
        }
      } catch (error) {}
    }
  };

  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(messenge);
}

function displayFideData(data) {
  let container = document.createElement("table");
  container.id = "fide-data";
  container.style.border = "none";
  let caption = document.createElement("caption");
  caption.innerHTML =
    "dane z <a href='https://ratings.fide.com/download_lists.phtml'>FIDE</a>";
  container.append(caption);
  let details = document.createElement("details");
  details.id = "ambigous2";
  details.style.width = "fit-content";
  details.style.margin = "auto";
  let summary = document.createElement("summary");
  summary.innerText = "inni znalezieni zawodnicy FIDE";
  details.append(summary);
  for (let i = 0; i < data.length; i++) {
    let table = document.createElement("table");
    let tr1 = document.createElement("tr");
    let description1 = document.createElement("th");
    description1.colSpan = "2";
    description1.innerText = data[i].name;
    tr1.append(description1);
    let tr2 = document.createElement("tr");
    let description2 = document.createElement("th");
    description2.innerText = "ID";
    let value2 = document.createElement("td");
    value2.innerHTML = parseInt(data[i].fideid)
      ? `<a href="https://ratings.fide.com/profile/${parseInt(
          data[i].fideid
        )}">${parseInt(data[i].fideid)}</a>`
      : "brak";
    tr2.append(description2, value2);
    let tr3 = document.createElement("tr");
    let description3 = document.createElement("th");
    description3.innerText = "Tytuł";
    let value3 = document.createElement("td");
    value3.innerText = data[i].title ? data[i].title : "brak";
    tr3.append(description3, value3);
    let tr4 = document.createElement("tr");
    let description4 = document.createElement("th");
    description4.innerText = "Rocznik";
    let value4 = document.createElement("td");
    value4.innerText = data[i].birthday ? data[i].birthday : "brak";
    tr4.append(description4, value4);
    let tr5 = document.createElement("tr");
    let description5 = document.createElement("th");
    description5.colSpan = "2";
    description5.innerText = "Elo";
    tr5.append(description5);
    let tr6 = document.createElement("tr");
    let description6 = document.createElement("th");
    description6.innerText = "Klasyczne";
    let value6 = document.createElement("td");
    value6.innerText = parseInt(data[i].rating)
      ? parseInt(data[i].rating)
      : "brak";
    tr6.append(description6, value6);
    let tr7 = document.createElement("tr");
    let description7 = document.createElement("th");
    description7.innerText = "Szybkie";
    let value7 = document.createElement("td");
    value7.innerText = parseInt(data[i].rapid_rating)
      ? parseInt(data[i].rapid_rating)
      : "brak";
    tr7.append(description7, value7);
    let tr8 = document.createElement("tr");
    let description8 = document.createElement("th");
    description8.innerText = "Błyskawiczne";
    let value8 = document.createElement("td");
    value8.innerText = parseInt(data[i].blitz_rating)
      ? parseInt(data[i].blitz_rating)
      : "brak";
    tr8.append(description8, value8);
    table.append(tr1);
    table.append(tr2);
    table.append(tr3);
    table.append(tr4);
    table.append(tr5);
    table.append(tr6);
    table.append(tr7);
    table.append(tr8);
    if (i == 0) {
      container.append(table);
    } else {
      details.append(table);
    }
  }

  document.getElementById("info").append(container);
  if (data.length > 1) {
    document.getElementById("info").append(details);
  }
}

export {
  search,
  displayData,
  download,
  replaceNationalCharacters,
  loadGames,
  loadStats,
  displayStats,
  filter,
  displayFilter,
  loadCrData,
  crateTableData,
  categoryToRanking,
  designateMinMaxYearElo,
  putOnPageMinMaxYearElo,
  loadFIDEData,
  displayCrData,
};
