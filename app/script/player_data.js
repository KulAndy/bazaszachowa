import {
  loadGames,
  loadStats,
  filter,
  loadCrData,
  designateMinMaxYearElo,
} from "./player_data_functions.js";

window.onload = async () => {
  let params = new URLSearchParams(location.search);
  let request = {
    fullname: params.get("fullname"),
    color: params.get("color"),
    opening: params.get("opening"),
  };
  loadCrData(request);
  loadStats(request);
  designateMinMaxYearElo(request);
  request.color == undefined
    ? loadGames(request)
    : filter(request.fullname, request.color, request.opening);
  document.getElementById(
    "graph"
  ).src = `/API/graph_svg?name=${encodeURIComponent(
    request.fullname
  )}&base=all`;
};
