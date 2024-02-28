import "./style.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessRook as faChessRookSolid,
  faChessKnight as faChessKnightSolid,
  faChessBishop as faChessBishopSolid,
  faChessQueen as faChessQueenSolid,
  faChessKing as faChessKingSolid,
  faChessPawn as faChessPawnSolid,
  faCircle as faCircleSolid,
} from "@fortawesome/free-solid-svg-icons";

import {
  faChessRook as faChessRookRegular,
  faChessKnight as faChessKnightRegular,
  faChessBishop as faChessBishopRegular,
  faChessQueen as faChessQueenRegular,
  faChessKing as faChessKingRegular,
  faChessPawn as faChessPawnRegular,
} from "@fortawesome/free-regular-svg-icons";

const Chessboard = ({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  whitePiecesColor = "white",
  blackPiecesColor = "black",
  whiteSquareColor = "#f0d9b5",
  blackSquareColor = "#b58863",
  targetColor = "green",
  boardSize = 400,
  flip = false,
  sendSquare = () => {},
  sourceSquare = null,
  prevMove = () => {},
  nextMove = () => {},
  targetSquares = [],
}) => {
  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const drag = (square) => {
    sendSquare(square);
  };

  const drop = (square) => {
    sendSquare(square);
  };

  const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const piecesPlacement = fen.includes(" ")
    ? fen?.split(" ")[0]
    : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const piecesPlacementRows = piecesPlacement.split("/");
  let board = [];
  let key = 0;
  for (let i = 0; i < piecesPlacementRows.length && i < 8; i++) {
    let row = [];
    let counter = 0;
    for (let j = 0; j < piecesPlacementRows[i].length && j < 8; j++) {
      let piece = null;
      let color = null;
      let contour = null;
      let contourColor = null;
      switch (piecesPlacementRows[i][j]) {
        case "R":
          piece = faChessRookSolid;
          color = whitePiecesColor;
          contour = faChessRookRegular;
          contourColor = blackPiecesColor;
          break;
        case "N":
          piece = faChessKnightSolid;
          color = whitePiecesColor;
          contour = faChessKnightRegular;
          contourColor = blackPiecesColor;
          break;
        case "B":
          piece = faChessBishopSolid;
          color = whitePiecesColor;
          contour = faChessBishopRegular;
          contourColor = blackPiecesColor;
          break;
        case "Q":
          piece = faChessQueenSolid;
          color = whitePiecesColor;
          contour = faChessQueenRegular;
          contourColor = blackPiecesColor;
          break;
        case "K":
          piece = faChessKingSolid;
          color = whitePiecesColor;
          contour = faChessKingRegular;
          contourColor = blackPiecesColor;
          break;
        case "P":
          piece = faChessPawnSolid;
          color = whitePiecesColor;
          contour = faChessPawnRegular;
          contourColor = blackPiecesColor;
          break;
        case "r":
          piece = faChessRookSolid;
          color = blackPiecesColor;
          contour = faChessRookRegular;
          contourColor = whitePiecesColor;
          break;
        case "n":
          piece = faChessKnightSolid;
          color = blackPiecesColor;
          contour = faChessKnightRegular;
          contourColor = whitePiecesColor;
          break;
        case "b":
          piece = faChessBishopSolid;
          color = blackPiecesColor;
          contour = faChessBishopRegular;
          contourColor = whitePiecesColor;
          break;
        case "q":
          piece = faChessQueenSolid;
          color = blackPiecesColor;
          contour = faChessQueenRegular;
          contourColor = whitePiecesColor;
          break;
        case "k":
          piece = faChessKingSolid;
          color = blackPiecesColor;
          contour = faChessKingRegular;
          contourColor = whitePiecesColor;
          break;
        case "p":
          piece = faChessPawnSolid;
          color = blackPiecesColor;
          contour = faChessPawnRegular;
          contourColor = whitePiecesColor;
          break;
        default:
          const n = parseInt(piecesPlacementRows[i][j]);
          for (let k = 0; k < n; k++) {
            let square = LETTERS[counter] + (8 - i);
            if (targetSquares.includes(square)) {
              row.push(
                <div
                  onDragOver={allowDrop}
                  onDrop={() => {
                    drop(square);
                  }}
                  key={key++}
                  style={{
                    display: "flex",
                    flex: 1,
                    backgroundColor:
                      sourceSquare === square
                        ? "goldenrod"
                        : (i + counter) % 2 === 1
                        ? blackSquareColor
                        : whiteSquareColor,
                    width: boardSize / 8,
                    height: boardSize / 8,
                  }}
                  onClick={() => {
                    sendSquare(square);
                  }}
                >
                  <span className="target">
                    <FontAwesomeIcon
                      icon={faCircleSolid}
                      color={targetColor}
                      style={{ color: targetColor }}
                      size={boardSize / 9}
                      className={targetColor}
                    />
                  </span>
                </div>
              );
            } else {
              row.push(
                <div
                  onDragOver={allowDrop}
                  onDrop={() => {
                    drop(square);
                  }}
                  key={key++}
                  style={{
                    display: "flex",
                    flex: 1,
                    backgroundColor:
                      sourceSquare === square
                        ? "goldenrod"
                        : (i + counter) % 2 === 1
                        ? blackSquareColor
                        : whiteSquareColor,
                    width: boardSize / 8,
                    height: boardSize / 8,
                  }}
                  onClick={() => {
                    sendSquare(square);
                  }}
                />
              );
            }
            counter++;
          }
          continue;
      }
      let square = LETTERS[counter] + (8 - i);
      row.push(
        <div
          onDragOver={allowDrop}
          onDrop={() => {
            drop(square);
          }}
          key={key++}
          style={{
            display: "flex",
            flex: 1,
            backgroundColor:
              sourceSquare === square
                ? "goldenrod"
                : (i + counter) % 2 === 1
                ? blackSquareColor
                : whiteSquareColor,
            width: boardSize / 8,
            height: boardSize / 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            sendSquare(square);
          }}
        >
          <span
            className={color + " piece fa-stack"}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              drag(square);
            }}
          >
            {targetSquares.includes(square) && (
              <FontAwesomeIcon
                icon={faCircleSolid}
                color={targetColor}
                style={{ color: targetColor }}
                className={targetColor + " target fa-stack-1x"}
              />
            )}
            {contourColor === blackPiecesColor && (
              <FontAwesomeIcon
                icon={contour}
                color={contourColor}
                style={{ color: contourColor }}
                className={contourColor + "Contour fa fa-stack-2x"}
              />
            )}
            <FontAwesomeIcon
              icon={piece}
              color={color}
              style={{ color }}
              className={color + " fa fa-stack-3x"}
            />
          </span>
        </div>
      );
      counter++;
    }
    if (flip) {
      row.reverse();
    }
    board.push(
      <div style={{ display: "flex", flexDirection: "row" }}>{row}</div>
    );
  }

  if (flip) {
    board.reverse();
  }

  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      nextMove();
    } else {
      prevMove();
    }
    e.stopPropagation();
    return false;
  };

  return (
    <div
      style={{ width: boardSize }}
      onWheel={handleWheel}
      onWheelCapture={handleWheel}
      onScroll={handleWheel}
      onScrollCapture={handleWheel}
    >
      {board}
    </div>
  );
};

export default Chessboard;
