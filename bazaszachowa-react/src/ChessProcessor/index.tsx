import { Chess } from "chess.js";
import { GameData, ShortMove } from "../ChessEditor";

const cutStringToPenultimateSpace = (inputString: string) =>
  inputString.substring(
    0,
    inputString.lastIndexOf(" ", inputString.lastIndexOf(" ") - 1)
  );

const firstBatchLimit = 40;
interface MoveData {
  games: number;
  points: number;
  years: number[];
  stats: { [year: number]: { count: number; points: number } };
}

interface FenData {
  moves: { [move: string]: MoveData };
  indexes: number[];
}

interface FensObj {
  [fen: string]: FenData;
}

class ChessProcessor {
  currentFEN: string;
  fensObj: FensObj;
  games: GameData[];
  isCompleted: boolean;

  constructor() {
    this.currentFEN = "";
    this.fensObj = {};
    this.games = [];
    this.isCompleted = false;
  }

  async getTree(rows: GameData[]) {
    this.isCompleted = false;
    this.games = rows;

    const fensPromises = rows.map((row) => this.getFENsFirstBatch(row));

    const fensArray = await Promise.all(fensPromises);
    const fensObj = this.mergeFensArray(fensArray);
    this.fensObj = fensObj;
  }

  mergeFensArray(fensArray: FensObj[]): FensObj {
    const fensObj: FensObj = {};
    for (const fens of fensArray) {
      for (const fen in fens) {
        if (fen in fensObj) {
          fensObj[fen].indexes.push(...fens[fen].indexes);
          for (const move in fens[fen].moves) {
            if (fensObj[fen].moves[move]) {
              fensObj[fen].moves[move].games += fens[fen].moves[move].games;
              fensObj[fen].moves[move].points += fens[fen].moves[move].points;
              fensObj[fen].moves[move].years.push(
                ...fens[fen].moves[move].years
              );

              for (const year in fens[fen].moves[move].stats) {
                const yearNum = Number(year);
                if (fensObj[fen].moves[move].stats[yearNum]) {
                  fensObj[fen].moves[move].stats[yearNum].count +=
                    fens[fen].moves[move].stats[yearNum].count;
                  fensObj[fen].moves[move].stats[yearNum].points +=
                    fens[fen].moves[move].stats[yearNum].points;
                } else {
                  fensObj[fen].moves[move].stats[yearNum] = {
                    count: fens[fen].moves[move].stats[yearNum].count,
                    points: fens[fen].moves[move].stats[yearNum].points,
                  };
                }
              }
            } else {
              fensObj[fen].moves[move] = { ...fens[fen].moves[move] };
            }
          }
        } else {
          fensObj[fen] = { ...fens[fen] };
        }
      }
    }

    return fensObj;
  }

  async getFENsFirstBatch(row: GameData) {
    const moves = row.moves;
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    const chess = new Chess();
    const fens: FensObj = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(
        chess,
        move as ShortMove,
        i % 2 === 0 ? points : 1 - points,
        row.Year as number
      );
      if (result.fen && result.doneMove) {
        const fen = result.fen;
        if (fen in fens) {
          if (fens[fen].moves[result.doneMove.san]) {
            fens[fen].moves[result.doneMove.san].games += 1;
            fens[fen].moves[result.doneMove.san].points += result.data.points;
            fens[fen].moves[result.doneMove.san].years.push(
              ...result.data.years
            );
            if (!fens[fen].moves[result.doneMove.san].stats[Number(row.Year)]) {
              fens[fen].moves[result.doneMove.san].stats[Number(row.Year)] = {
                count: 1,
                points: result.data.points,
              };
            }
          } else {
            fens[fen].moves[result.doneMove.san] = {
              ...result.data,
              stats: {
                [String(row.Year)]: { count: 1, points: result.data.points },
              },
            };
          }
        } else {
          fens[fen] = {
            moves: {
              [result.doneMove.san]: {
                ...result.data,
                stats: {
                  [String(row.Year)]: { count: 1, points: result.data.points },
                },
              },
            },
            indexes: [row.id],
          };
        }
      }
      if (i++ >= firstBatchLimit || !result.doneMove) {
        return fens;
      }
    }

    return fens;
  }

  async processMove(
    chess: Chess,
    move: ShortMove,
    points: number,
    year: number
  ) {
    const raw_fen = chess.fen();
    const fen = cutStringToPenultimateSpace(raw_fen);

    const doneMove = chess.move(move);

    return {
      fen,
      data: {
        games: 1,
        points,
        years: [year],
        stats: {},
      },
      doneMove,
    };
  }

  searchFEN(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    if (fen.trim() === "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    fen = cutStringToPenultimateSpace(fen);

    fen = fen.trim();
    if (fen === "") {
      fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    if (this.fensObj[fen]) {
      const moves = Object.keys(this.fensObj[fen].moves).map((key) => ({
        move: key,
        ...this.fensObj[fen].moves[key],
      }));
      moves.sort((a, b) => b.games - a.games);
      return { indexes: this.fensObj[fen].indexes, moves };
    } else {
      return { indexes: [], moves: [] };
    }
  }

  async getFENsSecondBatch(row: GameData) {
    const moves = row.moves;
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    const chess = new Chess();
    const fens: FensObj = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(
        chess,
        move as ShortMove,
        points,
        row.Year as number
      );
      if (i++ < firstBatchLimit) {
        continue;
      }
      if (result.fen && result.doneMove) {
        const fen = result.fen;
        if (fen in this.fensObj) {
          this.fensObj[fen].indexes.push(row.id);
          if (this.fensObj[fen].moves[result.doneMove.san]) {
            this.fensObj[fen].moves[result.doneMove.san].games += 1;
            this.fensObj[fen].moves[result.doneMove.san].points +=
              result.data.points;
            this.fensObj[fen].moves[result.doneMove.san].years.push(
              result.data.years[0]
            );
          } else {
            this.fensObj[fen].moves[result.doneMove.san] = { ...result.data };
          }
        } else {
          this.fensObj[fen] = {
            moves: { [result.doneMove.san]: { ...result.data } },
            indexes: [row.id],
          };
        }
      }

      if (!result.doneMove) {
        return fens;
      }
    }

    return fens;
  }

  async completeTree() {
    const batchSize = 5;
    let index = 0;

    const processBatch = async () => {
      for (let i = 0; i < batchSize && index < this.games.length; i++) {
        const row = this.games[index];
        await this.getFENsSecondBatch(row);
        index++;
      }

      if (index < this.games.length) {
        setTimeout(processBatch, 0);
      } else {
        this.isCompleted = true;
      }
    };

    processBatch();
  }
}

export default ChessProcessor;
