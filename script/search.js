"use strict";
import SETTINGS from "./settings.js";
import DISPLAY from "./display_functions.js";
import SEARCH from "./search_functions.js";

if (window.innerWidth <= 768) {
  document.getElementById("help").removeAttribute("open");
  document.getElementById("content").style.width = "100vw";
  document.getElementById("right_content").style.width = "100vw";
}

window.addEventListener("resize", function () {
  if (window.innerWidth <= 768) {
    document.getElementById("help").removeAttribute("open");
    document.getElementById("content").style.width = "100vw";
    document.getElementById("right_content").style.width = "100vw";
    for (
      let i = 0;
      i < this.document.getElementsByClassName("not_mobile").length;
      i++
    ) {
      this.document.getElementsByClassName("not_mobile")[i].style.visibility =
        "hidden";
    }
  } else {
    document.getElementById("help").open = true;
    document.getElementById("content").style.width = "fit-content";
    document.getElementById("right_content").style.width = "30vw";
    for (
      let i = 0;
      i < this.document.getElementsByClassName("not_mobile").length;
      i++
    ) {
      this.document.getElementsByClassName("not_mobile")[i].style.visibility =
        "visible";
    }
  }
});

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
  validate();
};

async function validate() {
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
      const RESULT = await SEARCH.games(
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

      DISPLAY.games_list(RESULT.rows, RESULT.table);
    }
  }
}

document.getElementById("white").oninput = () => {
  DISPLAY.update_data_list(
    "white",
    "whitelist",
    document.getElementById("radioB1").checked ? "poland" : "all",
    SETTINGS.API
  );
};
document.getElementById("black").oninput = () => {
  DISPLAY.update_data_list(
    "black",
    "blacklist",
    document.getElementById("radioB1").checked ? "poland" : "all",
    SETTINGS.API
  );
};
