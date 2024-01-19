import React from "react";

const HalfMove = ({
  move = "",
  doMove = () => {},
  isCurrent = false,
  isMain = true,
}) => {
  return (
    <>
      <span
        className="move"
        onClick={doMove}
        style={{
          fontWeight: isMain ? "bold" : "normal",
          backgroundColor: isCurrent ? "goldenrod" : null,
        }}
      >
        {move + " "}
      </span>
    </>
  );
};

export default HalfMove;
