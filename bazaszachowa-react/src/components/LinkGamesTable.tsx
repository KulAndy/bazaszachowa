import { Chess } from "chess.js";
import React, { HTMLProps } from "react";
import { Link } from "react-router-dom";

import { GameData } from "../ChessEditor";
import { useI18n } from "../i18n/I18nContext";
import { NOMENU_URLS } from "../settings";
import initWasm from "../wasm/uci2pgn";

import { GamesTableProperties } from "./GamesTable";

let uci2san: ((x: GameData["moves"]) => string) | null = null;

// eslint-disable-next-line unicorn/prefer-top-level-await
initWasm().then((wasm) => {
  uci2san = (movesObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const moves = new wasm.VectorString();
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (const element of movesObject) {
      let uci = element.from + element.to;
      if (element.promotion) {
        uci += element.promotion;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      moves.push_back(uci);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const san = wasm.convertUciToPgn(moves);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    moves.delete();
    return san as string;
  };
});

const legacyGame2pgn = (game: GameData) => {
  return new Promise((resolve, reject) => {
    try {
      let pgn = "";
      const chess = new Chess();

      for (let index = 0; index < game.moves.length; index++) {
        const doneMove = chess.move(game.moves[index]);
        if (!doneMove) {
          break;
        }
        pgn +=
          index % 2 === 0
            ? `${index / 2 + 1}. ${doneMove.san} `
            : `${doneMove.san} `;
      }
      resolve(pgn);
    } catch (error) {
      reject(error);
    }
  });
};

const game2pgn = async (game: GameData) => {
  let pgn = `[Event "${game.Event || "?"}"]
[Site "${game.Site || "?"}"]
[Date "${game.Year || "????"}.${game.Month || "??"}.${game.Month || "??"}"]
[Round "${game.Round || "?"}"]
[White "${game.White}"]
[Black "${game.Black}"]
[Result "${game.Result || "*"}"]
[ECO "${game.ECO || "?"}"]
[WhiteElo "${game.WhiteElo || 0}"]
[BlackElo "${game.BlackElo || 0}"]

`;
  try {
    if (uci2san === null) {
      throw new Error("uci2pgn not loaded");
    } else {
      pgn += uci2san(game.moves);
    }
  } catch {
    pgn += await legacyGame2pgn(game);
  }
  pgn += game.Result;
  return pgn;
};

const download = async (games: GameData[] | null) => {
  if (!games) {
    return;
  }
  const pgnStrings = await Promise.all(games.map((item) => game2pgn(item)));
  const pgn = pgnStrings.join("\n\n");

  const blob = new Blob([pgn], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "games.pgn";
  link.click();

  URL.revokeObjectURL(url);
};

const LinkGamesTable: React.FC<
  GamesTableProperties & HTMLProps<HTMLDivElement>
> = ({ base = "all", games, noEmpty = false, ...properties }) => {
  const { t } = useI18n();
  if (!games || (noEmpty && games.length === 0)) {
    return <></>;
  }

  const items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

  return (
    <div {...properties}>
      <table id="games">
        <caption>
          {t("game_table.games")}: {games.length || 0}{" "}
          <button
            onClick={() => {
              download(items);
            }}
          >
            {t("download")}
          </button>
        </caption>
        <tr>
          <th>{t("white")}</th>
          <th style={{ whiteSpace: "nowrap" }}>{t("result")}</th>
          <th>{t("black")}</th>
          <th>{t("year")}</th>
        </tr>
        {items.map((item) => (
          <Link
            key={item.id}
            state={{
              base,
              gameid: item.id,
              list: items.map((element) => element.id),
            }}
            style={{ display: "contents" }}
            to={`${NOMENU_URLS.game}${base}/${item.id}`}
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
