import { noop } from "es-toolkit";
import { useEffect, useRef } from "react";

const HalfMove = ({
  doMove = noop,
  isCurrent = false,
  isMain = true,
  move = "",
}: {
  readonly doMove: () => void;
  readonly isCurrent: boolean;
  readonly isMain: boolean;
  readonly move: string;
}) => {
  const halfMoveReference = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isCurrent) {
      halfMoveReference.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isCurrent]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      className={`move ${isCurrent ? "active" : ""}`}
      onClick={doMove}
      ref={halfMoveReference}
      style={
        {
          fontWeight: isMain ? "bold" : "normal",
        } as const
      }
    >
      {`${move} `}
    </span>
  );
};

export default HalfMove;
