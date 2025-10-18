/* eslint-disable perfectionist/sort-objects */

const URLS = {
  home: { name: "menu.home", url: "/" },
  players: { name: "menu.players", url: "/players/" },
  search: { name: "menu.games", url: "/search/" },
  preparation: { name: "menu.preparation", url: "/preparation/" },
  license: { name: "menu.license", url: "/license/" },
  rodo: { name: "menu.gdpr", url: "/rodo/" },
  contact: { name: "menu.contact", url: "/contact/" },
  downloads: { name: "download", url: "/downloads/" },
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
