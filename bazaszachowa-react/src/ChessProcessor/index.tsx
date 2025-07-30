import { Chess } from "chess.js";
import { GameData } from "../ChessEditor";

const cutStringToPenultimateSpace = (inputString: string): string => {
  const lastSpace = inputString.lastIndexOf(" ");
  return inputString.substring(0, inputString.lastIndexOf(" ", lastSpace - 1));
};

const firstBatchLimit = 40;

interface MoveStats {
  count: number;
  points: number;
}

interface MoveData {
  games: number;
  points: number;
  years: number[];
  stats: Map<number, MoveStats>;
}

interface FenData {
  moves: Map<string, MoveData>;
  indexes: number[];
}

class ChessProcessor {
  private fensObj: Map<string, FenData> = new Map();
  private games: GameData[] = [];
  public isCompleted = false;

  async getTree(rows: GameData[]) {
    this.isCompleted = false;
    this.games = rows;

    const fensPromises = rows.map((row) => this.processGameFirstBatch(row));

    const fensArray = await Promise.all(fensPromises);
    this.mergeResults(fensArray);
  }

  private async processGameFirstBatch(
    row: GameData
  ): Promise<Map<string, FenData>> {
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
    const chess = new Chess();
    const fens: Map<string, FenData> = new Map();
    const year = row.Year as number;

    for (let i = 0; i < Math.min(firstBatchLimit, row.moves.length); i++) {
      const move = row.moves[i];
      const sidePoints = i % 2 === 0 ? points : 1 - points;
      const fen = cutStringToPenultimateSpace(chess.fen());
      const doneMove = chess.move(move);
      if (!doneMove) {
        continue;
      }

      const fenData = fens.get(fen) ?? {
        moves: new Map(),
        indexes: [] as number[],
      };
      const moveEntry = fenData.moves.get(doneMove.san) ?? {
        games: 0,
        points: 0,
        years: [],
        stats: new Map<number, MoveStats>(),
      };

      moveEntry.games++;
      moveEntry.points += sidePoints;
      moveEntry.years.push(year);

      const stat = moveEntry.stats.get(year) ?? { count: 0, points: 0 };
      stat.count++;
      stat.points += sidePoints;
      moveEntry.stats.set(year, stat);

      fenData.moves.set(doneMove.san, moveEntry);
      fenData.indexes.push(row.id);
      fens.set(fen, fenData);
    }

    return fens;
  }

  private mergeResults(results: Map<string, FenData>[]) {
    for (const result of results) {
      for (const [fen, newFenData] of result) {
        const fenData = this.fensObj.get(fen) ?? {
          moves: new Map(),
          indexes: [] as number[],
        };
        fenData.indexes.push(...newFenData.indexes);

        for (const [move, newMoveData] of newFenData.moves) {
          const moveData = fenData.moves.get(move) ?? {
            games: 0,
            points: 0,
            years: [],
            stats: new Map<number, MoveStats>(),
          };

          moveData.games += newMoveData.games;
          moveData.points += newMoveData.points;
          moveData.years.push(...newMoveData.years);

          for (const [year, stat] of newMoveData.stats) {
            const old = moveData.stats.get(year) ?? { count: 0, points: 0 };
            old.count += stat.count;
            old.points += stat.points;
            moveData.stats.set(year, old);
          }

          fenData.moves.set(move, moveData);
        }

        this.fensObj.set(fen, fenData);
      }
    }
  }

  searchFEN(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    const cleanedFen = cutStringToPenultimateSpace(fen.trim());
    const fenData = this.fensObj.get(cleanedFen);

    if (!fenData) {
      return { indexes: [], moves: [] };
    }

    const moves = Array.from(fenData.moves.entries())
      .map(([move, data]) => ({
        move,
        ...data,
        stats: Object.fromEntries(data.stats),
      }))
      .sort((a, b) => b.games - a.games);

    return { indexes: fenData.indexes, moves };
  }

  async completeTree() {
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

  private async processGameSecondBatch(row: GameData) {
    const chess = new Chess();
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;
    const year = row.Year as number;

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

      const fenData = this.fensObj.get(fen) ?? {
        moves: new Map(),
        indexes: [] as number[],
      };
      const moveEntry = fenData.moves.get(doneMove.san) ?? {
        games: 0,
        points: 0,
        years: [],
        stats: new Map<number, MoveStats>(),
      };

      const sidePoints = i % 2 === 0 ? points : 1 - points;
      moveEntry.games++;
      moveEntry.points += sidePoints;
      moveEntry.years.push(year);

      const stat = moveEntry.stats.get(year) ?? { count: 0, points: 0 };
      stat.count++;
      stat.points += sidePoints;
      moveEntry.stats.set(year, stat);

      fenData.moves.set(doneMove.san, moveEntry);
      fenData.indexes.push(row.id);
      this.fensObj.set(fen, fenData);
    }
  }
}

export default ChessProcessor;
