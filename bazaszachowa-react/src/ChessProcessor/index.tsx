import { Chess } from "chess.js";

import { GameData } from "../ChessEditor";
import initWasm from "../wasm/chess_processor";

const cutStringToPenultimateSpace = (inputString: string): string => {
  const lastSpace = inputString.lastIndexOf(" ");
  return inputString.slice(
    0,
    Math.max(0, inputString.lastIndexOf(" ", lastSpace - 1)),
  );
};

const firstBatchLimit = 40;

interface FenData {
  indexes: number[];
  // eslint-disable-next-line no-use-before-define
  moves: Record<string, MoveData>;
}

interface MoveData {
  games: number;
  points: number;
  // eslint-disable-next-line no-use-before-define
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
  | ((row: GameData) => Record<string, FenData>)
  | null = null;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/prefer-top-level-await
initWasm().then((wasm: any) => {
  processGameFirstBatchWasm = (row: GameData): Record<string, FenData> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const wasmGame = new wasm.GameData(row.id, row.Result, row.Year);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const wasmMoves = new wasm.VectorMove();
    for (const move of row.moves) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const wasmMove = new wasm.Move(move.from, move.to, move.promotion);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      wasmMoves.push_back(wasmMove);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    wasmGame.moves = wasmMoves;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = wasm.getFENsFirstBatchJS(wasmGame);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wasmGame.delete();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wasmMoves.delete();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  };
});

class ChessProcessor {
  public isCompleted = false;
  private fensObj: Record<string, FenData> = {};
  private games: GameData[] = [];

  public clear() {
    this.isCompleted = false;
    this.fensObj = {};
    this.games = [];
  }

  public completeTree() {
    const batchSize = 10;
    let index = 0;

    const processBatch = () => {
      for (
        let end = Math.min(index + batchSize, this.games.length);
        index < end;
        index++
      ) {
        this.processGameSecondBatch(this.games[index]);
      }

      if (index < this.games.length) {
        setTimeout(processBatch, 0);
      } else {
        this.isCompleted = true;
      }
    };

    processBatch();
  }

  public getTree(rows: GameData[]) {
    this.isCompleted = false;
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
      .map(([move, data]) => ({
        move,
        ...data,
        stats: data.stats,
      }))
      .sort((a, b) => b.games - a.games);

    return { indexes: fenData.indexes, moves };
  }

  private processGameSecondBatch(row: GameData) {
    const chess = new Chess();
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
    const year = row.Year!;

    for (let index = 0; index < row.moves.length; index++) {
      const move = row.moves[index];
      if (index < firstBatchLimit) {
        chess.move(move);
        continue;
      }

      const fen = cutStringToPenultimateSpace(chess.fen());
      const doneMove = chess.move(move);
      if (!doneMove) {
        continue;
      }

      const fenData = this.fensObj[fen] ?? {
        indexes: [] as number[],
        moves: {},
      };
      const moveEntry = fenData.moves[doneMove.san] ?? {
        games: 0,
        points: 0,
        stats: {},
        years: [],
      };

      const sidePoints = index % 2 === 0 ? points : 1 - points;
      moveEntry.games++;
      moveEntry.points += sidePoints;
      moveEntry.years.push(year);

      const stat = moveEntry.stats[year] ?? { count: 0, points: 0 };
      stat.count++;
      stat.points += sidePoints;
      moveEntry.stats[year] = stat;

      fenData.moves[doneMove.san] = moveEntry;
      fenData.indexes.push(row.id);
      this.fensObj[fen] = fenData;
    }
  }
}

export default ChessProcessor;
