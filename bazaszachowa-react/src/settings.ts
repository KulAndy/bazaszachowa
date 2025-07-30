const URLS = {
  contact: { name: "kontakt", url: "/contact/" },
  downloads: { name: "pobierz", url: "/downloads/" },
  home: { name: "strona główna", url: "/" },
  license: { name: "licencja", url: "/license/" },
  players: { name: "wyszukiwarka graczy", url: "/players/" },
  preparation: { name: "przygotowanie", url: "/preparation/" },
  rodo: { name: "dla fanów rodo", url: "/rodo/" },
  search: { name: "wyszukiwarka partii", url: "/search/" },
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
