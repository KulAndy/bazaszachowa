import { Chess } from "chess.js";

import { GameData } from "../ChessEditor";
import initWasm from "../wasm/chess_processor";

const cutStringToPenultimateSpace = (inputString: string): string => {
  const lastSpace = inputString.lastIndexOf(" ");
  return inputString.substring(0, inputString.lastIndexOf(" ", lastSpace - 1));
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
  for (let i = 0; i < length; i++) {
    const move = row.moves[i];
    const sidePoints = i % 2 === 0 ? points : 1 - points;
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
  fensObj: Record<string, FenData>,
  results: Record<string, FenData>[],
) => {
  for (const result of results) {
    for (const [fen, newFenData] of Object.entries(result)) {
      const fenData = fensObj[fen] ?? {
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
          const yearNum = Number(year);
          const old = moveData.stats[yearNum] ?? { count: 0, points: 0 };
          old.count += stat.count;
          old.points += stat.points;
          moveData.stats[yearNum] = old;
        }

        fenData.moves[move] = moveData;
      }

      fensObj[fen] = fenData;
    }
  }
  return fensObj;
};

initWasm().then((wasm: any) => {
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

    return result;
  };
});

class ChessProcessor {
  public isCompleted = false;
  private fensObj: Record<string, FenData> = {};
  private games: GameData[] = [];

  public async completeTree() {
    const batchSize = 10;
    let index = 0;

    const processBatch = async () => {
      for (
        let end = Math.min(index + batchSize, this.games.length);
        index < end;
        index++
      ) {
        await this.processGameSecondBatch(this.games[index]);
      }

      if (index < this.games.length) {
        setTimeout(processBatch, 0);
      } else {
        this.isCompleted = true;
      }
    };

    processBatch();
  }

  public async getTree(rows: GameData[]) {
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

  private async processGameSecondBatch(row: GameData) {
    const chess = new Chess();
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
    const year = row.Year!;

    for (let i = 0; i < row.moves.length; i++) {
      const move = row.moves[i];
      if (i < firstBatchLimit) {
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

      const sidePoints = i % 2 === 0 ? points : 1 - points;
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
