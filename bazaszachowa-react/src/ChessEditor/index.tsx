import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Chess, PieceColor, PieceType, ShortMove, Square } from "chess.js";
import {
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessQueen,
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";
import Chessboard from "./Chessboard";
import TouchableIcon from "./TouchableIcon";
import Notation from "./Notation";
import ButtonsBar from "./ButtonsBar";

export interface Move {
  variations: Move[];
  from?: Square;
  to?: Square;
  turn?: PieceColor;
  fen: string;
  index?: number;
  san: string;
  prev?: number;
  moveNo: number;
  flags?: string;
  promotion?: PieceType;
  next?: number;
}

interface headersProps {
  Event?: string | null;
  Site?: string | null;
  Round?: string | null;
  White: string;
  Black: string;
  Result?: string | null;
  WhiteElo?: number | null;
  BlackElo?: number | null;
  ECO?: string | null;
}

export interface GameData extends headersProps {
  id: number;
  Year?: number;
  Month?: number;
  Day?: number;
  moves: {
    from: Square;
    to: Square;
    promotion?: PieceType;
  }[];
}

interface ChessEditorProps {
  data?: GameData | null;
  boardSize: number;
  notationLayout?: string;
  setNotationLayout?: (x: string) => void;
  showPlayers?: boolean;
  setFen: (x: string) => void;
  setDoMove: Function;
  profileUrl: string | null;
  zoomIn: () => void;
  zoomOut: () => void;
  notationSwitch?: boolean;
}

const ChessEditor: React.FC<ChessEditorProps> = ({
  data = null,
  boardSize = 400,
  notationLayout = "bottom",
  setNotationLayout = () => {},
  showPlayers = true,
  setFen = () => {},
  setDoMove = () => {},
  profileUrl = null,
  zoomIn = () => {},
  zoomOut = () => {},
  notationSwitch = false,
}) => {
  const [playing, setPlaying] = useState(false);
  const [flip, setFlip] = useState(false);
  const [headers, setHeaders] = useState<headersProps & { Date?: string }>({
    White: "",
    Black: "",
  });
  const [targetSquares, setTargetSquares] = useState<string[]>([]);

  const history = useRef<Move[]>([
    {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      san: "",
      moveNo: 0,
      variations: [],
    },
  ]);
  const index = useRef(0);
  const [sourceSquare, setSourceSquare] = useState<Square | null>(null);
  const [destSquare, setDestSquare] = useState<Square | null>(null);

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
      history.current[currentIndex] !== undefined &&
      history.current[currentIndex].next !== undefined
    ) {
      return history.current[currentIndex].next;
    }
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
    if (!chess.game_over()) {
      const moveNo = history.current[index.current]?.moveNo || 0;
      let doneMove;
      try {
        doneMove = chess.move(move);
      } catch (err) {
        if (
          move?.from &&
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
          history.current[getNextMoveIndex(index.current)!].flags ===
            doneMove.flags &&
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
                variation.flags === doneMove.flags &&
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
            variations: [],
            from: doneMove.from,
            to: doneMove.to,
            turn: doneMove.color,
            fen,
            index: newHistory.length,
            san: doneMove.san,
            prev: index.current,
            moveNo: moveNo + (fen.split(" ")[1] === "b" ? 1 : 0),
            flags: doneMove.flags,
            promotion: doneMove.promotion,
          };
          if (newHistory[index.current].next) {
            if (
              newHistory[newHistory[index.current].next!].to ||
              (doneMove.to &&
                newHistory[newHistory[index.current].next!].from !==
                  doneMove.from)
            ) {
              newHistory[newHistory[index.current].next!].variations.push(
                moveObj
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
        move?.from &&
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
    if (!chess.game_over()) {
      if (sourceSquare === null) {
        setSourceSquare(square as Square);
        setTargetSquares(
          chess.moves({ square, verbose: true }).map((move) => move.to)
        );
      } else {
        setDestSquare(square as Square);
        if (addMove({ from: sourceSquare as Square, to: square as Square })) {
          setSourceSquare(null);
          setDestSquare(null);
          setTargetSquares([]);
        }
      }
    }
  };

  const writeMove = (
    moves: Move[],
    index: number,
    variant: boolean,
    forked: boolean
  ) => {
    let notation = "";
    const move = moves[index];
    const moveNumber = move.moveNo;
    if (variant) {
      notation += "(";
    }
    if (move.turn === "w") {
      notation += moveNumber + ". ";
    } else if (variant || forked) {
      notation += moveNumber + "... ";
    }
    notation += move.san + " ";
    let hasVariant = false;
    for (const variant of move.variations) {
      if (variant.index) {
        notation += writeMove(moves, variant.index, true, true);
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
    const pgn = `[Event "${headers?.Event || "*"}"]
[Site "${headers?.Site || "*"}"]
[Date "${headers?.Date || "*"}"]
[Round "${headers?.Round || "*"}"]
[White "${headers?.White || "*"}"]
[Black "${headers?.Black || "*"}"]
[Result "${headers?.Result || "*"}"]

${
  history.current.length === 1
    ? "1. "
    : writeMove(history.current, 1, false, false)
} ${headers?.Result || "*"}`;

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
        Event: data.Event || null,
        Site: data.Site || null,
        Date: date,
        Round: data.Round || null,
        White: data.White || "N, N",
        Black: data.Black || "N, N",
        Result: data.Result || null,
        WhiteElo: data.WhiteElo || null,
        BlackElo: data.BlackElo || null,
        ECO: data.ECO || null,
      });
      history.current = [
        {
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          san: "",
          moveNo: 0,
          variations: [],
        },
      ];
      index.current = 0;
      let currentIndex = index.current || 0;
      let counter = history.current[currentIndex]?.moveNo || 1;
      const newHistory = [...history.current];
      const newChess = new Chess();

      for (const move of data.moves) {
        const doneMove = newChess.move(move as ShortMove);
        if (!doneMove) {
          break;
        }
        const fen = newChess.fen();

        const moveObj = {
          variations: [],
          from: doneMove.from,
          to: doneMove.to,
          turn: doneMove.color,
          fen,
          index: newHistory.length,
          san: doneMove.san,
          prev: currentIndex,
          moveNo: doneMove.color === "w" ? counter : counter++,
          flags: doneMove.flags,
          promotion: doneMove.promotion,
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
              moveObj
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
            {headers.WhiteElo && headers.WhiteElo > 0 ? headers?.WhiteElo : ""}
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
            {headers.BlackElo && headers.BlackElo > 0 ? headers?.BlackElo : ""}
          </p>
          <p>
            {headers?.Event || "?"} {headers?.Date || "????"},{" "}
            {headers?.Site || "?"}
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection:
            notationPlacement as React.CSSProperties["flexDirection"],
          width: boardSize + (notationPlacement.includes("row") ? 150 : 0),
          margin: "auto",
        }}
      >
        <div>
          <div style={{ display: promotionMenuVisible ? "block" : "none" }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableIcon
                icon={faChessQueen}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      to: destSquare,
                      promotion: "q",
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
                className="promotion"
              />
              <TouchableIcon
                icon={faChessRook}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      to: destSquare,
                      promotion: "r",
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
                className="promotion"
              />
              <TouchableIcon
                icon={faChessBishop}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      to: destSquare,
                      promotion: "b",
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
                className="promotion"
              />
              <TouchableIcon
                icon={faChessKnight}
                onClick={() => {
                  if (sourceSquare && destSquare) {
                    addMove({
                      from: sourceSquare,
                      to: destSquare,
                      promotion: "n",
                    });
                  }
                  setPromotionMenuVisible(false);
                  setSourceSquare(null);
                  setDestSquare(null);
                  setTargetSquares([]);
                }}
                className="promotion"
              />
            </div>
          </div>

          <Chessboard
            boardSize={boardSize}
            flip={flip}
            fen={history.current[index.current].fen}
            sendSquare={captureSquare}
            sourceSquare={sourceSquare}
            targetSquares={targetSquares}
            nextMove={() => {
              setIndex(getNextMoveIndex(index.current)!);
            }}
            prevMove={() => {
              setIndex(getPrevIndex(index.current)!);
            }}
          />
          <ButtonsBar
            notationSwitch={notationSwitch}
            flip={() => {
              setFlip((flip) => !flip);
            }}
            playing={playing}
            setPlaying={() => {
              setPlaying((prevPlaying) => !prevPlaying);
            }}
            width={boardSize}
            firstMove={() => {
              setIndex(0);
            }}
            prevMove={() => {
              setIndex(getPrevIndex(index.current)!);
            }}
            nextMove={() => {
              setIndex(getNextMoveIndex(index.current)!);
            }}
            lastMove={() => {
              setIndex(getLastMoveIndex(index.current)!);
            }}
            isFirst={index.current === 0}
            isLast={getNextMoveIndex(index.current) === null}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            download={download}
            notationLayout={notationLayout}
            setNotationLayout={setNotationLayout}
          />
        </div>
        <div className={notationLayout === "none" ? "inactive" : ""}>
          <Notation
            height={boardSize}
            moves={history.current}
            setIndex={setIndex}
            currentIndex={index.current}
            result={headers.Result || null}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessEditor;
