const URLS = {
    home: { name: "strona g\u0142\u00f3wna", url: "/" },
    players: { name: "wyszukiwarka graczy", url: "/players/" },
    search: { name: "wyszukiwarka partii", url: "/search/" },
    preparation: { name: "przygotowanie", url: "/preparation/" },
    license: { name: "licencja", url: "/license/" },
    rodo: { name: "dla fan\u00f3w rodo", url: "/rodo/" },
    contact: { name: "kontakt", url: "/contact/" },
};
const API = {
    cr: "/cr_data/",
    fide: "/fide_data/",
    game: "/game/",
    graph: "/graph/",
    extremes: "/min_max_year_elo/",
    openings: "/player_opening_stats/",
    games: {
        normal: "/search_game/",
        filter: "/search_player_opening_game/",
    },
    players: "/search_player/",
    send_mail: "/send-email",
    BASE_URL: "https://api.bazaszachowa.smallhost.pl",
};
const NOMENU_URLS = {
    game: "/game/",
    game_raw: "/game_raw/",
    profile: "/player_data/",
    activation: "/activation/",
    bug: "/bug/",
    docs: "/doc/"
};
const admin_mail = "andykrk22@gmail.com";

const SETTINGS = {
    URLS,
    API,
    NOMENU_URLS,
    admin_mail,
};

export default SETTINGS;

export { URLS, API, NOMENU_URLS, admin_mail };
