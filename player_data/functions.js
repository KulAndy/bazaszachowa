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
  xhttp2.open("POST", "/search/search.php", true);
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
        createStats(json.rows);
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

function displayData(
  data,
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
      console.log("click");
      console.log(
        data[i].id,
        data[i].table,
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
      );
      goToGame(
        data[i].id,
        data[i].table,
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
      );
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

function goToGame(
  id,
  table,
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
  let idInput = document.getElementById("idInput");
  idInput.value = id;
  let tableInput = document.getElementById("tableInput");
  tableInput.value = table;
  let whiteInput = document.getElementById("whiteInput");
  whiteInput.value = white;
  let blackInput = document.getElementById("blackInput");
  blackInput.value = black;
  let ignoreInput = document.getElementById("ignoreInput");
  if (ignore) {
    ignoreInput.value = "true";
  } else {
    ignoreInput.value = null;
  }
  let minYearInput = document.getElementById("minYearInput");
  minYearInput.value = minYear;
  let maxYearInput = document.getElementById("maxYearInput");
  maxYearInput.value = maxYear;
  let eventsInput = document.getElementById("eventsInput");
  eventsInput.value = events;
  let minEcoInput = document.getElementById("minEcoInput");
  minEcoInput.value = minEco;
  let maxEcoInput = document.getElementById("maxEcoInput");
  maxEcoInput.value = maxEco;
  let baseInput = document.getElementById("baseInput");
  baseInput.value = base;
  let searchingInput = document.getElementById("searchingInput");
  searchingInput.value = searching;
  let form = document.getElementById("form");
  form.submit();
}

async function loadGames() {
  let minEco = typeof request.minEco == "undefined" ? "" : request.minEco;
  let maxEco = typeof request.maxEco == "undefined" ? "" : request.maxEco;
  if (request.color == "white") {
    var rows = await search(
      request.fullname,
      "",
      false,
      "",
      "",
      "",
      minEco,
      maxEco,
      "all",
      "fulltext"
    );
  } else if (request.color == "black") {
    var rows = await search(
      "",
      request.fullname,
      false,
      "",
      "",
      "",
      minEco,
      maxEco,
      "all",
      "fulltext"
    );
  } else {
    var rows = await search(
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
  console.log(rows);
}

function loadStats() {
  const xhttp2 = new XMLHttpRequest();
  xhttp2.open("POST", "/player_data/stats.php", true);
  let messenge = "fullname=" + encodeURIComponent(request.fullname);
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        let json = JSON.parse(this.responseText);
        displayStats(json);
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

function displayStats(json) {
  let statsDiv = document.getElementById("stats");
  let stats = document.createElement("table");
  let titles = document.createElement("tr");
  let tlOpening = document.createElement("th");
  tlOpening.innerText = "debiut";
  let tlQuantityb = document.createElement("th");
  tlQuantityb.innerText = "ilość";
  let tlPercent = document.createElement("th");
  tlPercent.innerText = "%";
  let tlFilter = document.createElement("th");
  tlFilter.innerText = "filtr";
  titles.append(tlOpening);
  titles.append(tlQuantityb);
  titles.append(tlPercent);
  titles.append(tlFilter);
  stats.append(titles);
  let whiteHeader = document.createElement("th");
  whiteHeader.innerText = "Białe";
  whiteHeader.setAttribute("colspan", 4);
  stats.append(whiteHeader);
  json.whites.forEach((element) => {
    let tr = document.createElement("tr");
    let name = document.createElement("td");
    name.innerText = element[0];
    let quantity = document.createElement("td");
    quantity.innerText = element[1];
    let percent = document.createElement("td");
    let percentGames = (element[1] / json.whitesGames) * 100;
    percent.innerText = percentGames.toFixed(2);
    let filterCell = document.createElement("td");
    let filter = document.createElement("a");
    filter.target = "_self";
    let link = `/player_data/?fullname=${encodeURIComponent(
      request.fullname
    )}&color=white&`;
    if (element[0] == "Różne") {
      link += "exception=various";
    } else if (element[0] == "Debiut pionka hetmańskiego") {
      link += "exception=queenPawn";
    } else {
      link += `minEco=${element[2]}&maxEco=${element[3]}`;
    }
    filter.href = link;
    filter.innerText = "filtruj";
    filterCell.append(filter);
    tr.append(name);
    tr.append(quantity);
    tr.append(percent);
    tr.append(filterCell);
    stats.append(tr);
  });
  let whiteSummary = document.createElement("tr");
  let whiteDescription = document.createElement("td");
  whiteDescription.innerText = "suma";
  whiteSummary.append(whiteDescription);
  let whiteSum = document.createElement("td");
  whiteSum.colSpan = "2";
  whiteSum.innerText = json.whitesGames;
  whiteSummary.append(whiteSum);
  let whiteFilterCell = document.createElement("td");
  let whiteFilter = document.createElement("a");
  whiteFilter.target = "_self";
  whiteFilter.href = `/player_data/?fullname${encodeURIComponent(
    request.fullname
  )}&color=white&minEco=A00&maxEco=E99`;
  whiteFilter.innerText = "filtruj";
  whiteFilterCell.append(whiteFilter);
  whiteSummary.append(whiteFilterCell);

  let blackHeader = document.createElement("th");
  blackHeader.innerText = "Czarne";
  blackHeader.setAttribute("colspan", 4);
  stats.append(blackHeader);
  json.blacks.forEach((element) => {
    let tr = document.createElement("tr");
    let name = document.createElement("td");
    name.innerText = element[0];
    let quantity = document.createElement("td");
    quantity.innerText = element[1];
    let percent = document.createElement("td");
    let percentGames = (element[1] / json.blacksGames) * 100;
    percent.innerText = percentGames.toFixed(2);
    let filterCell = document.createElement("td");
    let filter = document.createElement("a");
    filter.target = "_self";
    let link = `/player_data/?fullname=${encodeURIComponent(
      request.fullname
    )}&color=black&`;
    if (element[0] == "Różne") {
      link += "exception=various";
    } else if (element[0] == "Debiut pionka hetmańskiego") {
      link += "exception=queenPawn";
    } else {
      link += `minEco=${element[2]}&maxEco=${element[3]}`;
    }
    filter.href = link;
    filter.innerText = "filtruj";
    filterCell.append(filter);
    tr.append(name);
    tr.append(quantity);
    tr.append(percent);
    tr.append(filterCell);
    stats.append(tr);
  });
  let blackSummary = document.createElement("tr");
  let blackDescription = document.createElement("td");
  blackDescription.innerText = "suma";
  blackSummary.append(blackDescription);
  let blackSum = document.createElement("td");
  blackSum.colSpan = "2";
  blackSum.innerText = json.blacksGames;
  blackSummary.append(blackSum);
  let blackFilterCell = document.createElement("td");
  let blackFilter = document.createElement("a");
  blackFilter.target = "_self";
  blackFilter.href = `/player_data/?fullname${encodeURIComponent(
    request.fullname
  )}&color=black&minEco=A00&maxEco=E99`;
  blackFilter.innerText = "filtruj";
  blackFilterCell.append(blackFilter);
  blackSummary.append(blackFilterCell);

  let allSummary = document.createElement("tr");
  let allDescription = document.createElement("td");
  allDescription.innerText = "suma";
  allSummary.append(allDescription);
  let allSum = document.createElement("td");
  allSum.innerText = json.whitesGames + json.blacksGames;
  allSum.colSpan = "2";
  allSummary.append(allSum);
  let allResetFilterCell = document.createElement("td");
  let allResetFilter = document.createElement("a");
  allResetFilter.target = "_self";
  allResetFilter.href = `/player_data/?fullname=${encodeURIComponent(
    request.fullname
  )}`;
  allResetFilter.innerText = "resetuj filtr";
  allResetFilterCell.append(allResetFilter);
  allSummary.append(allResetFilterCell);
  stats.append(allSummary);

  statsDiv.append(stats);
}

function createStats(json) {
  console.log(json);
}
