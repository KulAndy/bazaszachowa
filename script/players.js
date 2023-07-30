import DISPLAY from "./display_functions.js";

let searchbar = document.getElementById("name");
searchbar.oninput = () => {
  DISPLAY.update_data_list("name", "players");
};
