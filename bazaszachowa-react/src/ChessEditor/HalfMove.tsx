/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

const HalfMove = ({
  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
  doMove = () => {},
  isCurrent = false,
  isMain = true,
  move = "",
}: {
  doMove: () => void;
  isCurrent: boolean;
  isMain: boolean;
  move: string;
}) => {
  return (
    <>
      <span
        className={`move ${isCurrent ? "active" : ""}`}
        onClick={doMove}
        style={
          {
            fontWeight: isMain ? "bold" : "normal",
          } as const
        }
      >
        {`${move} `}
      </span>
    </>
  );
};

export default HalfMove;
