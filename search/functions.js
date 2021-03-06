"use strict"

function search(
    whiteName,
    whiteLastName,
    blackName,
    blackLastName,
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
    whiteName = replaceNationalCharacters(whiteName)
    whiteLastName = replaceNationalCharacters(whiteLastName)
    blackName = replaceNationalCharacters(blackName)
    blackLastName = replaceNationalCharacters(blackLastName)
    events = replaceNationalCharacters(events)
    let messenge =
        "whiteName=" +
        encodeURIComponent(whiteName) +
        "&whiteLastName=" +
        encodeURIComponent(whiteLastName) +
        "&blackName=" +
        encodeURIComponent(blackName) +
        "&blackLastName=" +
        encodeURIComponent(blackLastName) +
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

    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            displayData(json.rows);
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
    const interval = setInterval(function() {
        loading.innerText = "Ładowanie ";
        for (let i = 0; i < (counter % 10) + 1; i++) {
            loading.innerText += ".";
        }
        counter++;
    }, 500);
    xhttp2.onloadend = function() {
        document.getElementById("loading").remove();
    };
}

function displayData(data) {
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
    let save = document.createElement("a");
    save.innerText = "Pobierz";
    save.style.color = "blue";
    save.style.textDecoration = "underline";
    save.onclick = function() {
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
    th2.classList.add("not_mobile")
    let th3 = document.createElement("th");
    th3.innerText = "Czarny";
    let th4 = document.createElement("th");
    th4.innerText = "Elo czarnego";
    th4.classList.add("not_mobile")
    let th5 = document.createElement("th");
    th5.innerText = "Wynik";
    let th6 = document.createElement("th");
    th6.innerText = "Data";
    let th7 = document.createElement("th");
    th7.innerText = "Turniej";
    th7.classList.add("not_mobile")
    let th8 = document.createElement("th");
    th8.innerText = "ECO";
    th8.classList.add("not_mobile")
    let th9 = document.createElement("th");
    th9.innerText = "Zobacz partię";
    let th10 = document.createElement("th");
    th10.innerText = "RAW";
    th10.classList.add("not_mobile")
    for (let i = 1; i <= 10; i++) {
        eval("colmns.append(th" + i + ")");
    }
    table.append(colmns);
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
        td2.innerText = data[i].WhiteElo;
        td2.classList.add("not_mobile")
        let td3 = document.createElement("td");
        td3.innerText = data[i].Black;
        let td4 = document.createElement("td");
        td4.innerText = data[i].BlackElo;
        td4.classList.add("not_mobile")
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
        td7.classList.add("not_mobile")
        let td8 = document.createElement("td");
        td8.innerText = data[i].ECO;
        td8.classList.add("not_mobile")
        let td9 = document.createElement("td");
        td9.innerHTML =
            "<a href='/game/index.php?id=" +
            data[i].id +
            "&table=" +
            data[i].table +
            "'>zobacz</a>";
        let td10 = document.createElement("td");
        td10.innerHTML =
            "<a href='/game_raw/index.php?id=" +
            data[i].id +
            "&table=" +
            data[i].table +
            "'>zobacz</a>";
        td10.classList.add("not_mobile")
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

function replaceNationalCharacters(text){
    let toReplace = text
    toReplace = toReplace.replace(/ą/g, "a")
    toReplace = toReplace.replace(/Ą/g, "A")
    toReplace = toReplace.replace(/ć/g, "c")
    toReplace = toReplace.replace(/Ć/g, "C")
    toReplace = toReplace.replace(/ę/g, "e")
    toReplace = toReplace.replace(/Ę/g, "E")
    toReplace = toReplace.replace(/ł/g, "l")
    toReplace = toReplace.replace(/Ł/g, "L")
    toReplace = toReplace.replace(/ń/g, "n")
    toReplace = toReplace.replace(/Ń/g, "n")
    toReplace = toReplace.replace(/o/g, "o")
    toReplace = toReplace.replace(/O/g, "o")
    toReplace = toReplace.replace(/ś/g, "s")
    toReplace = toReplace.replace(/Ś/g, "s")
    toReplace = toReplace.replace(/ź/g, "z")
    toReplace = toReplace.replace(/Ź/g, "Z")
    toReplace = toReplace.replace(/ż/g, "z")
    toReplace = toReplace.replace(/Ż/g, "Z")
    return toReplace
}
