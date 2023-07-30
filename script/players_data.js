import SEARCH from "./search_functions.js";
import DISPLAY from "./display_functions.js";
import SETTINGS from "./settings.js";

window.onload = () => {
  const BODY = get_data();
  const FULLNAME = BODY.fullname;
  const COLOR = BODY.color || null;
  const OPENING = BODY.opening || null;
  document.getElementById("graph").src = `${
    SETTINGS.API.graph.svg
  }?name=${encodeURIComponent(FULLNAME)}&base=all`;
  load_games(FULLNAME, COLOR, OPENING);
  load_opening_stats(FULLNAME);
  load_min_max_year_elo(FULLNAME);
  load_cr_data(FULLNAME);
  load_fide_data(FULLNAME);
};

const load_games = async (fullname, color = null, opening = null) => {
  if (color === null) {
    const GAMES = await SEARCH.games(fullname, "");
    DISPLAY.games_list(GAMES.rows, GAMES.table);
  } else {
    const GAMES = await SEARCH.opening_games(fullname, color, opening);
    DISPLAY.games_list(GAMES, "all");
  }
};

const load_min_max_year_elo = async (fullname) => {
  const STATS = await SEARCH.min_max_year_elo(fullname);
  DISPLAY.min_max_year_elo(STATS);
};

const load_cr_data = async (fullname) => {
  const DATA = await SEARCH.cr_data(fullname);
  if (DATA.length > 0) {
    await DISPLAY.cr_data("cr-data-container", DATA[0], true);
    if (DATA.length > 1) {
      let info = document.getElementById("cr-data-container");
      let ambigousAlert = document.createElement("h3");
      ambigousAlert.id = "ambigousAlert";
      ambigousAlert.innerHTML =
        "<span style='color:red;'>UWAGA: Znaleziono więcej niż jednego zawodnika o tym nazwisku</span>\
          <br />najbardziej prawdopodobne:";
      document
        .getElementById("data-container")
        .parentElement.insertBefore(
          ambigousAlert,
          document.getElementById("data-container")
        );

      let ambigous = document.createElement("details");
      ambigous.id = "ambigous";
      let description = document.createElement("summary");
      description.innerText = "inni znalezieni";
      ambigous.append(description);
      info.append(ambigous);
      for (let i = 1; i < DATA.length; i++) {
        await DISPLAY.cr_data("ambigous", DATA[i]);
      }
    }
  }
};

const load_fide_data = async (fullname) => {
  const DATA = await SEARCH.fide_data(fullname);
  DISPLAY.fide_data(DATA);
};

const load_opening_stats = async (fullname) => {
  const STATS = await SEARCH.player_opening_stats(fullname);
  DISPLAY.opening_stats(STATS, fullname);
};
