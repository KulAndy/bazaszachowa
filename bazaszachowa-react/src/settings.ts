/* eslint-disable perfectionist/sort-objects */
const URLS = {
  home: { name: "strona główna", url: "/" },
  players: { name: "wyszukiwarka graczy", url: "/players/" },
  search: { name: "wyszukiwarka partii", url: "/search/" },
  preparation: { name: "przygotowanie", url: "/preparation/" },
  license: { name: "licencja", url: "/license/" },
  rodo: { name: "dla fanów rodo", url: "/rodo/" },
  contact: { name: "kontakt", url: "/contact/" },
  downloads: { name: "pobierz", url: "/downloads/" },
};
const API = {
  base_download: "/download/",
  BASE_URL: "https://api.bazaszachowa.smallhost.pl",
  cr: "/cr_data/",
  dumps: "/base-dumps",
  extremes: "/min_max_year_elo/",
  fide: "/fide_data/",
  game: "/game/",
  games: {
    filter: "/search_player_opening_game/",
    normal: "/search_game/",
  },
  graph: "/graph/",
  openings: "/player_opening_stats/",
  players: "/search_player/",
  send_mail: "/send-email",
};
const NOMENU_URLS = {
  activation: "/activation/",
  bug: "/bug/",
  docs: "/doc/",
  game: "/game/",
  game_raw: "/game_raw/",
  profile: "/player_data/",
};
const admin_mail = "andykrk22@gmail.com";

const SETTINGS = {
  admin_mail,
  API,
  NOMENU_URLS,
  URLS,
};

export default SETTINGS;

export { admin_mail, API, NOMENU_URLS, URLS };
