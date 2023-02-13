window.onload = async () => {
  let params = new URLSearchParams(location.search);
  request = {
    fullname: params.get("fullname"),
    color: params.get("color"),
    opening: params.get("opening"),
  };
  if (request.color == undefined) {
    loadGames();
  } else {
    filter(request.fullname, request.color, request.opening);
  }
  loadStats();
  loadCrData();
  designateMinMaxYearElo();
};
