"use strict";

if (window.screen.availWidth <= 600 || window.screen.availHeight <= 600) {
  document.getElementsByTagName("details")[0].removeAttribute("open");
}

window.addEventListener("resize", function () {
  if (window.screen.availWidth <= 600 || window.screen.availHeight <= 600) {
    document.getElementsByTagName("details")[0].removeAttribute("open");
  }
});

let content = document.getElementById("content");
let table = document.createElement("table");
table.classList.add("no_border");
let tr1 = document.createElement("tr");
let whiteLabel = document.createElement("td");
whiteLabel.innerText = "Białe:";
tr1.append(whiteLabel);
let tdW = document.createElement("td");
tdW.colSpan = "3";
let white = document.createElement("input");
white.type = "text";
white.id = "white";
white.placeholder = "Nowak, Jan";
tdW.append(white);
tr1.append(tdW);

let tr2 = document.createElement("tr");
let blackLabel = document.createElement("td");
blackLabel.innerText = "Czarne: ";
tr2.append(blackLabel);
let tdB = document.createElement("td");
tdB.colSpan = "3";
let black = document.createElement("input");
black.type = "text";
black.id = "black";
black.placeholder = "Nowak, Jan";
tdB.append(black);
tr2.append(tdB);

let tr3 = document.createElement("tr");
let ignoreColorLabel = document.createElement("td");
ignoreColorLabel.innerText = "ignoruj kolory";
ignoreColorLabel.style.width = ignoreColorLabel.innerText.length * 1.5 + "ch";
tr3.append(ignoreColorLabel);
let tdIC = document.createElement("td");
tdIC.colSpan = "3";
let ignoreColor = document.createElement("input");
ignoreColor.id = "ignoreColor";
ignoreColor.type = "checkbox";
tdIC.append(ignoreColor);
tr3.append(tdIC);

let tr4 = document.createElement("tr");
let minYearLabel = document.createElement("td");
minYearLabel.innerText = "lata:";
tr4.append(minYearLabel);
let tdMinY = document.createElement("td");
tdMinY.style.display = "flex";
tdMinY.style.justifyContent = "flex-end";
let minYear = document.createElement("input");
minYear.type = "number";
minYear.id = "minYear";
minYear.step = 1;
minYear.min = 1475;
minYear.style.width = "4em";
let date = new Date();
minYear.max = date.getFullYear();
tdMinY.append(minYear);
tr4.append(tdMinY);

let maxYearLabel = document.createElement("td");
maxYearLabel.innerText = " - ";
tr4.append(maxYearLabel);
let tdMax = document.createElement("td");
tdMax.style.display = "flex";
tdMax.style.justifyContent = "flex-start";
let maxYear = document.createElement("input");
maxYear.type = "number";
maxYear.id = "maxYear";
maxYear.step = 1;
maxYear.style.width = "4em";
maxYear.min = 1475;
maxYear.max = date.getFullYear();
tdMax.append(maxYear);
tr4.append(tdMax);

let tr5 = document.createElement("tr");
let eventLabel = document.createElement("td");
eventLabel.innerText = "turniej:";
tr5.append(eventLabel);
let tdE = document.createElement("td");
tdE.colSpan = "3";
let events = document.createElement("input");
events.id = "event";
events.type = "text";
tdE.append(events);
tr5.append(tdE);

let tr6 = document.createElement("tr");
let ECO_letters = ["A", "B", "C", "D", "E"];
let select1Label = document.createElement("td");
select1Label.innerText = "ECO:";
tr6.append(select1Label);
let tdS1 = document.createElement("td");
tdS1.style.display = "flex";
tdS1.style.justifyContent = "flex-end";
let select1 = document.createElement("select");
select1.id = "select1";
tdS1.append(select1);
tr6.append(tdS1);

let select2Label = document.createElement("td");
select2Label.innerText = " - ";
tr6.append(select2Label);
let tdS2 = document.createElement("td");
tdS2.style.display = "flex";
tdS2.style.justifyContent = "flex-start";
let select2 = document.createElement("select");
select2.id = "select2";
tdS2.append(select2);
tr6.append(tdS2);

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

let tr7 = document.createElement("tr");
let baseLabel = document.createElement("td");
baseLabel.innerText = "baza:";
tr7.append(baseLabel);
let radioB1Label = document.createElement("td");
radioB1Label.innerText = "Polska ";
let radioB1 = document.createElement("input");
radioB1.type = "radio";
radioB1.checked = true;
radioB1.id = "radioB1";
radioB1.name = "base";
radioB1Label.append(radioB1);
tr7.append(radioB1Label);
let radioB2Label = document.createElement("td");
radioB2Label.colSpan = "2";
radioB2Label.innerText = " całość ";
let radioB2 = document.createElement("input");
radioB2.type = "radio";
radioB2.id = "radioB2";
radioB2.name = "base";
radioB2Label.append(radioB2);
tr7.append(radioB2Label);

let tr8 = document.createElement("tr");
let searchingLabel = document.createElement("td");
searchingLabel.innerText = "wyszukiwanie";
searchingLabel.style.width = searchingLabel.innerText.length * 1.5 + "ch";
tr8.append(searchingLabel);
let radioS1Label = document.createElement("td");
radioS1Label.innerText = "zwykłe";
let radioS1 = document.createElement("input");
radioS1.type = "radio";
radioS1.checked = true;
radioS1.id = "radioS1";
radioS1.name = "searching";
radioS1Label.append(radioS1);
tr8.append(radioS1Label);
let radioS2Label = document.createElement("td");
radioS2Label.innerText = "dokładne";
radioS2Label.colSpan = "2";
let radioS2 = document.createElement("input");
radioS2.type = "radio";
radioS2.name = "searching";
radioS2.id = "radioS2";
radioS2Label.append(radioS2);
tr8.append(radioS2Label);

let tr9 = document.createElement("tr");
let thB = document.createElement("th");
thB.colSpan = "4";
let button = document.createElement("button");
button.innerText = "szukaj";
thB.append(button);
tr9.append(thB);
tr9.style.height = "4em";

button.onclick = () => {
  let white = document.getElementById("white");
  let black = document.getElementById("black");
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
    if (white.value.trim() == "" && black.value.trim() == "") {
      alert("Nie podano gracza do wyszukiwania");
    } else if (year1.value > year2.value) {
      alert("Podano zły zakres lat");
    } else if (parseInt(eco1.value, 16) > parseInt(eco2.value, 16)) {
      alert("Podano zły zakres kodów eco");
    } else {
      search(
        white.value.trim(),
        black.value.trim(),
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

for (let i = 1; i <= 9; i++) {
  eval("table.append(tr" + i + ")");
}

content.append(table);

window.onkeydown = (e) => {
  if (e.which == 13) {
    let white = document.getElementById("white");
    let black = document.getElementById("black");
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
      if (white.value.trim() == "" && black.value.trim() == "") {
        alert("Nie podano gracza do wyszukiwania");
      } else if (year1.value > year2.value) {
        alert("Podano zły zakres lat");
      } else if (parseInt(eco1.value, 16) > parseInt(eco2.value, 16)) {
        alert("Podano zły zakres kodów eco");
      } else {
        search(
          white.value.trim(),
          black.value.trim(),
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
