import { Chess } from "chess.js";

import type { GameData } from "../ChessEditor";

import { type FenData, firstBatchLimit } from ".";

const cutStringToPenultimateSpace = (input: string) => {
  const lastSpace = input.lastIndexOf(" ");
  return input.slice(0, Math.max(0, input.lastIndexOf(" ", lastSpace - 1)));
};

function processGameSecondBatch(
  row: GameData,
  fensObject: Record<string, FenData>,
) {
  const chess = new Chess();
  // eslint-disable-next-line sonarjs/no-nested-conditional
  const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
  const year = row.Year!;

  for (let index = 0; index < row.moves.length; index++) {
    const move = row.moves[index];

    if (index < firstBatchLimit) {
      chess.move(move);
      continue;
    }

    const fen = cutStringToPenultimateSpace(chess.fen());
    const done = chess.move(move);
    if (!done) {
      continue;
    }

    const sidePoints = index % 2 === 0 ? points : 1 - points;

    const fenData = fensObject[fen] ?? { indexes: [], moves: {} };
    const moveData = fenData.moves[done.san] ?? {
      games: 0,
      points: 0,
      stats: {},
      years: [],
    };

    moveData.games++;
    moveData.points += sidePoints;
    moveData.years.push(year);

    const stat = moveData.stats[year] ?? { count: 0, points: 0 };
    stat.count++;
    stat.points += sidePoints;
    moveData.stats[year] = stat;

    fenData.moves[done.san] = moveData;
    fenData.indexes.push(row.id);
    fensObject[fen] = fenData;
  }

  return fensObject;
}

// eslint-disable-next-line unicorn/prefer-add-event-listener
globalThis.onmessage = (event: MessageEvent) => {
  const { games } = event.data as { games: GameData[] };

  let fensObject: Record<string, FenData> = {};

  for (const game of games) {
    fensObject = processGameSecondBatch(game, fensObject);
  }

  globalThis.postMessage(fensObject);
};
