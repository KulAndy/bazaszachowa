window.onload = async () => {
  loadStats();
  if (request.color == undefined) {
    loadGames();
  } else {
    filter(request.fullname, request.color, request.opening);
  }
};
