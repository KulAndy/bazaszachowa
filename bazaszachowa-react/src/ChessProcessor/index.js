import { Chess } from "chess.js";

const cutStringToPenultimateSpace = (inputString) =>
  inputString.substring(
    0,
    inputString.lastIndexOf(" ", inputString.lastIndexOf(" ") - 1)
  );

const firstBatchLimit = 40;
class ChessProcessor {
  constructor() {
    this.currentFEN = "";
    this.fensObj = {};
    this.games = [];
  }

  async getTree(rows) {
    this.isCompleted = false;
    this.games = rows;

    const fensPromises = rows.map((row) => this.getFENsFirstBatch(row));

    const fensArray = await Promise.all(fensPromises);
    const fensObj = this.mergeFensArray(fensArray);
    this.fensObj = fensObj;
  }

  mergeFensArray(fensArray) {
    const fensObj = {};
    for (const fens of fensArray) {
      for (const fen in fens) {
        if (fen in fensObj) {
          fensObj[fen].indexes.push(...fens[fen].indexes);
          for (const move in fens[fen]) {
            if (move !== "indexes") {
              if (fensObj[fen][move]) {
                fensObj[fen][move].games += fens[fen][move].games;
                fensObj[fen][move].points += fens[fen][move].points;
                fensObj[fen][move].years.push(...fens[fen][move].years);

                for (const year in fens[fen][move].stats) {
                  fens[fen][year] = (fens[fen][year] || 0) + 1;
                  if (fensObj[fen][move].stats[year]) {
                    fensObj[fen][move].stats[year].count +=
                      fens[fen][move].stats[year].count;
                    fensObj[fen][move].stats[year].points +=
                      fens[fen][move].stats[year].points;
                  } else {
                    fensObj[fen][move].stats[year] = {
                      ...fens[fen][move].stats[year],
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

  async getFENsFirstBatch(row) {
    const moves = row.moves;
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    const chess = new Chess();
    const fens = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(
        chess,
        move,
        i % 2 === 0 ? points : 1 - points,
        row.Year
      );
      if (result.fen && result.doneMove) {
        const fen = result.fen;
        if (fen in fens) {
          if (fens[fen][result.doneMove.san]) {
            fens[fen][result.doneMove.san].games += 1;
            fens[fen][result.doneMove.san].points += result.data.points;
            fens[fen][result.doneMove.san].years.push(...result.data.years);
            if (!fens[fen][result.doneMove.san].stats[row.Year]) {
              fens[fen][result.doneMove.san].stats[row.Year] = {
                count: 1,
                points: result.data.points,
              };
            }
          } else {
            fens[fen][result.doneMove.san] = {
              ...result.data,
              stats: { [row.Year]: { count: 1, points: result.data.points } },
            };
          }
        } else {
          fens[fen] = {
            [result.doneMove.san]: {
              ...result.data,
              stats: { [row.Year]: { count: 1, points: result.data.points } },
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

  async processMove(chess, move, points, year) {
    const raw_fen = chess.fen();
    const fen = cutStringToPenultimateSpace(raw_fen);

    const doneMove = chess.move(move);

    return {
      fen,
      data: {
        games: 1,
        last: year,
        points,
        years: [year],
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
      const moves = Object.keys(fens).map((key) => ({
        move: key,
        ...fens[key],
      }));

      moves.sort((a, b) => b.games - a.games);

      return { indexes, moves };
    } else {
      return { indexes: [], moves: [] };
    }
  }

  async getFENsSecondBatch(row) {
    const moves = row.moves;
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    const chess = new Chess();
    const fens = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(chess, move, points, row.Year);
      if (i++ < firstBatchLimit) {
        continue;
      }
      if (result.fen && result.doneMove) {
        const fen = result.fen;
        if (fen in this.fensObj) {
          this.fensObj[fen].indexes.push(row.id);
          if (this.fensObj[fen][result.doneMove.san]) {
            this.fensObj[fen][result.doneMove.san].games += 1;
            this.fensObj[fen][result.doneMove.san].points += result.data.points;
            this.fensObj[fen][result.doneMove.san].years.push(result.data.year);
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
