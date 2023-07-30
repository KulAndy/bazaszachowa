"use strict";
import GENERIC from "./generic_functions.js";
import SETTINGS from "./settings.js";

export default {
  async games(
    white,
    black,
    ignore = true,
    minYear = "",
    maxYear = "",
    events = "",
    minEco = 1,
    maxEco = 500,
    base = "all",
    searching = "classic"
  ) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.games.normal, true);
      white = GENERIC.replaceNationalCharacters(white);
      black = GENERIC.replaceNationalCharacters(black);
      events = GENERIC.replaceNationalCharacters(events);
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
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      };
      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
      try {
        let games = document.getElementById("games");
        games.innerHTML = "";
      } catch {}

      try {
        let loading = document.getElementById("loading");

        loading.style.display = "block";
        xhttp2.onloadend = function () {
          loading.style.display = "none";
        };
      } catch {}
    });
  },
  async players(player, base = "all") {
    return new Promise((resolve, reject) => {
      if (player.length > 3) {
        const xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", SETTINGS.API.players, true);
        let messenge = "name=" + encodeURIComponent(player) + "&base=" + base;
        xhttp2.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            try {
              let json = JSON.parse(this.responseText);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          }
        };

        xhttp2.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp2.send(messenge);
      }
    });
  },
  async min_max_year_elo(fullname) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.extremes, true);
      let messenge = "name=" + encodeURIComponent(fullname) + "&base=all";
      xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      };

      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
    });
  },
  async cr_data(fullname) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.cr, true);
      let messenge = "name=" + encodeURIComponent(fullname);
      xhttp2.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            if (document.getElementById("maxElo")) {
              json = json.filter((elem) => {
                return elem.fide_id > 0;
              });

              json.forEach((element) => {});
              json.sort((a, b) =>
                GENERIC.categoryToRanking(a.kat) <
                GENERIC.categoryToRanking(b.kat)
                  ? 1
                  : GENERIC.categoryToRanking(b.kat) <
                    GENERIC.categoryToRanking(a.kat)
                  ? -1
                  : 0
              );

              resolve(json);
            }
          } catch (err) {
            reject(err);
          }
        }
      };

      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
    });
  },
  async fide_data(fullname) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.fide, true);
      let messenge = "name=" + encodeURIComponent(fullname);
      xhttp2.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      };

      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
    });
  },
  async player_opening_stats(fullname) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.openings, true);
      let messenge = "name=" + encodeURIComponent(fullname);
      xhttp2.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      };

      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);

      try {
        let stats = document.getElementById("stats_table");
        stats.innerHTML = "";
      } catch {}

      let loading = document.getElementById("loading_stats");
      loading.style.display = "block";
      xhttp2.onloadend = function () {
        loading.style.display = "none";
      };
    });
  },
  async opening_games(player, color, opening = null) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.games.filter, true);
      let messenge =
        "name=" +
        encodeURIComponent(player) +
        "&color=" +
        encodeURIComponent(color);
      if (opening !== null)
        messenge += "&opening=" + encodeURIComponent(opening);

      xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            resolve(json);
            return json.rows;
          } catch (err) {
            reject(err);
          }
        }
      };
      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
    });
  },
  async game(id, table) {
    return new Promise((resolve, reject) => {
      const xhttp2 = new XMLHttpRequest();
      xhttp2.open("POST", SETTINGS.API.game, true);
      let messenge =
        "id=" + encodeURIComponent(id) + "&table=" + encodeURIComponent(table);

      xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            let json = JSON.parse(this.responseText);
            resolve(json);
            return json.rows;
          } catch (err) {
            reject(err);
          }
        }
      };
      xhttp2.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp2.send(messenge);
    });
  },
};
