const HalfMove = ({
  doMove = () => {},
  isCurrent = false,
  isMain = true,
  move = "",
}: {
  readonly doMove: () => void;
  readonly isCurrent: boolean;
  readonly isMain: boolean;
  readonly move: string;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
  );
};

export default HalfMove;
