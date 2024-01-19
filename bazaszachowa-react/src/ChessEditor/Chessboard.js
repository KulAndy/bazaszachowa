import "./style.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessQueen,
  faChessKing,
  faChessPawn,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

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
      switch (piecesPlacementRows[i][j]) {
        case "R":
          piece = faChessRook;
          color = whitePiecesColor;
          break;
        case "N":
          piece = faChessKnight;
          color = whitePiecesColor;
          break;
        case "B":
          piece = faChessBishop;
          color = whitePiecesColor;
          break;
        case "Q":
          piece = faChessQueen;
          color = whitePiecesColor;
          break;
        case "K":
          piece = faChessKing;
          color = whitePiecesColor;
          break;
        case "P":
          piece = faChessPawn;
          color = whitePiecesColor;
          break;
        case "r":
          piece = faChessRook;
          color = blackPiecesColor;
          break;
        case "n":
          piece = faChessKnight;
          color = blackPiecesColor;
          break;
        case "b":
          piece = faChessBishop;
          color = blackPiecesColor;
          break;
        case "q":
          piece = faChessQueen;
          color = blackPiecesColor;
          break;
        case "k":
          piece = faChessKing;
          color = blackPiecesColor;
          break;
        case "p":
          piece = faChessPawn;
          color = blackPiecesColor;
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
                      icon={faCircle}
                      color={targetColor}
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
                icon={faCircle}
                color={targetColor}
                className={targetColor + " target fa-stack-1x"}
              />
            )}
            <FontAwesomeIcon
              icon={piece}
              color={color}
              className={color + " fa fa-stack-2x"}
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
