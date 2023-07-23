"use strict";

var gameMoves;
var mode;
window.onload = async () => {
  while (!request) {
    window.setTimeout(function () {}, 1000);
  }
  console.log(request);
  let current = parseInt(request.current);
  let list;
  if (typeof request.list == "string") {
    list = request.list.split(",");
  } else if (request.list == undefined) {
    list = [request.id];
    current = 0;
  } else list = request.list;
  let base = request.base;
  console.log(list);
    console.log(list == undefined);
    

  await game_searching.search(list[current], base, list, current);
};
