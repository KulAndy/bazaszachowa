window.onload = async () => {
  let params = new URLSearchParams(location.search);
  request = {
    fullname: params.get("fullname"),
    color: params.get("color"),
    opening: params.get("opening"),
  };
  loadStats();
  loadCrData();
  designateMinMaxYearElo();
  request.color == undefined
    ? loadGames()
    : filter(request.fullname, request.color, request.opening);
  document.getElementById(
    "graph"
  ).src = `/API/graph.php?name=${encodeURIComponent(
    request.fullname
  )}&base=all`;
};
