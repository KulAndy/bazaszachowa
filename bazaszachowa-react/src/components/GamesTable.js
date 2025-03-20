import React from "react";
import { Link } from "react-router-dom";

import { NOMENU_URLS } from "../settings";
import { Chess } from "chess.js";

import initWasm from "../wasm/uci2pgn";

let uci2san = null;

initWasm().then((wasm) => {
  uci2san = (movesObj) => {
    const moves = new wasm.VectorString();
    for (let i = 0; i < movesObj.length; i++) {
      let uci = movesObj[i].from + movesObj[i].to;
      if (movesObj[i].promotion) {
        uci += movesObj[i].promotion;
      }
      moves.push_back(uci);
    }
    const san = wasm.convertUciToPgn(moves);
    moves.delete();
    return san;
  };
});

const legacyGame2pgn = (game) => {
  return new Promise((resolve, reject) => {
    try {
      let pgn = "";
      const chess = new Chess();

      for (let i = 0; i < game.moves.length; i++) {
        const doneMove = chess.move(game.moves[i]);
        if (i % 2 === 0) {
          pgn += `${i / 2 + 1}. ${doneMove.san} `;
        } else {
          pgn += `${doneMove.san} `;
        }
      }
      resolve(pgn);
    } catch (error) {
      reject(error);
    }
  });
};

const game2pgn = async (game) => {
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
  try {
    if (uci2san === null) {
      throw new Error("uci2pgn not loaded");
    } else {
      pgn += uci2san(game.moves);
    }
  } catch (error) {
    pgn += legacyGame2pgn(game);
  }
  pgn += game.Result;
  return pgn;
};

const GamesTable = ({ games, base = "all", noEmpty = false }) => {
  if (!games && (!games || noEmpty || games.length === 0)) {
    return <></>;
  }

  const items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

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
        <th className="not_mobile" />
      </tr>
      {items.map((item) => (
        <tr>
          <Link
            to={`${NOMENU_URLS.game}${base}/${item.id}`}
            state={{
              base,
              gameid: item.id,
              list: items.map((elem) => elem.id),
            }}
            style={{ display: "contents" }}
          >
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
          </Link>
          <td class="not_mobile">
            <Link
              to={`${NOMENU_URLS.game_raw}${base}/${item.id}`}
              style={{ whiteSpace: "nowrap" }}
            >
              PGN
            </Link>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default GamesTable;
