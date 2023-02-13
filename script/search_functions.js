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
        displayData(json.rows, base);
        console.log(json);
        return json.rows;
      } catch (err) {
        try {
          console.log(this.responseText);
          let rmTable = document.getElementById("table");
          rmTable.remove();
        } catch {}
        let table = document.createElement("table");
        table.id = "table";
        let caption = document.createElement("caption");
        caption.innerText =
          "Wystapił błąd\nSpróbuj odświeżyć stronę (Ctrl + Shift + R), a jeśli to nie pomoże powiadom administratora o problemie";
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
  th9.innerText = "Zobacz\npartię";
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
      inputBase.value = base;
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
