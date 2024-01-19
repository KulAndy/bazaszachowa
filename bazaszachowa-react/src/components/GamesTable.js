import React from "react";
import { Link } from "react-router-dom";

import { NOMENU_URLS } from "../settings";
const GamesTable = ({ games, base = "all", noEmpty = false }) => {
  if (noEmpty && (!games || games.length === 0)) {
    return <></>;
  }
  let items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

  const download = (games) => {
    let pgn = "";
    for (const game of games) {
      pgn += game2pgn(game);
    }

    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "games.pgn";
    link.click();

    URL.revokeObjectURL(url);
  };

  const game2pgn = (game) =>
    `[Event "${game.Event}"]
[Site "${game.Site}"]
[Date "${game.Year}.${game.Month || "??"}.${game.Month || "??"}"]
[Round "${game.Round}"]
[White "${game.White}"]
[Black "${game.Black}"]
[Result "${game.Result}"]
[ECO "${game.ECO}"]
[WhiteElo "${game.WhiteElo || 0}"]
[BlackElo "${game.BlackElo || 0}"]

${game.moves}

`;

  return (
    <table id="games">
      <caption>
        Znalezionych gier: {games.length || 0}{" "}
        <button
          onClick={() => {
            download(items);
          }}
        >
          Pobierz
        </button>
      </caption>
      <tr>
        <th className="not_mobile">Elo białego</th>
        <th>Biały</th>
        <th style={{ whiteSpace: "nowrap" }}>Wynik</th>
        <th>Czarny</th>
        <th className="not_mobile">Elo czarnego</th>
        <th className="not_mobile">Turniej</th>
        <th>Data</th>
        <th className="not_mobile" style={{ whiteSpace: "nowrap" }}>
          ECO
        </th>
        <th>
          Zobacz
          <br />
          partię
        </th>
        <th className="not_mobile">RAW</th>
      </tr>
      {items.map((item) => (
        <tr>
          <td class="not_mobile">{item.WhiteElo}</td>
          <td>{item.White}</td>
          <td style={{ textAlign: "center" }}>{item.Result}</td>
          <td>{item.Black}</td>
          <td class="not_mobile">{item.BlackElo}</td>
          <td class="not_mobile">{item.Event}</td>
          <td>
            {item.Year}.{item.Month || "??"}.{item.Day || "??"}
          </td>
          <td class="not_mobile">{item.ECO}</td>
          <td>
            <button>
              <Link
                to={`${NOMENU_URLS.game}${base}/${item.id}`}
                state={{
                  base,
                  gameid: item.id,
                  list: items.map((elem) => elem.id),
                }}
              >
                zobacz
              </Link>
            </button>
          </td>
          <td class="not_mobile">
            <button>
              <a href={`${NOMENU_URLS.game_raw}${base}/${item.id}`}>zobacz</a>
            </button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default GamesTable;
