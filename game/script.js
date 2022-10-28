"use strict";
var gameMoves;
var mode;
window.onload = async () => {
  while (!request) {
    window.setTimeout(function () {}, 1000);
  }
  let id = request.id;
  let table = request.table;
  await searchGame(
    table,
    id,
    request.white,
    request.black,
    request.ignore,
    request.minYear,
    request.maxYear,
    request.events,
    request.minEco,
    request.maxEco,
    request.base,
    request.searching
  );
};
