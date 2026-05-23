/* eslint-disable perfectionist/sort-objects */

const URLS = {
  home: { name: "menu.home", url: "/" },
  players: { name: "menu.players", url: "/players/" },
  search: { name: "menu.games", url: "/search/" },
  preparation: { name: "menu.preparation", url: "/preparation/" },
  license: { name: "menu.license", url: "/license/" },
  pzszach_calculator: {
    name: "menu.pzszach_calculator",
    url: "/pzszach_calculator/",
  },
  rodo: { name: "menu.gdpr", url: "/rodo/" },
  contact: { name: "menu.contact", url: "/contact/" },
  downloads: { name: "download", url: "/downloads/" },
  upload_games: { name: "menu.upload_games", url: "/upload_games/" },
};
const API = {
  base_download: "/download/",
  BASE_URL: "https://api.bazaszachowa.smallhost.pl",
  cr: "/player/cr/",
  dumps: "/base/dumps",
  extremes: "/player/limit/",
  fide: "/player/fide/",
  game: "/game/",
  games: {
    filter: "/games/opening/",
    normal: "/games/",
  },
  graph: "/player/plot/",
  openings: "/player/openings/",
  players: "/players/",
  send_mail: "/mail/send",
  poland_tournaments: "/player/tournaments/poland/",
  fide_tournaments: "/player/tournaments/fide/",
  upload_games: {
    upload: "/games/upload",
    verification: "/games/upload/get-code",
  },
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
