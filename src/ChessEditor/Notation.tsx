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
  setIndex = () => {},
}) => {
  const moveComponents: React.JSX.Element[] = [];
  const processMove = (move: Move, isMain: boolean) => {
    if (move.turn === "w") {
      moveComponents.push(
        <span style={{ fontWeight: isMain ? "bold" : "normal" } as const}>
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
        move={move.san}
      />,
    );

    if (move.variations.length > 0) {
      for (const variation of move.variations) {
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" } as const}>
            ({" "}
          </span>,
        );
        if (move.turn === "b") {
          moveComponents.push(<span>{`${move.moveNo}... `}</span>);
        }
        processMove(variation, false);
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" } as const}>
            ){" "}
          </span>,
        );
      }
      if (move.next && move.turn === "w") {
        moveComponents.push(
          <span style={{ fontWeight: isMain ? "bold" : "normal" } as const}>
            {`${move.moveNo}... `}
          </span>,
        );
      } else if (move.turn === "b") {
        moveComponents.push(
          <span>&nbsp;&nbsp;</span>,
          <span>&nbsp;&nbsp;</span>,
        );
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

  for (let index = 0; index < moveComponents.length; index += 3) {
    groupedElements.push(moveComponents.slice(index, index + 3));
  }

  return (
    <div id="notation" style={{ maxHeight: height, overflow: "auto" } as const}>
      {groupedElements.map((group, index) => (
        <p key={index}>{group}</p>
      ))}
      {result ? (
        <p style={{ display: "inline-block" } as const}>
          <span> {result}</span>
        </p>
      ) : null}
    </div>
  );
};

export default Notation;
