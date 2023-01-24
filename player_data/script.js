window.onload = async () => {
  if (request.color == undefined) {
    loadGames();
  } else {
    filter(request.fullname, request.color, request.opening);
  }
  loadStats();
  loadCrData();
};
