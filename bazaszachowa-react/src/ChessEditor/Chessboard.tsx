/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import "./style.css";
import {
  faChessBishop as faChessBishopRegular,
  faChessKing as faChessKingRegular,
  faChessKnight as faChessKnightRegular,
  faChessPawn as faChessPawnRegular,
  faChessQueen as faChessQueenRegular,
  faChessRook as faChessRookRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChessBishop as faChessBishopSolid,
  faChessKing as faChessKingSolid,
  faChessKnight as faChessKnightSolid,
  faChessPawn as faChessPawnSolid,
  faChessQueen as faChessQueenSolid,
  faChessRook as faChessRookSolid,
  faCircle as faCircleSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";

interface ChessboardProperties {
  blackPiecesColor?: string;
  blackSquareColor?: string;
  boardSize: number;
  fen: string;
  flip: boolean;
  nextMove: () => void;
  prevMove: () => void;
  sendSquare: (x: string) => void;
  sourceSquare: null | string;
  targetColor?: "green";
  targetSquares: string[];
  whitePiecesColor?: string;
  whiteSquareColor?: string;
}

const Chessboard: React.FC<ChessboardProperties> = ({
  blackPiecesColor = "black",
  blackSquareColor = "#b58863",
  boardSize = 400,
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  flip = false,
  nextMove = () => {},
  prevMove: previousMove = () => {},
  sendSquare = () => {},
  sourceSquare = null,
  targetColor = "green",
  targetSquares = [],
  whitePiecesColor = "white",
  whiteSquareColor = "#f0d9b5",
}) => {
  const allowDrop = (event_: React.DragEvent) => {
    event_.preventDefault();
  };

  const drag = (square: string) => {
    sendSquare(square);
  };

  const drop = (square: string) => {
    sendSquare(square);
  };

  const LETTERS = ["a", "b", "c", "d", "event", "f", "g", "h"];
  const piecesPlacement = fen.includes(" ")
    ? fen.split(" ")[0]
    : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const piecesPlacementRows = piecesPlacement.split("/");
  const board = [];
  let key = 0;
  for (
    let index = 0;
    index < piecesPlacementRows.length && index < 8;
    index++
  ) {
    const row = [];
    let counter = 0;
    for (
      let index_ = 0;
      index_ < piecesPlacementRows[index].length && index_ < 8;
      index_++
    ) {
      let piece = null;
      let color = null;
      let contour = null;
      let contourColor = null;
      switch (piecesPlacementRows[index][index_]) {
        case "B": {
          piece = faChessBishopSolid;
          color = whitePiecesColor;
          contour = faChessBishopRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "b": {
          piece = faChessBishopSolid;
          color = blackPiecesColor;
          contour = faChessBishopRegular;
          contourColor = whitePiecesColor;
          break;
        }
        case "K": {
          piece = faChessKingSolid;
          color = whitePiecesColor;
          contour = faChessKingRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "k": {
          piece = faChessKingSolid;
          color = blackPiecesColor;
          contour = faChessKingRegular;
          contourColor = whitePiecesColor;
          break;
        }
        case "N": {
          piece = faChessKnightSolid;
          color = whitePiecesColor;
          contour = faChessKnightRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "n": {
          piece = faChessKnightSolid;
          color = blackPiecesColor;
          contour = faChessKnightRegular;
          contourColor = whitePiecesColor;
          break;
        }
        case "P": {
          piece = faChessPawnSolid;
          color = whitePiecesColor;
          contour = faChessPawnRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "p": {
          piece = faChessPawnSolid;
          color = blackPiecesColor;
          contour = faChessPawnRegular;
          contourColor = whitePiecesColor;
          break;
        }
        case "Q": {
          piece = faChessQueenSolid;
          color = whitePiecesColor;
          contour = faChessQueenRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "q": {
          piece = faChessQueenSolid;
          color = blackPiecesColor;
          contour = faChessQueenRegular;
          contourColor = whitePiecesColor;
          break;
        }
        case "R": {
          piece = faChessRookSolid;
          color = whitePiecesColor;
          contour = faChessRookRegular;
          contourColor = blackPiecesColor;
          break;
        }
        case "r": {
          piece = faChessRookSolid;
          color = blackPiecesColor;
          contour = faChessRookRegular;
          contourColor = whitePiecesColor;
          break;
        }
        default: {
          const n = Number.parseInt(piecesPlacementRows[index][index_]);
          for (let k = 0; k < n; k++) {
            const square = `${LETTERS[counter]}${8 - index}`;
            if (targetSquares.includes(square)) {
              row.push(
                <div
                  key={key++}
                  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
                  onClick={() => {
                    sendSquare(square);
                  }}
                  onDragOver={allowDrop}
                  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
                  onDrop={() => {
                    drop(square);
                  }}
                  style={
                    {
                      backgroundColor:
                        sourceSquare === square
                          ? "goldenrod"
                          : (index + counter) % 2 === 1
                            ? blackSquareColor
                            : whiteSquareColor,
                      display: "flex",
                      flex: 1,
                      height: boardSize / 8,
                      width: boardSize / 8,
                    } as const
                  }
                >
                  <span className="target">
                    <FontAwesomeIcon
                      // size={boardSize / 9}
                      className={targetColor}
                      color={targetColor}
                      icon={faCircleSolid}
                      style={{ color: targetColor } as const}
                    />
                  </span>
                </div>,
              );
            } else {
              row.push(
                <div
                  key={key++}
                  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
                  onClick={() => {
                    sendSquare(square);
                  }}
                  onDragOver={allowDrop}
                  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
                  onDrop={() => {
                    drop(square);
                  }}
                  style={
                    {
                      backgroundColor:
                        sourceSquare === square
                          ? "goldenrod"
                          : (index + counter) % 2 === 1
                            ? blackSquareColor
                            : whiteSquareColor,
                      display: "flex",
                      flex: 1,
                      height: boardSize / 8,
                      width: boardSize / 8,
                    } as const
                  }
                />,
              );
            }
            counter++;
          }
          continue;
        }
      }
      const square = `${LETTERS[counter]}${8 - index}`;
      row.push(
        <div
          key={key++}
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onClick={() => {
            sendSquare(square);
          }}
          onDragOver={allowDrop}
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onDrop={() => {
            drop(square);
          }}
          style={
            {
              alignItems: "center",
              backgroundColor:
                sourceSquare === square
                  ? "goldenrod"
                  : (index + counter) % 2 === 1
                    ? blackSquareColor
                    : whiteSquareColor,
              display: "flex",
              flex: 1,
              height: boardSize / 8,
              justifyContent: "center",
              width: boardSize / 8,
            } as const
          }
        >
          <span
            className={`${color} piece fa-stack`}
            draggable
            // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
            onDragStart={(event) => {
              event.stopPropagation();
              drag(square);
            }}
          >
            {targetSquares.includes(square) && (
              <FontAwesomeIcon
                className={`${targetColor} target fa-stack-1x`}
                color={targetColor}
                icon={faCircleSolid}
                style={{ color: targetColor } as const}
              />
            )}
            {contourColor === blackPiecesColor && (
              <FontAwesomeIcon
                className={`${contourColor}Contour fa fa-stack-2x`}
                color={contourColor}
                icon={contour}
                style={{ color: contourColor } as const}
              />
            )}
            <FontAwesomeIcon
              className={`${color} fa fa-stack-3x`}
              color={color}
              icon={piece}
              style={{ color } as const}
            />
          </span>
        </div>,
      );
      counter++;
    }
    if (flip) {
      row.reverse();
    }
    board.push(
      <div style={{ display: "flex", flexDirection: "row" } as const}>
        {row}
      </div>,
    );
  }

  if (flip) {
    board.reverse();
  }

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.deltaY > 0) {
        nextMove();
      } else {
        previousMove();
      }
      event.stopPropagation();
    },
    [nextMove, previousMove],
  );

  return (
    <div
      onScroll={handleWheel}
      onScrollCapture={handleWheel}
      onWheel={handleWheel}
      onWheelCapture={handleWheel}
      style={{ width: boardSize } as const}
    >
      {board}
    </div>
  );
};

export default Chessboard;
