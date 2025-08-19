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
import React from "react";

interface ChessboardProps {
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

const Chessboard: React.FC<ChessboardProps> = ({
  blackPiecesColor = "black",
  blackSquareColor = "#b58863",
  boardSize = 400,
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  flip = false,
  nextMove = () => {},
  prevMove = () => {},
  sendSquare = () => {},
  sourceSquare = null,
  targetColor = "green",
  targetSquares = [],
  whitePiecesColor = "white",
  whiteSquareColor = "#f0d9b5",
}) => {
  const allowDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
  };

  const drag = (square: string) => {
    sendSquare(square);
  };

  const drop = (square: string) => {
    sendSquare(square);
  };

  const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const piecesPlacement = fen.includes(" ")
    ? fen.split(" ")[0]
    : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const piecesPlacementRows = piecesPlacement.split("/");
  const board = [];
  let key = 0;
  for (let i = 0; i < piecesPlacementRows.length && i < 8; i++) {
    const row = [];
    let counter = 0;
    for (let j = 0; j < piecesPlacementRows[i].length && j < 8; j++) {
      let piece = null;
      let color = null;
      let contour = null;
      let contourColor = null;
      switch (piecesPlacementRows[i][j]) {
        case "B":
          piece = faChessBishopSolid;
          color = whitePiecesColor;
          contour = faChessBishopRegular;
          contourColor = blackPiecesColor;
          break;
        case "b":
          piece = faChessBishopSolid;
          color = blackPiecesColor;
          contour = faChessBishopRegular;
          contourColor = whitePiecesColor;
          break;
        case "K":
          piece = faChessKingSolid;
          color = whitePiecesColor;
          contour = faChessKingRegular;
          contourColor = blackPiecesColor;
          break;
        case "k":
          piece = faChessKingSolid;
          color = blackPiecesColor;
          contour = faChessKingRegular;
          contourColor = whitePiecesColor;
          break;
        case "N":
          piece = faChessKnightSolid;
          color = whitePiecesColor;
          contour = faChessKnightRegular;
          contourColor = blackPiecesColor;
          break;
        case "n":
          piece = faChessKnightSolid;
          color = blackPiecesColor;
          contour = faChessKnightRegular;
          contourColor = whitePiecesColor;
          break;
        case "P":
          piece = faChessPawnSolid;
          color = whitePiecesColor;
          contour = faChessPawnRegular;
          contourColor = blackPiecesColor;
          break;
        case "p":
          piece = faChessPawnSolid;
          color = blackPiecesColor;
          contour = faChessPawnRegular;
          contourColor = whitePiecesColor;
          break;
        case "Q":
          piece = faChessQueenSolid;
          color = whitePiecesColor;
          contour = faChessQueenRegular;
          contourColor = blackPiecesColor;
          break;
        case "q":
          piece = faChessQueenSolid;
          color = blackPiecesColor;
          contour = faChessQueenRegular;
          contourColor = whitePiecesColor;
          break;
        case "R":
          piece = faChessRookSolid;
          color = whitePiecesColor;
          contour = faChessRookRegular;
          contourColor = blackPiecesColor;
          break;
        case "r":
          piece = faChessRookSolid;
          color = blackPiecesColor;
          contour = faChessRookRegular;
          contourColor = whitePiecesColor;
          break;
        default:
          const n = parseInt(piecesPlacementRows[i][j]);
          for (let k = 0; k < n; k++) {
            const square = `${LETTERS[counter]}${8 - i}`;
            if (targetSquares.includes(square)) {
              row.push(
                <div
                  key={key++}
                  onClick={() => {
                    sendSquare(square);
                  }}
                  onDragOver={allowDrop}
                  onDrop={() => {
                    drop(square);
                  }}
                  style={{
                    backgroundColor:
                      sourceSquare === square
                        ? "goldenrod"
                        : (i + counter) % 2 === 1
                          ? blackSquareColor
                          : whiteSquareColor,
                    display: "flex",
                    flex: 1,
                    height: boardSize / 8,
                    width: boardSize / 8,
                  }}
                >
                  <span className="target">
                    <FontAwesomeIcon
                      // size={boardSize / 9}
                      className={targetColor}
                      color={targetColor}
                      icon={faCircleSolid}
                      style={{ color: targetColor }}
                    />
                  </span>
                </div>,
              );
            } else {
              row.push(
                <div
                  key={key++}
                  onClick={() => {
                    sendSquare(square);
                  }}
                  onDragOver={allowDrop}
                  onDrop={() => {
                    drop(square);
                  }}
                  style={{
                    backgroundColor:
                      sourceSquare === square
                        ? "goldenrod"
                        : (i + counter) % 2 === 1
                          ? blackSquareColor
                          : whiteSquareColor,
                    display: "flex",
                    flex: 1,
                    height: boardSize / 8,
                    width: boardSize / 8,
                  }}
                />,
              );
            }
            counter++;
          }
          continue;
      }
      const square = `${LETTERS[counter]}${8 - i}`;
      row.push(
        <div
          key={key++}
          onClick={() => {
            sendSquare(square);
          }}
          onDragOver={allowDrop}
          onDrop={() => {
            drop(square);
          }}
          style={{
            alignItems: "center",
            backgroundColor:
              sourceSquare === square
                ? "goldenrod"
                : (i + counter) % 2 === 1
                  ? blackSquareColor
                  : whiteSquareColor,
            display: "flex",
            flex: 1,
            height: boardSize / 8,
            justifyContent: "center",
            width: boardSize / 8,
          }}
        >
          <span
            className={`${color} piece fa-stack`}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              drag(square);
            }}
          >
            {targetSquares.includes(square) && (
              <FontAwesomeIcon
                className={`${targetColor} target fa-stack-1x`}
                color={targetColor}
                icon={faCircleSolid}
                style={{ color: targetColor }}
              />
            )}
            {contourColor === blackPiecesColor && (
              <FontAwesomeIcon
                className={`${contourColor}Contour fa fa-stack-2x`}
                color={contourColor}
                icon={contour}
                style={{ color: contourColor }}
              />
            )}
            <FontAwesomeIcon
              className={`${color} fa fa-stack-3x`}
              color={color}
              icon={piece}
              style={{ color }}
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
      <div style={{ display: "flex", flexDirection: "row" }}>{row}</div>,
    );
  }

  if (flip) {
    board.reverse();
  }

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (e.deltaY > 0) {
      nextMove();
    } else {
      prevMove();
    }
    e.stopPropagation();
  };

  return (
    <div
      onScroll={handleWheel}
      onScrollCapture={handleWheel}
      onWheel={handleWheel}
      onWheelCapture={handleWheel}
      style={{ width: boardSize }}
    >
      {board}
    </div>
  );
};

export default Chessboard;
