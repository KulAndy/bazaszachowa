"use strict";

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

if (confirm("Czy należysz do kręgu towarzyskiego autora strony?")) {
    let content = document.getElementById("content");
    let white = document.createElement("h3");
    white.innerText = "biały";
    white.style.textAlign = "center";
    white.style.marginBottom = 0;
    content.append(white);
    let whiteNameLabel = document.createElement("label");
    whiteNameLabel.for = "white";
    whiteNameLabel.innerText = "nazwisko:\t\t";
    let whiteName = document.createElement("input");
    whiteName.type = "text";
    whiteName.id = "whiteName";
    whiteName.placeholder = "Nowak";
    let whiteLastNameLabel = document.createElement("label");
    whiteLastNameLabel.for = "white";
    whiteLastNameLabel.innerText = "Imię:\t\t\t";
    let whiteLastName = document.createElement("input");
    whiteLastName.type = "text";
    whiteLastName.id = "whiteLastName";
    whiteLastName.placeholder = "Jan";
    content.append(whiteNameLabel);
    content.append(whiteName);
    content.append(document.createElement("br"));
    content.append(whiteLastNameLabel);
    content.append(whiteLastName);
    content.append(document.createElement("br"));
    let black = document.createElement("h3");
    black.innerText = "czarny";
    black.style.textAlign = "center";
    black.style.marginBottom = 0;
    black.style.marginTop = 0;
    content.append(black);
    let blackNameLabel = document.createElement("label");
    blackNameLabel.for = "white";
    blackNameLabel.innerText = "nazwisko:\t\t";
    let blackName = document.createElement("input");
    blackName.type = "text";
    blackName.id = "blackName";
    blackName.placeholder = "Nowak";
    let blackLastNameLabel = document.createElement("label");
    blackLastNameLabel.for = "blackLastName";
    blackLastNameLabel.innerText = "Imię:\t\t\t";
    let blackLastName = document.createElement("input");
    blackLastName.type = "text";
    blackLastName.id = "blackLastName";
    blackLastName.placeholder = "Jan";
    content.append(blackNameLabel);
    content.append(blackName);
    content.append(document.createElement("br"));
    content.append(blackLastNameLabel);
    content.append(blackLastName);
    content.append(document.createElement("br"));
    let ignoreColorLabel = document.createElement("label");
    ignoreColorLabel.for = "ignoreColor";
    ignoreColorLabel.innerText = "ignoruj kolory\t\t";
    let ignoreColor = document.createElement("input");
    ignoreColor.id = "ignoreColor";
    ignoreColor.type = "checkbox";
    content.append(ignoreColorLabel);
    content.append(ignoreColor);
    content.append(document.createElement("br"));
    let minYearLabel = document.createElement("label");
    minYearLabel.for = "minYear";
    minYearLabel.innerText = "lata:\t\t\t\t";
    let minYear = document.createElement("input");
    minYear.type = "number";
    minYear.id = "minYear";
    minYear.step = 1;
    minYear.min = 1475;
    minYear.style.width = "4em";
    let date = new Date();
    minYear.max = date.getFullYear();

    let maxYearLabel = document.createElement("label");
    maxYearLabel.for = "minYear";
    maxYearLabel.innerText = " - ";
    let maxYear = document.createElement("input");
    maxYear.type = "number";
    maxYear.id = "maxYear";
    maxYear.step = 1;
    maxYear.style.width = "4em";
    maxYear.min = 1475;
    maxYear.max = date.getFullYear();

    content.append(minYearLabel);
    content.append(minYear);
    content.append(maxYearLabel);
    content.append(maxYear);
    content.append(document.createElement("br"));
    let eventLabel = document.createElement("label");
    eventLabel.for = "event";
    eventLabel.innerText = "turniej:\t\t\t";
    let events = document.createElement("input");
    events.id = "event";
    events.type = "text";
    content.append(eventLabel);
    content.append(events);
    content.append(document.createElement("br"));

    let ECO_letters = ["A", "B", "C", "D", "E"];
    let select1Label = document.createElement("label");
    select1Label.for = "select1";
    select1Label.innerText = "ECO:\t\t\t";
    let select1 = document.createElement("select");
    select1.id = "select1";

    let select2Label = document.createElement("label");
    select2Label.for = "select1";
    select2Label.innerText = " - ";
    let select2 = document.createElement("select");
    select2.id = "select2";

    ECO_letters.forEach((i) => {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 10; k++) {
                let option1 = document.createElement("option");
                option1.value = i + j + k;
                option1.innerText = i + j + k;
                let option2 = document.createElement("option");
                option2.value = i + j + k;
                option2.innerText = i + j + k;
                select1.append(option1);
                select2.append(option2);
            }
        }
    });

    select2.value = "E99";

    content.append(select1Label);
    content.append(select1);
    content.append(select2Label);
    content.append(select2);
    content.append(document.createElement("br"));

    let baseLabel = document.createElement("label");
    baseLabel.for = "radioB1";
    baseLabel.innerText = "baza:\t\t\t";
    let radioB1Label = document.createElement("label");
    radioB1Label.for = "radioB1";
    let abbrB1 = document.createElement("abbr");
    abbrB1.innerText = "Polska ";
    abbrB1.title = "szybsza baza (zalecana)";
    radioB1Label.append(abbrB1);
    let radioB1 = document.createElement("input");
    radioB1.type = "radio";
    radioB1.checked = true;
    radioB1.id = "radioB1";
    radioB1.name = "base";
    let radioB2Label = document.createElement("label");
    radioB2Label.for = "radio2";
    let abbrB2 = document.createElement("abbr");
    abbrB2.innerText = " całość ";
    abbrB2.title = " większa, wolniejsza baza (niezalecana)";
    radioB2Label.append(abbrB2);
    let radioB2 = document.createElement("input");
    radioB2.type = "radio";
    radioB2.id = "radioB2";
    radioB2.name = "base";

    content.append(baseLabel);
    content.append(radioB1Label);
    content.append(radioB1);
    content.append(radioB2Label);
    content.append(radioB2);
    content.append(document.createElement("br"));

    let searchingLabel = document.createElement("label");
    searchingLabel.for = "searching";
    searchingLabel.innerText = "wyszukiwanie:\t";
    let radioS1Label = document.createElement("label");
    radioS1Label.innerText = "zwykłe";
    radioS1Label.for = "radioS1";
    let radioS1 = document.createElement("input");
    radioS1.type = "radio";
    radioS1.checked = true;
    radioS1.id = "radioS1";
    radioS1.name = "searching";
    let radioS2Label = document.createElement("label");
    radioS2Label.innerText = "dokładne (ekperymentalne)";
    let radioS2 = document.createElement("input");
    radioS2.type = "radio";
    radioS2.name = "searching";
    radioS2.id = "radioS2";

    content.append(searchingLabel);
    content.append(radioS1Label);
    content.append(radioS1);
    content.append(radioS2Label);
    content.append(radioS2);
    content.append(document.createElement("br"));

    let button = document.createElement("button");
    button.innerText = "szukaj";
    button.style.marginLeft = "10em";
    button.style.marginTop = "10px";
    button.onclick = () => {
        let whiteName = document.getElementById("whiteName");
        let whiteLastName = document.getElementById("whiteLastName");
        let blackName = document.getElementById("blackName");
        let blackLastName = document.getElementById("blackLastName");
        let ignoreColor = document.getElementById("ignoreColor");
        let year1 = document.getElementById("minYear");
        let year2 = document.getElementById("maxYear");
        let events = document.getElementById("event");
        let eco1 = document.getElementById("select1");
        let eco2 = document.getElementById("select2");
        let base;
        if (document.getElementById("radioB1").checked) {
            base = "poland";
        } else if (document.getElementById("radioB2").checked) {
            base = "all";
        }
        let searching;
        if (document.getElementById("radioS1").checked) {
            searching = "classic";
        } else if (document.getElementById("radioS2").checked) {
            searching = "fulltext";
        }
        if (typeof base != "undefined" && typeof searching) {
            if (
                whiteName.value.trim() == "" &&
                whiteLastName.value.trim() == "" &&
                blackName.value.trim() == "" &&
                blackLastName.value.trim() == ""
            ) {
                alert("Nie podano gracza do wyszukiwania");
            } else if (year1.value > year2.value) {
                alert("Podano zły zakres lat");
            } else if (parseInt(eco1.value, 16) > parseInt(eco2.value, 16)) {
                alert("Podano zły zakres kodów eco");
            } else {
                search(
                    whiteName.value.trim(),
                    whiteLastName.value.trim(),
                    blackName.value.trim(),
                    blackName.value.trim(),
                    ignoreColor.checked,
                    year1.value,
                    year2.value,
                    events.value,
                    eco1.value,
                    eco2.value,
                    base,
                    searching
                );
            }
        }
    };
    window.onkeydown = (e) => {
        if (e.which == 13) {
            let whiteName = document.getElementById("whiteName");
            let whiteLastName = document.getElementById("whiteLastName");
            let blackName = document.getElementById("blackName");
            let blackLastName = document.getElementById("blackLastName");
            let ignoreColor = document.getElementById("ignoreColor");
            let year1 = document.getElementById("minYear");
            let year2 = document.getElementById("maxYear");
            let events = document.getElementById("event");
            let eco1 = document.getElementById("select1");
            let eco2 = document.getElementById("select2");
            let base;
            if (document.getElementById("radioB1").checked) {
                base = "poland";
            } else if (document.getElementById("radioB2").checked) {
                base = "all";
            }
            let searching;
            if (document.getElementById("radioS1").checked) {
                searching = "classic";
            } else if (document.getElementById("radioS2").checked) {
                searching = "fulltext";
            }
            if (typeof base != "undefined" && typeof searching) {
                if (
                    whiteName.value.trim() == "" &&
                    whiteLastName.value.trim() == "" &&
                    blackName.value.trim() == "" &&
                    blackLastName.value.trim() == ""
                ) {
                    alert("Nie podano gracza do wyszukiwania");
                } else if (year1.value > year2.value) {
                    alert("Podano zły zakres lat");
                } else if (parseInt(eco1.value, 16) > parseInt(eco2.value, 16)) {
                    alert("Podano zły zakres kodów eco");
                } else {
                    search(
                        whiteName.value.trim(),
                        whiteLastName.value.trim(),
                        blackName.value.trim(),
                        blackName.value.trim(),
                        ignoreColor.checked,
                        year1.value,
                        year2.value,
                        events.value,
                        eco1.value,
                        eco2.value,
                        base,
                        searching
                    );
                }
            }
        }
    };
    content.append(button);
} else {
    document.body.remove();
}