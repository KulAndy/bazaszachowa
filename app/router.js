const APIControler = require("./API_controler");
const RESOURCE = require("./resources");
const BASE = require("./base");
const SETTINGS = require("./settings");
const MAILER = require("./mail_sender");

const ROUTER = async (request, response) => {
  try {
    if (/^\/API\//.test(request.url)) {
      await APIControler(request, response);
    } else {
      switch (request.method) {
        case "GET":
          switch (true) {
            case /^\/css/.test(request.url):
              await RESOURCE.sendFile(response, request.url, "text/css");
              break;
            case /^\/script/.test(request.url):
              await RESOURCE.sendFile(
                response,
                request.url,
                "application/javascript"
              );
              break;
            case request.url == "/":
              await RESOURCE.sendFileWithHeader(
                response,
                null,
                "/views/index.html",
                null
              );
              break;
            case /^\/license\/?/.test(request.url):
              await RESOURCE.sendFileWithHeader(
                response,
                null,
                "/views/license.html",
                null
              );
              break;
            case /^\/rodo\/?/.test(request.url):
              await RESOURCE.sendFileWithHeader(
                response,
                null,
                "/views/rodo.html",
                null
              );
              break;
            case /^\/search\/?/.test(request.url):
              await RESOURCE.sendFileWithHeader(
                response,
                null,
                "/views/search.html",
                null
              );
              break;
            case /^\/players\/?/.test(request.url):
              let searched = await RESOURCE.RequestData(request);
              if (searched.name) {
                let finded = await BASE.searchPlayer(
                  searched.name,
                  SETTINGS.all_players
                );

                let appendix = `<script defer>
            window.onload = () =>{
                document.getElementById("name").value = '${searched.name}';
            }
                </script>
              `;
                appendix += `<script defer>
            document.getElementById("content").innerHTML += 
              \`<table style='margin: auto;border: 2px solid black'><th>Nazwisko i Imię</th><th>profil</th>`;
                for (let i = 0; i < finded.length; i++) {
                  appendix += `<tr><td>${
                    finded[i]
                  }</td><td><a href='/player_data?fullname=${encodeURIComponent(
                    finded[i]
                  )}'>zobacz</a></tr>
              `;
                }
                appendix += `</table>
                \`;
                </script>
            `;
                await RESOURCE.sendFileWithHeader(
                  response,
                  null,
                  "/views/players.html",
                  appendix
                );
              } else {
                await RESOURCE.sendFileWithHeader(
                  response,
                  null,
                  "/views/players.html",
                  null
                );
              }
              break;
            case /^\/player_data\/?/.test(request.url):
              let playerProfile = await RESOURCE.RequestData(request);

              let prefix = `<link rel="stylesheet" href="/css/player_data.css">
                        `;
              let postfix = `<script defer>
                            document.getElementById("player").innerText = '${playerProfile.fullname}';
                        </script>
                        <script src="/script/player_data_functions.js" defer></script>
                        <script src="/script/player_data.js" defer></script>
                            `;
              await RESOURCE.sendFileWithHeader(
                response,
                prefix,
                "/views/player_data.html",
                postfix
              );
              break;

            case /^\/game_raw\/?/.test(request.url):
              let game_raw_data = await RESOURCE.RequestData(request);
              let game_raw = await BASE.getGame(
                game_raw_data.id,
                game_raw_data.table
              );
              "";
              await RESOURCE.sendPGN(response, game_raw[0]);
              break;
            case /^\/contact\/?/.test(request.url):
              await RESOURCE.sendFileWithHeader(
                response,
                null,
                "/views/contact.html",
                null
              );
              break;

            default:
              await RESOURCE.httpError(response, 404);
              break;
          }
          break;
        case "POST":
          switch (true) {
            case /^\/game\/?/.test(request.url):
              let games = await RESOURCE.RequestData(request);
              await RESOURCE.sendFileWithHeader(
                response,
                `<link rel="stylesheet" href="css/chessicons.css">
           <script>
                let request = ${JSON.stringify(games)};
            </script>
            <script defer src="/script/pgnv.js" type="text/javascript"></script>
            <script defer src="/script/game_display_functions.js"></script>
            <script defer src="/script/game.js"></script>
            `,
                "/views/game.html",
                '<dialog id="dialog"></dialog>'
              );
              break;
            case request.url == "/sendMail":
              await MAILER.send(request, response);
              break;
            default:
              await RESOURCE.httpError(response, 404);
              break;
          }
          break;
      }
    }
  } catch (err) {
    RESOURCE.httpError(response, 500);
    console.log(err);
  }
};

module.exports = ROUTER;
