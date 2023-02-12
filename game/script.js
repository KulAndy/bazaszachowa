"use strict";
var gameMoves;
var mode;
window.onload = async () => {
  console.log(request);
  while (!request) {
    window.setTimeout(function () {}, 1000);
  }
  let current = parseInt(request.current);
  let list;
  if (typeof request.list == "string") list = request.list.split(",");
  else list = request.list;
  let base = request.base;
  await search(list[current], base, list, current);
};
