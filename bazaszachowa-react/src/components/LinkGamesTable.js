import React from "react";
import { Link } from "react-router-dom";

import { NOMENU_URLS } from "../settings";
import { Chess } from "chess.js";
const LinkGamesTable = ({ games, base = "all", noEmpty = false, ...props }) => {
  if (!games && (!games || noEmpty || games.length === 0)) {
    return <></>;
  }

  const items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

  const game2pgn = (game) => {
    return new Promise((resolve, reject) => {
      try {
        let pgn = `[Event "${game.Event}"]
[Site "${game.Site}"]
[Date "${game.Year}.${game.Month || "??"}.${game.Month || "??"}"]
[Round "${game.Round}"]
[White "${game.White}"]
[Black "${game.Black}"]
[Result "${game.Result}"]
[ECO "${game.ECO}"]
[WhiteElo "${game.WhiteElo || 0}"]
[BlackElo "${game.BlackElo || 0}"]

`;
        const chess = new Chess();

        for (let i = 0; i < game.moves.length; i++) {
          const doneMove = chess.move(game.moves[i]);
          if (i % 2 === 0) {
            pgn += `${i / 2 + 1}. ${doneMove.san} `;
          } else {
            pgn += `${doneMove.san} `;
          }
        }
        pgn += game.Result
        resolve(pgn);
      } catch (error) {
        reject(error);
      }
    });
  };

  const download = async (games) => {
    const pgn = (await Promise.all(games.map((item) => game2pgn(item)))).join(
      "\n\n"
    );

    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "games.pgn";
    link.click();

    URL.revokeObjectURL(url);
  };

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
          <Link
            style={{ display: "contents" }}
            to={`${NOMENU_URLS.game}${base}/${item.id}`}
            state={{
              base,
              gameid: item.id,
              list: items.map((elem) => elem.id),
            }}
          >
            <tr>
              <td>{item.White}</td>
              <td style={{ textAlign: "center" }}>{item.Result}</td>
              <td>{item.Black}</td>
              <td>{item.Year}</td>
            </tr>
          </Link>
        ))}
      </table>
    </div>
  );
};
export default LinkGamesTable;
