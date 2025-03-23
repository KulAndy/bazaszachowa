import { Chess, ChessInstance, ShortMove } from "chess.js";
import { GameData } from "../ChessEditor";

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
  [move: string]: MoveData | number[];
  indexes: number[];
}

interface FensObj {
  [fen: string]: FenData;
}

function isNumberArray(value: any): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
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
          for (const move in fens[fen]) {
            if (move !== "indexes") {
              if (fensObj[fen][move]) {
                (fensObj[fen][move] as MoveData).games += (
                  fens[fen][move] as MoveData
                ).games;
                (fensObj[fen][move] as MoveData).points += (
                  fens[fen][move] as MoveData
                ).points;
                (fensObj[fen][move] as MoveData).years.push(
                  ...(fens[fen][move] as MoveData).years
                );

                for (const year in (fens[fen][move] as MoveData).stats) {
                  const yearNum = Number(year);
                  if ((fensObj[fen][move] as MoveData).stats[yearNum]) {
                    (fensObj[fen][move] as MoveData).stats[yearNum].count += (
                      fens[fen][move] as MoveData
                    ).stats[yearNum].count;
                    (fensObj[fen][move] as MoveData).stats[yearNum].points += (
                      fens[fen][move] as MoveData
                    ).stats[yearNum].points;
                  } else {
                    (fensObj[fen][move] as MoveData).stats[yearNum] = {
                      count: (fens[fen][move] as MoveData).stats[yearNum].count,
                      points: (fens[fen][move] as MoveData).stats[yearNum]
                        .points,
                    };
                  }
                }
              } else {
                fensObj[fen][move] = { ...fens[fen][move] };
              }
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
          if (
            fens[fen][result.doneMove.san] &&
            !isNumberArray(fens[fen][result.doneMove.san])
          ) {
            (fens[fen][result.doneMove.san] as MoveData).games += 1;
            (fens[fen][result.doneMove.san] as MoveData).points +=
              result.data.points;
            (fens[fen][result.doneMove.san] as MoveData).years.push(
              ...result.data.years
            );
            if (
              !(fens[fen][result.doneMove.san] as MoveData).stats[
                Number(row.Year)
              ]
            ) {
              (fens[fen][result.doneMove.san] as MoveData).stats[
                Number(row.Year)
              ] = {
                count: 1,
                points: result.data.points,
              };
            }
          } else {
            fens[fen][result.doneMove.san] = {
              ...result.data,
              stats: {
                [String(row.Year)]: { count: 1, points: result.data.points },
              },
            };
          }
        } else {
          fens[fen] = {
            [result.doneMove.san]: {
              ...result.data,
              stats: {
                [String(row.Year)]: { count: 1, points: result.data.points },
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
    chess: ChessInstance,
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
      const { indexes, ...fens } = this.fensObj[fen];
      const moves = Object.keys(fens)
        .filter((key) => !isNumberArray(fens[key]))
        .map((key) => ({
          move: key,
          ...(fens[key] as MoveData),
        }));

      moves.sort((a, b) => b.games - a.games);
      return { indexes, moves };
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
          if (
            this.fensObj[fen][result.doneMove.san] &&
            !isNumberArray(this.fensObj[fen][result.doneMove.san])
          ) {
            (this.fensObj[fen][result.doneMove.san] as MoveData).games += 1;
            (this.fensObj[fen][result.doneMove.san] as MoveData).points +=
              result.data.points;
            (this.fensObj[fen][result.doneMove.san] as MoveData).years.push(
              result.data.years[0]
            );
          } else {
            this.fensObj[fen][result.doneMove.san] = { ...result.data };
          }
        } else {
          this.fensObj[fen] = {
            [result.doneMove.san]: { ...result.data },
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
