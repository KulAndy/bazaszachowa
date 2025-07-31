import {
  faChessBishop,
  faChessKnight,
  faChessQueen,
  faChessRook,
} from "@fortawesome/free-solid-svg-icons";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ButtonsBar from "./ButtonsBar";
import Chessboard from "./Chessboard";
// eslint-disable-next-line import/no-cycle
import Notation from "./Notation";
import TouchableIcon from "./TouchableIcon";
import "./style.css";

// eslint-disable-next-line no-use-before-define
export interface GameData extends headersProps {
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

interface ChessEditorProps {
  boardSize: number;
  data?: GameData | null;
  notationLayout?: string;
  notationSwitch?: boolean;
  profileUrl: null | string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setDoMove: Function;
  setFen: (x: string) => void;
  setNotationLayout?: (x: string) => void;
  showPlayers?: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface headersProps {
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

const ChessEditor: React.FC<ChessEditorProps> = ({
  boardSize = 400,
  data = null,
  notationLayout = "bottom",
  notationSwitch = false,
  profileUrl = null,
  setDoMove = () => {},
  setFen = () => {},
  setNotationLayout = () => {},
  showPlayers = true,
  zoomIn = () => {},
  zoomOut = () => {},
}) => {
  const [playing, setPlaying] = useState(false);
  const [flip, setFlip] = useState(false);
  const [headers, setHeaders] = useState<{ Date?: string } & headersProps>({
    Black: "",
    White: "",
  });
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
  const [destSquare, setDestSquare] = useState<null | Square>(null);

  const [promotionMenuVisible, setPromotionMenuVisible] = useState(false);
  const [i, setI] = useState(0);

  const setHistory = (newHistory: Move[]) => {
    history.current = newHistory;
    setFen(newHistory[index.current].fen);
  };

  const setIndex = (newIndex: number) => {
    if (history.current[newIndex] !== undefined) {
      index.current = newIndex;
      setFen(history.current[newIndex].fen);
      setI(i + 1);
    }
  };
  const getPrevIndex = (currentIndex: number) => {
    if (currentIndex === 0) {
      return 0;
    } else {
      return history.current[currentIndex].prev;
    }
  };

  const getNextMoveIndex = (currentIndex: number) => {
    if (
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      history.current[currentIndex] !== undefined &&
      history.current[currentIndex].next !== undefined
    ) {
      return history.current[currentIndex].next;
    }
    return undefined;
  };

  const getLastMoveIndex = (currentIndex: number) => {
    let nextMoveIndex = getNextMoveIndex(currentIndex);
    while (nextMoveIndex != null && getNextMoveIndex(nextMoveIndex) != null) {
      nextMoveIndex = getNextMoveIndex(nextMoveIndex);
    }
    return nextMoveIndex;
  };

  const addMove = (move: ShortMove) => {
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
            .map((obj) => obj.to)
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
          getNextMoveIndex(index.current) !== undefined &&
          history.current[getNextMoveIndex(index.current)!] !== null &&
          history.current[getNextMoveIndex(index.current)!] !== undefined &&
          history.current[getNextMoveIndex(index.current)!].from ===
            doneMove.from &&
          history.current[getNextMoveIndex(index.current)!].to ===
            doneMove.to &&
          history.current[getNextMoveIndex(index.current)!].promotion ===
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
                variation !== null &&
                variation !== undefined &&
                variation.from === doneMove.from &&
                variation.to === doneMove.to &&
                variation.promotion === doneMove.promotion
              ) {
                setIndex(variation.index!);
                return true;
              }
            }
          }
          const newHistory = [...history.current];
          const fen = chess.fen();
          const moveObj = {
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
                moveObj,
              );
            }
          } else {
            newHistory[index.current].next = newHistory.length;
          }
          newHistory.push(moveObj);
          setHistory(newHistory);
          setIndex(newHistory.length - 1);
        }
      } else if (
        move.from &&
        chess
          .moves({ square: move.from, verbose: true })
          .map((obj) => obj.to)
          .includes(move.to)
      ) {
        setPromotionMenuVisible(true);
        return false;
      }
      return true;
    }
    return true;
  };

  let notationPlacement = "column";
  switch (notationLayout) {
    case "left":
      notationPlacement = "row-reverse";
      break;
    case "right":
      notationPlacement = "row";
      break;
    case "top":
      notationPlacement = "column-reverse";
      break;

    default:
      notationPlacement = "column";
      break;
  }

  const captureSquare = (square: string) => {
    const chess = new Chess(history.current[index.current].fen);
    if (!chess.isGameOver()) {
      if (sourceSquare === null) {
        setSourceSquare(square as Square);
        setTargetSquares(
          chess
            .moves({ square: square as Square, verbose: true })
            .map((move) => move.to),
        );
      } else {
        setDestSquare(square as Square);
        if (addMove({ from: sourceSquare, to: square as Square })) {
          setSourceSquare(null);
          setDestSquare(null);
          setTargetSquares([]);
        }
      }
    }
  };

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

  const download = () => {
    const pgn = `[Event "${headers.Event || "*"}"]
[Site "${headers.Site || "*"}"]
[Date "${headers.Date || "*"}"]
[Round "${headers.Round || "*"}"]
[White "${headers.White || "*"}"]
[Black "${headers.Black || "*"}"]
[Result "${headers.Result || "*"}"]

${
  history.current.length === 1
    ? "1. "
    : writeMove(history.current, 1, false, false)
} ${headers.Result || "*"}`;

    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "game.pgn";
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (getNextMoveIndex(index.current) != null && playing) {
        setIndex(getNextMoveIndex(index.current)!);
      } else {
        setPlaying(false);
        setI(0);
        clearTimeout(timer);
      }

      return () => {
        setPlaying(false);
        setI(0);
        clearTimeout(timer);
      };
    }, 250);
    // eslint-disable-next-line
  }, [playing, index, i]);

  useEffect(() => {
    setFen(history.current[index.current].fen);
    // eslint-disable-next-line
  }, [history.current, index.current]);

  useEffect(() => {
    if (data !== null) {
      let date = "";
      if (data.Year) {
        date += data.Year;
      } else {
        date += "????";
      }
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

        const moveObj = {
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
              moveObj,
            );
          }
        } else {
          newHistory[currentIndex++].next = newHistory.length;
        }
        newHistory.push(moveObj);
      }
      setPlaying(false);
      setHistory(newHistory);
      setIndex(0);
      // eslint-disable-next-line react-web-api/no-leaked-timeout
      setTimeout(() => {
        setIndex(0);
      }, 250);
    }
    setDoMove(() => addMove);
    // eslint-disable-next-line
  }, [data]);

  return (
    <div id="board">
      {showPlayers && (
        <div id="info">
          <p>
            {headers.WhiteElo && headers.WhiteElo > 0 ? headers.WhiteElo : ""}
            {profileUrl === null ? (
              <>{headers.White}</>
            ) : (
              <Link to={profileUrl + encodeURIComponent(headers.White)}>
                {headers.White}
              </Link>
            )}{" "}
            {headers.Result}
            {profileUrl === null ? (
              <>{headers.Black}</>
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
      )}
      <div
        style={{
          display: "flex",
          flexDirection:
            notationPlacement as React.CSSProperties["flexDirection"],
          margin: "auto",
          width: boardSize + (notationPlacement.includes("row") ? 150 : 0),
        }}
      >
        <div>
          <div style={{ display: promotionMenuVisible ? "block" : "none" }}>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableIcon
                className="promotion"
                icon={faChessQueen}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      promotion: "q",
                      to: destSquare,
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
              />
              <TouchableIcon
                className="promotion"
                icon={faChessRook}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      promotion: "r",
                      to: destSquare,
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
              />
              <TouchableIcon
                className="promotion"
                icon={faChessBishop}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      promotion: "b",
                      to: destSquare,
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
              />
              <TouchableIcon
                className="promotion"
                icon={faChessKnight}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      promotion: "n",
                      to: destSquare,
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
              />
            </div>
          </div>

          <Chessboard
            boardSize={boardSize}
            fen={history.current[index.current].fen}
            flip={flip}
            nextMove={() => {
              setIndex(getNextMoveIndex(index.current)!);
            }}
            prevMove={() => {
              setIndex(getPrevIndex(index.current)!);
            }}
            sendSquare={captureSquare}
            sourceSquare={sourceSquare}
            targetSquares={targetSquares}
          />
          <ButtonsBar
            download={download}
            firstMove={() => {
              setIndex(0);
            }}
            flip={() => {
              setFlip((flipped) => !flipped);
            }}
            isFirst={index.current === 0}
            isLast={getNextMoveIndex(index.current) === null}
            lastMove={() => {
              setIndex(getLastMoveIndex(index.current)!);
            }}
            nextMove={() => {
              setIndex(getNextMoveIndex(index.current)!);
            }}
            notationLayout={notationLayout}
            notationSwitch={notationSwitch}
            playing={playing}
            prevMove={() => {
              setIndex(getPrevIndex(index.current)!);
            }}
            setNotationLayout={setNotationLayout}
            setPlaying={() => {
              setPlaying((prevPlaying) => !prevPlaying);
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
