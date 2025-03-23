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
        className={`move ${isCurrent ? "active" : ""}`}
        onClick={doMove}
        style={{
          fontWeight: isMain ? "bold" : "normal",
        }}
      >
        {move + " "}
      </span>
    </>
  );
};

export default HalfMove;
