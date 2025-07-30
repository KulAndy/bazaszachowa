import React from "react";

const HalfMove = ({
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
        style={{
          fontWeight: isMain ? "bold" : "normal",
        }}
      >
        {`${move} `}
      </span>
    </>
  );
};

export default HalfMove;
