import React from "react";
import { useNavigate } from "react-router-dom";

import { NOMENU_URLS } from "../settings";
const LinkGamesTable = ({ games, base = "all", noEmpty = false, ...props }) => {
  const navigate = useNavigate();
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
    <div {...props}>
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
          <th>Biały</th>
          <th style={{ whiteSpace: "nowrap" }}>Wynik</th>
          <th>Czarny</th>
          <th>Rok</th>
        </tr>
        {items.map((item) => (
          <tr
            onClick={() => {
              navigate(`${NOMENU_URLS.game}${base}/${item.id}`, {
                state: {
                  base,
                  gameid: item.id,
                  list: items.map((elem) => elem.id),
                },
              });
            }}
          >
            <td>{item.White}</td>
            <td style={{ textAlign: "center" }}>{item.Result}</td>
            <td>{item.Black}</td>
            <td>{item.Year}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default LinkGamesTable;
