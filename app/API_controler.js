const base = require("./base");
const resources = require("./resources");
const DRAWER = require("./drawing");

const APIControler = async (request, response) => {
  const data = await resources.RequestData(request);
  switch (request.method) {
    case "GET":
      switch (true) {
        case /\/API\/graph/.test(request.url):
          let elo_history = await base.elo_history(data.name);
          //   const image = await DRAWER.eloJPEG(elo_history, data.name);
          //   resources.sendImage(response, image, "jpeg");
          const image = await DRAWER.eloSVG(elo_history, data.name);
          resources.sendImage(response, image, "svg+xml");

          break;

        default:
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.write(JSON.stringify(data));
          response.end();
          break;
      }

      break;

    case "POST":
      switch (request.url) {
        case "/API/search_game":
          let games = await base.search_games(data);
          resources.sendJSON(response, { rows: games, base: data.base });
          break;
        case "/API/get_game":
          let game = await base.getGame(data.id, data.base);
          resources.sendJSON(response, { rows: game });
          break;
        case "/API/player_opening_stats":
          let stats = await base.player_opening_stats(data.name);
          resources.sendJSON(response, stats);
          break;
        case "/API/search_player_opening_game":
          let gamesFilterd = await base.search_player_opening_game(
            data.player,
            data.color,
            data.opening
          );
          resources.sendJSON(response, gamesFilterd);
          break;
        case "/API/cr_data":
          let page = (await resources.cr_data(data.name)).toString();
          let pattern =
            /<tr>(<td.*>.*<\/td>)+(.*pers_id.*).*(<td.*>.*<\/td>)+<\/tr>/gim;
          let players = page.match(pattern).filter((n) => n);
          let dirt = /<\/?t[rd]>|<a [a-z=".?_0-9&]+>|<sup>.*<\/sup>|<\/a>/gim;
          let spliRegex = /<td [a-z=".?_0-9&-:; ]+>/gi;
          let playersDetails = [];
          for (let i = 0; i < players.length; i++) {
            players[i] = players[i].replace(dirt, "");
            let playerData = players[i].split(spliRegex).slice(1);
            playersDetails.push({
              id: playerData[1],
              kat: playerData[2],
              fide_id: playerData[3],
              name: playerData[5],
            });
          }

          resources.sendJSON(response, playersDetails);
          break;
        case "/API/min_max_year_elo":
          let min_max_year_elo = await base.min_max_year_eco(
            data.name,
            data.base
          );
          resources.sendJSON(response, min_max_year_elo[0]);
          break;
        case "/API/search_player":
          let players_options = await base.searchPlayer(data.player, data.base);
          resources.sendJSON(response, players_options);
          break;

        default:
          resources.sendJSON(response, data);
          break;
      }
      break;

    default:
      resources.sendJSON(response, data);
      break;
  }
};

module.exports = APIControler;
