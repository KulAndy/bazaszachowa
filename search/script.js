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

// if (confirm("Czy należysz do kręgu towarzyskiego autora strony?")) {
    let content = document.getElementById("content");
    let table  = document.createElement("table")
    table.classList.add("no_border")
    let tr1 = document.createElement("tr")
    let white = document.createElement("th");
    white.innerText = "biały";
    white.style.textAlign = "center";
    white.style.marginBottom = 0;
    white.colSpan = "4"
    tr1.append(white)
    table.append(tr1)
    let tr2 = document.createElement("tr")
    let whiteNameLabel = document.createElement("td");
    whiteNameLabel.innerText = "nazwisko:";
    tr2.append(whiteNameLabel)
    let tdWN = document.createElement("td")
    tdWN.colSpan = "3"
    let whiteName = document.createElement("input");
    whiteName.type = "text";
    whiteName.id = "whiteName";
    whiteName.placeholder = "Nowak";
    tdWN.append(whiteName)
    tr2.append(tdWN)
    table.append(tr2)
    let tr3 = document.createElement("tr")
    let whiteLastNameLabel = document.createElement("td");
    whiteLastNameLabel.innerText = "Imię:";
    tr3.append(whiteLastNameLabel)
    let tdWLN = document.createElement("td")
    tdWLN.colSpan = "3"
    let whiteLastName = document.createElement("input");
    whiteLastName.type = "text";
    whiteLastName.id = "whiteLastName";
    whiteLastName.placeholder = "Jan";
    tdWLN.append(whiteLastName)
    tr3.append(tdWLN)
    table.append(tr3)
    let tr4 = document.createElement("tr")
    let black = document.createElement("th");
    black.innerText = "czarny";
    black.style.textAlign = "center";
    black.style.marginBottom = 0;
    black.style.marginTop = 0;
    black.colSpan = "4"
    tr4.append(black)
    table.append(tr4)
    let tr5 = document.createElement("tr")
    let blackNameLabel = document.createElement("td");
    blackNameLabel.innerText = "nazwisko:";
    tr5.append(blackNameLabel)
    let tdBN = document.createElement("td")
    tdBN.colSpan = "3"
    let blackName = document.createElement("input");
    blackName.type = "text";
    blackName.id = "blackName";
    blackName.placeholder = "Nowak";
    tdBN.append(blackName)
    tr5.append(tdBN)
    table.append(tr5)
    let tr6 = document.createElement("tr")
    let blackLastNameLabel = document.createElement("td");
    blackLastNameLabel.innerText = "Imię:";
    tr6.append(blackLastNameLabel)
    let tdBLN = document.createElement("td")
    tdBLN.colSpan = "3"
    let blackLastName = document.createElement("input");
    blackLastName.type = "text";
    blackLastName.id = "blackLastName";
    blackLastName.placeholder = "Jan";
    tdBLN.append(blackLastName)
    tr6.append(tdBLN)
    table.append(tr6)
    let tr7 = document.createElement("tr")
    let ignoreColorLabel = document.createElement("td");
    ignoreColorLabel.innerText = "ignoruj kolory";
    tr7.append(ignoreColorLabel)
    let tdIC = document.createElement("td")
    tdIC.colSpan = "3"
    let ignoreColor = document.createElement("input");
    ignoreColor.id = "ignoreColor";
    ignoreColor.type = "checkbox";
    tdIC.append(ignoreColor)
    tr7.append(tdIC)
    table.append(tr7)
    let tr8 = document.createElement("tr")
    let minYearLabel = document.createElement("td");
    minYearLabel.innerText = "lata:";
    tr8.append(minYearLabel)
    let tdMinY = document.createElement("td")
    let minYear = document.createElement("input");
    minYear.type = "number";
    minYear.id = "minYear";
    minYear.step = 1;
    minYear.min = 1475;
    minYear.style.width = "4em";
    let date = new Date();
    minYear.max = date.getFullYear();
    tdMinY.append(minYear)
    tr8.append(tdMinY)

    let maxYearLabel = document.createElement("td");
    maxYearLabel.innerText = " - ";
    tr8.append(maxYearLabel)
    let tdMax = document.createElement("td")
    tdMax.style.display = "flex"
    tdMax.style.justifyContent = "flex-end"
    let maxYear = document.createElement("input");
    maxYear.type = "number";
    maxYear.id = "maxYear";
    maxYear.step = 1;
    maxYear.style.width = "4em";
    maxYear.min = 1475;
    maxYear.max = date.getFullYear();
    tdMax.append(maxYear)
    tr8.append(tdMax)
    table.append(tr8)

    let tr9 = document.createElement("tr")
    let eventLabel = document.createElement("td");
    eventLabel.innerText = "turniej:";
    tr9.append(eventLabel)
    let tdE = document.createElement("td")
    tdE.colSpan = "3"
    let events = document.createElement("input");
    events.id = "event";
    events.type = "text";
    tdE.append(events)
    tr9.append(tdE)
    table.append(tr9)

    let tr10 = document.createElement("tr")
    let ECO_letters = ["A", "B", "C", "D", "E"];
    let select1Label = document.createElement("td");
    select1Label.innerText = "ECO:";
    tr10.append(select1Label)
    let tdS1 = document.createElement("td")
    let select1 = document.createElement("select");
    select1.id = "select1";
    tdS1.append(select1)
    tr10.append(tdS1)

    let select2Label = document.createElement("td");
    select2Label.innerText = " - ";
    tr10.append(select2Label)
    let tdS2 = document.createElement("td")
    tdS2.style.display = "flex"
    tdS2.style.justifyContent = "flex-end"
    let select2 = document.createElement("select");
    select2.id = "select2";
    tdS2.append(select2)
    tr10.append(tdS2)

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

    table.append(tr10)

    let tr11 = document.createElement("tr")
    let baseLabel = document.createElement("td");
    baseLabel.innerText = "baza:";
    tr11.append(baseLabel)
    let radioB1Label = document.createElement("td");
    let abbrB1 = document.createElement("abbr");
    abbrB1.innerText = "Polska ";
    abbrB1.title = "szybsza baza (zalecana)";
    radioB1Label.append(abbrB1);
    let radioB1 = document.createElement("input");
    radioB1.type = "radio";
    radioB1.checked = true;
    radioB1.id = "radioB1";
    radioB1.name = "base";
    radioB1Label.append(radioB1)
    tr11.append(radioB1Label)
    let radioB2Label = document.createElement("td");
    radioB2Label.colSpan = "2"
    let abbrB2 = document.createElement("abbr");
    abbrB2.innerText = " całość ";
    abbrB2.title = " większa, wolniejsza baza (niezalecana)";
    radioB2Label.append(abbrB2);
    let radioB2 = document.createElement("input");
    radioB2.type = "radio";
    radioB2.id = "radioB2";
    radioB2.name = "base";
    radioB2Label.append(radioB2)
    tr11.append(radioB2Label)
    table.append(tr11)


    let tr12 = document.createElement("tr")
    let searchingLabel = document.createElement("td");
    searchingLabel.innerText = "wyszukiwanie:";
    tr12.append(searchingLabel)
    let radioS1Label = document.createElement("td");
    radioS1Label.innerText = "zwykłe";
    let radioS1 = document.createElement("input");
    radioS1.type = "radio";
    radioS1.checked = true;
    radioS1.id = "radioS1";
    radioS1.name = "searching";
    radioS1Label.append(radioS1)
    tr12.append(radioS1Label)
    let radioS2Label = document.createElement("td");
    radioS2Label.innerText = "dokładne";
    radioS2Label.colSpan = "2"
    let radioS2 = document.createElement("input");
    radioS2.type = "radio";
    radioS2.name = "searching";
    radioS2.id = "radioS2";
    radioS2Label.append(radioS2)
    tr12.append(radioS2Label)
    table.append(tr12)

    let tr13 = document.createElement("tr")
    let thB = document.createElement("th")
    thB.colSpan = "4"
    let button = document.createElement("button");
    button.innerText = "szukaj";
    thB.append(button)
    tr13.append(thB)
    table.append(tr13)
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

    content.append(table)
    
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
// } else {
//     document.body.remove();
// }