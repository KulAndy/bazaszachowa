import React from "react";
import HalfMove from "./HalfMove";
import { Move } from ".";

interface NotationProps {
  moves: Move[];
  setIndex: (x: number) => void;
  result: string | null;
  currentIndex: number;
  height: number;
}

const Notation: React.FC<NotationProps> = ({
  moves = [],
  setIndex = () => {},
  result = null,
  currentIndex = 0,
  height = 400,
}) => {
  const moveComponents: React.JSX.Element[] = [];
  const processMove = (move: Move, isMain: boolean) => {
    if (move.turn === "w") {
      moveComponents.push(
        <span style={{ fontWeight: isMain ? "bold" : "normal" }}>
          {move.moveNo + ". "}
        </span>
      );
    }

    moveComponents.push(
      <HalfMove
        move={move.san}
        doMove={() => {
          if (move.index) {
            setIndex(move.index);
          }
        }}
        isCurrent={currentIndex === move.index}
        isMain={isMain}
      />
    );

    if (move.variations.length > 0) {
      for (const variation of move.variations) {
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" }}>( </span>
        );
        if (move.turn === "b") {
          moveComponents.push(<span>{move.moveNo + "... "}</span>);
        }
        processMove(variation, false);
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" }}>) </span>
        );
      }
      if (move.next && move.turn === "w") {
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" }}>
            {move.moveNo + "... "}
          </span>
        );
      } else if (move.turn === "b") {
        moveComponents.push(<span>&nbsp;&nbsp;</span>);
        moveComponents.push(<span>&nbsp;&nbsp;</span>);
      }
    }

    if (move.next) {
      processMove(moves[move.next], isMain);
    } else if (move.turn === "w") {
      moveComponents.push(<span>&nbsp;&nbsp;</span>);
    }
  };

  if (moves[0].next) {
    processMove(moves[moves[0].next], true);
  }

  const groupedElements = [];

  for (let i = 0; i < moveComponents.length; i += 3) {
    groupedElements.push(moveComponents.slice(i, i + 3));
  }

  return (
    <div id="notation" style={{ overflow: "auto", maxHeight: height }}>
      {groupedElements.map((group, index) => (
        <p key={index}>{group}</p>
      ))}
      {result != null && (
        <p style={{ display: "inline-block" }}>
          <span> {result}</span>
        </p>
      )}
    </div>
  );
};

export default Notation;
