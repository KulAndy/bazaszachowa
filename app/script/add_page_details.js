const LINKS = document.getElementsByTagName("a");

for (let i = 0; i < LINKS.length; i++) {
  if (LINKS[i].href == location.href.split("?")[0]) {
    LINKS[i].parentElement.classList.add("active");
  }
}

let addresses = document.getElementsByTagName("address");
addresses[addresses.length - 1].innerHTML += " " + new Date().getFullYear();
