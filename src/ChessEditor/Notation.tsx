import { noop } from "es-toolkit";
import { useEffect, useRef } from "react";

import HalfMove from "./HalfMove";

import type { Move } from ".";

interface NotationProperties {
  readonly currentIndex: number;
  readonly height: number;
  readonly moves: Move[];
  readonly result: null | string;
  readonly setIndex: (x: number) => void;
}

const Notation: React.FC<NotationProperties> = ({
  currentIndex = 0,
  height = 400,
  moves = [],
  result = null,
  setIndex = noop,
}) => {
  const notationReference = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (currentIndex === 0) {
      notationReference.current?.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [currentIndex]);

  const moveComponents: React.JSX.Element[] = [];
  const processMove = (move: Move, isMain: boolean) => {
    if (move.turn === "w") {
      moveComponents.push(
        <span
          key={`${move.moveNo}w`}
          style={{ fontWeight: isMain ? "bold" : "normal" } as const}
        >
          {`${move.moveNo}. `}
        </span>,
      );
    }

    moveComponents.push(
      <HalfMove
        doMove={() => {
          if (move.index) {
            setIndex(move.index);
          }
        }}
        isCurrent={currentIndex === move.index}
        isMain={isMain}
        key={move.index}
        move={move.san}
      />,
    );

    if (move.variations.length > 0) {
      for (const variation of move.variations) {
        moveComponents.push(
          <span
            key={`${move.index}open_variant`}
            style={{ fontWeight: isMain ? "bold" : "normal" } as const}
          >
            ({" "}
          </span>,
        );
        if (move.turn === "b") {
          moveComponents.push(
            <span
              key={`${move.moveNo}b${move.index}`}
            >{`${move.moveNo}... `}</span>,
          );
        }
        processMove(variation, false);
        moveComponents.push(
          <span
            key={`${move.index}close_variant`}
            style={{ fontWeight: isMain ? "bold" : "normal" } as const}
          >
            ){" "}
          </span>,
        );
      }
      if (move.next && move.turn === "w") {
        moveComponents.push(
          <span
            key={`${move.moveNo}padding`}
            style={{ fontWeight: isMain ? "bold" : "normal" } as const}
          >
            {`${move.moveNo}... `}
          </span>,
        );
      } else if (move.turn === "b") {
        moveComponents.push(
          <span key={`${move.moveNo}padding1`}>&nbsp;&nbsp;</span>,
          <span key={`${move.moveNo}padding2`}>&nbsp;&nbsp;</span>,
        );
      }
    }

    if (move.next) {
      processMove(moves[move.next], isMain);
    } else if (move.turn === "w") {
      moveComponents.push(
        <span key={`${move.moveNo}padding`}>&nbsp;&nbsp;</span>,
      );
    }
  };

  if (moves[0].next) {
    processMove(moves[moves[0].next], true);
  }

  const groupedElements = [];

  for (let index = 0; index < moveComponents.length; index += 3) {
    groupedElements.push(<p>{moveComponents.slice(index, index + 3)}</p>);
  }

  return (
    <div
      id="notation"
      ref={notationReference}
      style={{ maxHeight: height, overflow: "auto" } as const}
    >
      {groupedElements}
      {result ? (
        <p style={{ display: "inline-block" } as const}>
          <span> {result}</span>
        </p>
      ) : null}
    </div>
  );
};

export default Notation;
