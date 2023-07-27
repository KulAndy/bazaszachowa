"use strict";

var gameMoves;
var mode;
window.onload = async () => {
  while (!request) {
    window.setTimeout(function () {}, 1000);
  }
  let current = parseInt(request.current);
  let list;
  if (typeof request.list == "string") {
    list = request.list.split(",");
  } else if (request.list == undefined) {
    list = [request.id];
    current = 0;
  } else list = request.list;
  let base = request.base;

  await game_searching.search(list[current], base, list, current);
};
