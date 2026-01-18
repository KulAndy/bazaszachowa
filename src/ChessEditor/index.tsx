import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { noop } from "es-toolkit";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ButtonsBar from "./ButtonsBar";
import Chessboard from "./Chessboard";
import Notation from "./Notation";

import "./style.scss";

// eslint-disable-next-line no-use-before-define
export interface GameData extends HeadersProperties {
  Day: null | number;
  id: number;
  Month: null | number;
  moves: {
    from: Square;
    promotion?: PieceSymbol;
    to: Square;
  }[];
  Year?: number;
}

export interface Move {
  fen: string;
  flags?: string;
  from?: Square;
  index?: number;
  moveNo: number;
  next?: number;
  prev?: number;
  promotion?: PieceSymbol;
  san: string;
  to?: Square;
  turn?: Color;
  variations: Move[];
}

export interface ShortMove {
  from: Square;
  promotion?: Exclude<PieceSymbol, "k" | "p">;
  to: Square;
}

interface ChessEditorProperties {
  readonly boardSize: number;
  readonly data?: GameData | null;
  readonly notationLayout?: string;
  readonly notationSwitch?: boolean;
  readonly profileUrl: null | string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  readonly setDoMove: Function;
  readonly setFen: (x: string) => void;
  readonly setNotationLayout?: (x: string) => void;
  readonly showPlayers?: boolean;
  readonly zoomIn: () => void;
  readonly zoomOut: () => void;
}

interface HeadersProperties {
  Black: string;
  BlackElo?: null | number;
  ECO?: null | string;
  Event?: null | string;
  Result?: null | string;
  Round?: null | string;
  Site?: null | string;
  White: string;
  WhiteElo?: null | number;
}

const writeMove = (
  moves: Move[],
  moveIndex: number,
  variant: boolean,
  forked: boolean,
) => {
  let notation = "";
  const move = moves[moveIndex];
  const moveNumber = move.moveNo;
  if (variant) {
    notation += "(";
  }
  if (move.turn === "w") {
    notation += `${moveNumber}. `;
  } else if (variant || forked) {
    notation += `${moveNumber}... `;
  }
  notation += `${move.san} `;
  let hasVariant = false;
  for (const moveVariant of move.variations) {
    if (moveVariant.index) {
      notation += writeMove(moves, moveVariant.index, true, true);
      hasVariant = true;
    }
  }

  if (move.next) {
    notation += writeMove(moves, move.next, false, hasVariant);
  }

  if (variant) {
    notation += ") ";
  }

  return notation;
};

interface DownloadProperties {
  headers: { Date?: string } & HeadersProperties;
  history: Move[];
}

const download = ({ headers, history }: DownloadProperties) => {
  const pgn = `[Event "${headers.Event || "*"}"]
[Site "${headers.Site || "*"}"]
[Date "${headers.Date || "*"}"]
[Round "${headers.Round || "*"}"]
[White "${headers.White || "*"}"]
[Black "${headers.Black || "*"}"]
[Result "${headers.Result || "*"}"]

${
  history.length === 1 ? "1. " : writeMove(history, 1, false, false)
} ${headers.Result || "*"}`;

  const blob = new Blob([pgn], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "game.pgn";
  link.click();

  URL.revokeObjectURL(url);
};

const ChessEditor: React.FC<ChessEditorProperties> = ({
  boardSize = 400,
  data = null,
  notationLayout = "bottom",
  notationSwitch = false,
  profileUrl = null,
  setDoMove = noop,
  setFen = noop,
  setNotationLayout = noop,
  showPlayers = true,
  zoomIn = noop,
  zoomOut = noop,
}) => {
  const [playing, setPlaying] = useState(false);
  const [flip, setFlip] = useState(false);
  const [headers, setHeaders] = useState<{ Date?: string } & HeadersProperties>(
    {
      Black: "",
      White: "",
    },
  );
  const [targetSquares, setTargetSquares] = useState<string[]>([]);

  const history = useRef<Move[]>([
    {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      moveNo: 0,
      san: "",
      variations: [],
    },
  ]);
  const index = useRef(0);
  const [sourceSquare, setSourceSquare] = useState<null | Square>(null);
  const [destinationSquare, setDestinationSquare] = useState<null | Square>(
    null,
  );

  const [promotionMenuVisible, setPromotionMenuVisible] = useState(false);
  const [index_, setIndex_] = useState(0);

  const setHistory = useCallback(
    (newHistory: Move[]) => {
      history.current = newHistory;
      setFen(newHistory[index.current].fen);
    },
    [setFen],
  );

  const setIndex = useCallback(
    (newIndex: number) => {
      if (history.current[newIndex] !== undefined) {
        index.current = newIndex;
        setFen(history.current[newIndex].fen);
        setIndex_(index_ + 1);
      }
    },
    [index_, setFen],
  );

  const getPreviousIndex = (currentIndex: number) => {
    return currentIndex === 0 ? 0 : history.current[currentIndex].prev;
  };

  const getNextMoveIndex = (currentIndex: number) => {
    if (history.current[currentIndex]?.next !== undefined) {
      return history.current[currentIndex].next;
    }
    return null;
  };

  const getLastMoveIndex = useCallback((currentIndex: number) => {
    let nextMoveIndex = getNextMoveIndex(currentIndex);
    while (nextMoveIndex && getNextMoveIndex(nextMoveIndex)) {
      nextMoveIndex = getNextMoveIndex(nextMoveIndex);
    }
    return nextMoveIndex;
  }, []);

  const addMove = useCallback(
    (move: ShortMove) => {
      setSourceSquare(move.from);
      setDestinationSquare(move.to);

      const chess = new Chess(history.current[index.current].fen);
      if (!chess.isGameOver()) {
        const moveNo = history.current[index.current]?.moveNo || 0;
        let doneMove;
        try {
          doneMove = chess.move(move);
        } catch {
          if (
            move.from &&
            chess
              .moves({ square: move.from, verbose: true })
              .map((object) => object.to)
              .includes(move.to)
          ) {
            setPromotionMenuVisible(true);
            return false;
          }
          return true;
        }
        if (doneMove) {
          if (
            index.current !== undefined &&
            getNextMoveIndex(index.current) &&
            history.current[getNextMoveIndex(index.current)!] !== undefined &&
            history.current[getNextMoveIndex(index.current)!]?.from ===
              doneMove.from &&
            history.current[getNextMoveIndex(index.current)!]?.to ===
              doneMove.to &&
            history.current[getNextMoveIndex(index.current)!]?.promotion ===
              doneMove.promotion
          ) {
            setIndex(getNextMoveIndex(index.current)!);
          } else {
            if (
              index.current !== undefined &&
              getNextMoveIndex(index.current) !== undefined &&
              history.current[getNextMoveIndex(index.current)!] !== null &&
              history.current[getNextMoveIndex(index.current)!] !== undefined
            ) {
              for (const variation of history.current[
                getNextMoveIndex(index.current)!
              ].variations) {
                if (
                  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                  variation !== undefined &&
                  variation.from === doneMove.from &&
                  variation?.to === doneMove.to &&
                  variation?.promotion === doneMove.promotion
                ) {
                  setIndex(variation.index!);
                  return true;
                }
              }
            }
            const newHistory = [...history.current];
            const fen = chess.fen();
            const moveObject = {
              fen,
              from: doneMove.from,
              index: newHistory.length,
              moveNo: moveNo + (fen.split(" ")[1] === "b" ? 1 : 0),
              prev: index.current,
              promotion: doneMove.promotion,
              san: doneMove.san,
              to: doneMove.to,
              turn: doneMove.color,
              variations: [],
            };
            if (newHistory[index.current].next) {
              if (
                newHistory[newHistory[index.current].next!].to ||
                (doneMove.to &&
                  newHistory[newHistory[index.current].next!].from !==
                    doneMove.from)
              ) {
                newHistory[newHistory[index.current].next!].variations.push(
                  moveObject,
                );
              }
            } else {
              newHistory[index.current].next = newHistory.length;
            }
            newHistory.push(moveObject);
            setHistory(newHistory);
            setIndex(newHistory.length - 1);
          }
        } else if (
          move.from &&
          chess
            .moves({ square: move.from, verbose: true })
            .map((object) => object.to)
            .includes(move.to)
        ) {
          setPromotionMenuVisible(true);
          return false;
        }
        return true;
      }
      setSourceSquare(null);
      setDestinationSquare(null);
      return true;
    },
    [setHistory, setIndex],
  );

  let notationPlacement;
  switch (notationLayout) {
    case "left": {
      notationPlacement = "row-reverse";
      break;
    }
    case "right": {
      notationPlacement = "row";
      break;
    }
    case "top": {
      notationPlacement = "column-reverse";
      break;
    }

    default: {
      notationPlacement = "column";
      break;
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (getNextMoveIndex(index.current) && playing) {
        setIndex(getNextMoveIndex(index.current)!);
      } else {
        setPlaying(false);
        setIndex_(0);
        clearTimeout(timer);
      }

      // eslint-disable-next-line unicorn/consistent-function-scoping
      return () => {
        setPlaying(false);
        setIndex_(0);
        clearTimeout(timer);
      };
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, index_]);

  useEffect(() => {
    setFen(history.current[index.current].fen);
    setTargetSquares([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.current, index.current]);

  useEffect(() => {
    if (data !== null) {
      let date = "";
      date += data.Year || "????";
      date += ".";
      if (data.Month) {
        if (data.Month < 10) {
          date += "0";
        }
        date += data.Month;
      } else {
        date += "??";
      }
      date += ".";
      if (data.Day) {
        if (data.Day < 10) {
          date += "0";
        }
        date += data.Day;
      } else {
        date += "??";
      }
      setHeaders({
        Black: data.Black || "N, N",
        BlackElo: data.BlackElo || null,
        Date: date,
        ECO: data.ECO || null,
        Event: data.Event || null,
        Result: data.Result || null,
        Round: data.Round || null,
        Site: data.Site || null,
        White: data.White || "N, N",
        WhiteElo: data.WhiteElo || null,
      });
      history.current = [
        {
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          moveNo: 0,
          san: "",
          variations: [],
        },
      ];
      index.current = 0;
      let currentIndex = index.current || 0;
      let counter = history.current[currentIndex]?.moveNo || 1;
      const newHistory = [...history.current];
      const newChess = new Chess();

      for (const move of data.moves) {
        const doneMove = newChess.move(move);
        if (!doneMove) {
          break;
        }
        const fen = newChess.fen();

        const moveObject = {
          fen,
          from: doneMove.from,
          index: newHistory.length,
          moveNo: doneMove.color === "w" ? counter : counter++,
          prev: currentIndex,
          promotion: doneMove.promotion,
          san: doneMove.san,
          to: doneMove.to,
          turn: doneMove.color,
          variations: [],
        };
        if (
          newHistory[currentIndex].next &&
          newHistory[newHistory[currentIndex].next!]
        ) {
          if (
            newHistory[newHistory[currentIndex].next!].to ||
            (doneMove.to &&
              newHistory[newHistory[currentIndex].next!].from !== doneMove.from)
          ) {
            newHistory[newHistory[currentIndex++].next!].variations.push(
              moveObject,
            );
          }
        } else {
          newHistory[currentIndex++].next = newHistory.length;
        }
        newHistory.push(moveObject);
      }
      setPlaying(false);
      setHistory(newHistory);
      setIndex(0);
      // eslint-disable-next-line react-web-api/no-leaked-timeout
      setTimeout(() => {
        setIndex(0);
      }, 250);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setDoMove(() => addMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handlePromotion = (piece: Exclude<PieceSymbol, "k" | "p">) => () => {
    if (sourceSquare && destinationSquare) {
      addMove({
        from: sourceSquare,
        promotion: piece,
        to: destinationSquare,
      });
    }
    setPromotionMenuVisible(false);
    setSourceSquare(null);
    setDestinationSquare(null);
    setTargetSquares([]);
  };

  return (
    <div id="board">
      {showPlayers ? (
        <div id="info">
          <p>
            {headers.WhiteElo && headers.WhiteElo > 0 ? headers.WhiteElo : ""}
            {profileUrl === null ? (
              headers.White
            ) : (
              <Link to={profileUrl + encodeURIComponent(headers.White)}>
                {headers.White}
              </Link>
            )}{" "}
            {headers.Result}
            {profileUrl === null ? (
              headers.Black
            ) : (
              <Link to={profileUrl + encodeURIComponent(headers.Black)}>
                {headers.Black}
              </Link>
            )}{" "}
            {headers.BlackElo && headers.BlackElo > 0 ? headers.BlackElo : ""}
          </p>
          <p>{headers.Event || "?"}</p>
          <p>
            {headers.Date || "????"}, {headers.Site || "?"}
          </p>
        </div>
      ) : null}
      <div
        style={
          {
            display: "flex",
            flexDirection:
              notationPlacement as React.CSSProperties["flexDirection"],
            margin: "auto",
            width: boardSize + (notationPlacement.includes("row") ? 150 : 0),
          } as const
        }
      >
        <div>
          <div
            className="cg-wrap"
            style={
              {
                display: promotionMenuVisible ? "flex" : "none",
                justifyContent: "space-around",
                margin: "10px 0",
              } as const
            }
          >
            {(
              [
                { icon: "queen", value: "q" },
                { icon: "rook", value: "r" },
                { icon: "bishop", value: "b" },
                { icon: "knight", value: "n" },
              ] as const
            ).map((piece) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
              <div
                key={piece.value}
                onClick={handlePromotion(piece.value)}
                style={{ cursor: "pointer" } as const}
              >
                <piece
                  className={`cg-piece white ${piece.icon}`}
                  key={piece.value}
                  style={
                    {
                      display: "block",
                      height: 40,
                      position: "static",
                      width: 40,
                    } as const
                  }
                />
              </div>
            ))}
          </div>

          <Chessboard
            addMove={addMove}
            boardSize={boardSize}
            fen={history.current[index.current].fen}
            flip={flip}
            nextMove={() => setIndex(getNextMoveIndex(index.current)!)}
            prevMove={() => setIndex(getPreviousIndex(index.current)!)}
            sourceSquare={sourceSquare}
            targetSquares={targetSquares}
          />
          <ButtonsBar
            download={() => {
              download({ headers, history: history.current });
            }}
            firstMove={() => setIndex(0)}
            flip={() => setFlip((flipped) => !flipped)}
            isFirst={index.current === 0}
            isLast={getNextMoveIndex(index.current) === null}
            lastMove={() => setIndex(getLastMoveIndex(index.current)!)}
            nextMove={() => setIndex(getNextMoveIndex(index.current)!)}
            notationLayout={notationLayout}
            notationSwitch={notationSwitch}
            playing={playing}
            previousMove={() => setIndex(getPreviousIndex(index.current)!)}
            setNotationLayout={setNotationLayout}
            setPlaying={() => {
              setPlaying((previousPlaying) => !previousPlaying);
            }}
            width={boardSize}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
          />
        </div>
        <div className={notationLayout === "none" ? "inactive" : ""}>
          <Notation
            currentIndex={index.current}
            height={boardSize}
            moves={history.current}
            result={headers.Result || null}
            setIndex={setIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessEditor;
