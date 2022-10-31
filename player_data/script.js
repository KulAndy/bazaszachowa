async function loadGames() {
  let minEco = typeof request.minEco == "undefined" ? "" : request.minEco;
  let maxEco = typeof request.maxEco == "undefined" ? "" : request.maxEco;
  let rows;
  if (request.color == "white") {
    rows = await search(
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
    rows = await search(
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
    rows = await search(
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
  whiteHeader.colspan = "4";
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
  blackHeader.colspan = "4";
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
  allResetFilter.href = `/player_data/?fullname${encodeURIComponent(
    request.fullname
  )}`;
  allResetFilter.innerText = "resetuj filtr";
  allResetFilterCell.append(allResetFilter);
  allSummary.append(allResetFilterCell);
  stats.append(allSummary);

  statsDiv.append(stats);
}

loadStats();
loadGames();
