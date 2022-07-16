"use strict";
const load = (files) => {
  let file = files.files[0];

  if (file.type == "application/vnd.chess-pgn" || file.type == "text/plain") {
    let type = document.getElementById("hidden2");
    type.value = file.type;
    let name = document.getElementById("hidden3");
    name.value = file.name;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
      let result = reader.result;
      let hidden = document.getElementById("hidden");
      hidden.value = result;
    };
  }

};

console.log("script");
let file = document.getElementById("file");
file.addEventListener("change", function () {
  load(this);
});
