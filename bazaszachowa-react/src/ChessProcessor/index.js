import { Chess } from "chess.js";

const cutStringToPenultimateSpace = (inputString) =>
  inputString.substring(
    0,
    inputString.lastIndexOf(" ", inputString.lastIndexOf(" ") - 1)
  );

class ChessProcessor {
  constructor() {
    this.currentFEN = "";
    this.fensObj = {};
    this.games = [];
  }

  async getTree(rows) {
    this.games = rows;

    const fensPromises = rows.map((row) => this.getFENs(row));

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
                fensObj[fen][move].last = Math.max(
                  fensObj[fen][move].last,
                  fens[fen][move].last
                );
                fensObj[fen][move].points += fens[fen][move].points;
                fensObj[fen][move].years.push(...fens[fen][move].years);
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

  async getFENs(row) {
    const moves = row.moves.match(
      /\b(?:[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8]|[NBRQK][a-h]?[1-8]?x?[a-h][1-8]|O-O-O|O-O|\+\+|#)\b/g
    );
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    let chess = new Chess();
    const fens = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(chess, move, points, row.Year);
      if (result.fen) {
        const fen = result.fen;
        if (fen in fens) {
          if (fens[fen][move]) {
            fens[fen][move].games += 1;
            fens[fen][move].last = Math.max(
              fens[fen][move].last,
              result.data.last
            );
            fens[fen][move].points += result.data.points;
            fens[fen][move].years.push(...result.data.years);
          } else {
            fens[fen][move] = result.data;
          }
        } else {
          fens[fen] = { [move]: result.data, indexes: [row.id] };
        }
      }
      if (i++ >= 50) {
        return fens;
      }
    }

    return fens;
  }

  async processMove(chess, move, points, year) {
    const raw_fen = chess.fen();
    const fen = cutStringToPenultimateSpace(raw_fen);

    chess.move(move);

    return {
      fen,
      data: {
        games: 1,
        last: year,
        points,
        years: [year],
      },
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

  async getFENsIf50Moves(row) {
    const moves = row.moves.match(
      /\b(?:[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8]|[NBRQK][a-h]?[1-8]?x?[a-h][1-8]|O-O-O|O-O|\+\+|#)\b/g
    );
    const points = row.Result === "1-0" ? 1 : row.Result === "0-1" ? 0 : 0.5;

    let chess = new Chess();
    const fens = {};

    let i = 0;
    for (const move of moves) {
      const result = await this.processMove(chess, move, points, row.Year);
      if (i++ < 50) {
        continue;
      }
      if (result.fen) {
        const fen = result.fen;
        if (fen in this.fensObj) {
          this.fensObj[fen].indexes.push(row.id); // Adding the row id directly
          if (this.fensObj[fen][move]) {
            this.fensObj[fen][move].games += 1;
            this.fensObj[fen][move].last = Math.max(
              this.fensObj[fen][move].last,
              result.data.last
            );
            this.fensObj[fen][move].points += result.data.points;
            this.fensObj[fen][move].years.push(result.data.year);
          } else {
            this.fensObj[fen][move] = { ...result.data };
          }
        } else {
          this.fensObj[fen] = { [move]: { ...result.data }, indexes: [row.id] };
        }
      }
    }

    return fens;
  }

  async completeTree() {
    const batchSize = 5;
    let index = 0;

    console.time();
    const processBatch = async () => {
      for (let i = 0; i < batchSize && index < this.games.length; i++) {
        const row = this.games[index];
        await this.getFENsIf50Moves(row);
        index++;
      }

      if (index < this.games.length) {
        setTimeout(processBatch, 0);
      } else {
        this.isCompleted = true;
        console.timeEnd();
      }
    };

    processBatch();
  }
}

export default ChessProcessor;
