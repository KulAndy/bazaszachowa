let searchbar = document.getElementById("name");
let datalist = document.getElementById("players");
searchbar.oninput = () => {
  updateDataList();
};

function updateDataList() {
  let player = searchbar.value;
  datalist.innerHTML = "";

  if (player.length > 3) {
    const xhttp2 = new XMLHttpRequest();
    xhttp2.open("POST", "/API/search_player.php", true);
    let messenge = "player=" + encodeURIComponent(player) + "&base=all";
    xhttp2.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          let json = JSON.parse(this.responseText);
          for (finded of json) {
            let option = document.createElement("option");
            option.value = finded.toString();
            datalist.append(option);
          }
        } catch (err) {}
      }
    };

    xhttp2.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xhttp2.send(messenge);
  }
}
