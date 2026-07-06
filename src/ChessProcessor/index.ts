import { Chess } from "chess.js";

import type { GameData } from "../ChessEditor";
import initWasm from "../wasm/chess_processor";

const cutStringToPenultimateSpace = (inputString: string): string => {
  const lastSpace = inputString.lastIndexOf(" ");
  return inputString.slice(
    0,
    Math.max(0, inputString.lastIndexOf(" ", lastSpace - 1)),
  );
};

export const firstBatchLimit = 40;

export interface FenData {
  indexes: number[];

  moves: Record<string, MoveData>;
}

interface MoveData {
  games: number;
  points: number;

  stats: Record<number, MoveStats>;
  years: number[];
}

interface MoveStats {
  count: number;
  points: number;
}

const processGameFirstBatchLegacy = (
  row: GameData,
): Record<string, FenData> => {
  // eslint-disable-next-line sonarjs/no-nested-conditional
  const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
  const chess = new Chess();
  const fens: Record<string, FenData> = {};
  const year = row.Year!;

  const length = Math.min(firstBatchLimit, row.moves.length);
  for (let index = 0; index < length; index++) {
    const move = row.moves[index];
    const sidePoints = index % 2 === 0 ? points : 1 - points;
    const fen = cutStringToPenultimateSpace(chess.fen());
    const doneMove = chess.move(move);
    if (!doneMove) {
      continue;
    }

    const fenData = fens[fen] ?? {
      indexes: [] as number[],
      moves: {},
    };
    const moveEntry = fenData.moves[doneMove.san] ?? {
      games: 0,
      points: 0,
      stats: {},
      years: [],
    };

    moveEntry.games++;
    moveEntry.points += sidePoints;
    moveEntry.years.push(year);

    const stat = moveEntry.stats[year] ?? { count: 0, points: 0 };
    stat.count++;
    stat.points += sidePoints;
    moveEntry.stats[year] = stat;

    fenData.moves[doneMove.san] = moveEntry;
    fenData.indexes.push(row.id);
    fens[fen] = fenData;
  }

  return fens;
};
let processGameFirstBatchWasm:
  ((row: GameData) => Record<string, FenData>) | null = null;

const processGameFirstBatch = (row: GameData): Record<string, FenData> => {
  try {
    if (processGameFirstBatchWasm === null) {
      throw new Error("function is null");
    }
    return processGameFirstBatchWasm(row);
  } catch {
    return processGameFirstBatchLegacy(row);
  }
};

const mergeResults = (
  fensObject: Record<string, FenData>,
  results: Record<string, FenData>[],
) => {
  for (const result of results) {
    for (const [fen, newFenData] of Object.entries(result)) {
      const fenData = fensObject[fen] ?? {
        indexes: [] as number[],
        moves: {},
      };
      fenData.indexes.push(...newFenData.indexes);

      for (const [move, newMoveData] of Object.entries(newFenData.moves)) {
        const moveData = fenData.moves[move] ?? {
          games: 0,
          points: 0,
          stats: {},
          years: [],
        };

        moveData.games += newMoveData.games;
        moveData.points += newMoveData.points;
        moveData.years.push(...newMoveData.years);

        for (const [year, stat] of Object.entries(newMoveData.stats)) {
          const yearNumber = Number(year);
          const old = moveData.stats[yearNumber] ?? { count: 0, points: 0 };
          old.count += stat.count;
          old.points += stat.points;
          moveData.stats[yearNumber] = old;
        }

        fenData.moves[move] = moveData;
      }

      fensObject[fen] = fenData;
    }
  }
  return fensObject;
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line unicorn/prefer-top-level-await, @typescript-eslint/no-explicit-any
void initWasm().then((wasm: any) => {
  processGameFirstBatchWasm = (row: GameData): Record<string, FenData> => {
    const wasmGame = new wasm.GameData(row.id, row.Result, row.Year);
    const wasmMoves = new wasm.VectorMove();
    for (const move of row.moves) {
      const wasmMove = new wasm.Move(move.from, move.to, move.promotion);
      wasmMoves.push_back(wasmMove);
    }

    wasmGame.moves = wasmMoves;
    const result = wasm.getFENsFirstBatchJS(wasmGame);
    wasmGame.delete();
    wasmMoves.delete();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  };
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

class ChessProcessor {
  public isCompleted = false;
  private fensObj: Record<string, FenData> = {};
  private games: GameData[] = [];

  private worker: null | Worker = null;

  public clear() {
    this.isCompleted = false;
    this.fensObj = {};
    this.games = [];

    this.worker?.terminate();
    this.worker = null;
  }

  public completeTree(): Promise<void> {
    const worker = this.getWorker();

    this.isCompleted = false;

    const batchSize = 50;
    const batches: GameData[][] = [];

    for (let index = 0; index < this.games.length; index += batchSize) {
      batches.push(this.games.slice(index, index + batchSize));
    }

    if (batches.length === 0) {
      this.isCompleted = true;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let batchIndex = 0;

      worker.addEventListener(
        "message",
        (event: MessageEvent<Record<string, FenData>>) => {
          mergeResults(this.fensObj, [event.data]);

          batchIndex++;

          if (batchIndex >= batches.length) {
            this.isCompleted = true;
            resolve();
            return;
          }

          worker.postMessage({
            games: batches[batchIndex],
          });
        },
      );

      worker.addEventListener("error", (error) => {
        console.error("ChessProcessor worker error:", error);
        this.isCompleted = true;
        resolve();
      });

      worker.postMessage({
        games: batches[0],
      });
    });
  }

  public getTree(rows: GameData[]) {
    this.games = rows;

    const fensArray = rows.map((row) => processGameFirstBatch(row));
    this.fensObj = mergeResults(this.fensObj, fensArray);
  }
  public searchFEN(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ) {
    const cleanedFen = cutStringToPenultimateSpace(fen.trim());
    const fenData = this.fensObj[cleanedFen];

    if (!fenData) {
      return { indexes: [] as number[], moves: [] };
    }

    const moves = Object.entries(fenData.moves)
      .map(([move, data]) => ({ move, ...data }))
      .toSorted((a, b) => b.games - a.games);

    return { indexes: fenData.indexes, moves };
  }

  private getWorker() {
    if (this.worker !== null) {
      return this.worker;
    }

    this.worker = new Worker(
      new URL("chessProcessor.worker.ts", import.meta.url),
      { type: "module" },
    );

    return this.worker;
  }
}

export default ChessProcessor;
