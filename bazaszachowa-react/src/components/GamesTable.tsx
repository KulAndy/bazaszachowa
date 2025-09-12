import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Chess } from "chess.js";
import { type HTMLProps, useCallback } from "react";
import { Link } from "react-router-dom";

import type { GameData } from "../ChessEditor";
import { useI18n } from "../context/useI18n";
import { NOMENU_URLS } from "../settings";
import initWasm from "../wasm/uci2pgn";

let uci2san: ((x: GameData["moves"]) => string) | null = null;

// eslint-disable-next-line unicorn/prefer-top-level-await
initWasm().then((wasm) => {
  uci2san = (movesObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const moves = new wasm.VectorString();

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

const legacyGame2pgn: (x: GameData) => Promise<string> = (game: GameData) => {
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
    } catch {
      reject(new Error("unkown error"));
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

export interface GamesTableProperties {
  readonly base?: string;
  readonly games: GameData[] | null;
  readonly noEmpty?: boolean;
  readonly simple?: boolean;
}

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

const GamesTable: React.FC<
  GamesTableProperties & HTMLProps<HTMLDivElement>
> = ({
  base = "all",
  games,
  noEmpty = false,
  simple = false,
  ...properties
}) => {
  const { t } = useI18n();
  const handleDownload = useCallback(() => {
    download(games);
  }, [games]);
  if (!games || (noEmpty && games.length === 0)) {
    return null;
  }

  const items = games.map((game, index) => ({
    ...game,
    key: index,
  }));

  return (
    <div {...properties}>
      <TableContainer component={Paper}>
        <Table>
          <caption>
            {t("game_table.games")}: {games.length || 0}{" "}
            <button onClick={handleDownload}>{t("download")}</button>
          </caption>
          <TableHead>
            <TableRow>
              {!simple && (
                <TableCell className="desktop">{t("white_elo")}</TableCell>
              )}
              <TableCell>{t("white")}</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" } as const}>
                {t("result")}
              </TableCell>
              <TableCell>{t("black")}</TableCell>
              {!simple && (
                <>
                  <TableCell className="desktop">{t("black_elo")}</TableCell>
                  <TableCell className="desktop">{t("tournament")}</TableCell>
                </>
              )}
              <TableCell>{t("date")}</TableCell>
              {!simple && (
                <>
                  <TableCell
                    className="desktop"
                    style={{ whiteSpace: "nowrap" } as const}
                  >
                    ECO
                  </TableCell>
                  <TableCell className="desktop" />
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                sx={
                  {
                    bgcolor: () =>
                      index % 2 === 0 ? "var(--even-row)" : "var(--odd-row)",
                  } as const
                }
              >
                <Link
                  state={
                    {
                      base,
                      gameid: item.id,
                      list: items.map((element) => element.id),
                    } as const
                  }
                  style={{ display: "contents" } as const}
                  to={`${NOMENU_URLS.game}${base}/${item.id}`}
                >
                  {!simple && (
                    <TableCell className="desktop">{item.WhiteElo}</TableCell>
                  )}
                  <TableCell>{item.White}</TableCell>
                  <TableCell style={{ textAlign: "center" } as const}>
                    {item.Result}
                  </TableCell>
                  <TableCell>{item.Black}</TableCell>
                  {!simple && (
                    <>
                      <TableCell className="desktop">{item.BlackElo}</TableCell>
                      <TableCell className="desktop">{item.Event}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {item.Year}.{item.Month || "??"}.{item.Day || "??"}
                  </TableCell>
                  {!simple && (
                    <TableCell className="desktop">{item.ECO}</TableCell>
                  )}
                </Link>
                {!simple && (
                  <TableCell className="desktop">
                    <Link
                      reloadDocument
                      style={{ whiteSpace: "nowrap" } as const}
                      target="_blank"
                      to={`${NOMENU_URLS.game_raw}${base}/${item.id}`}
                    >
                      PGN
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GamesTable;
