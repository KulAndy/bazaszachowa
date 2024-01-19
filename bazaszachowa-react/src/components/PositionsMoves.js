const PositionMoves = ({ stats, doMove = () => {}, ...props }) => {
  if (stats === undefined || stats === null || stats.length === 0) {
    return <></>;
  }

  const yearBound = 10;
  const currentYear = new Date().getFullYear();
  const total = stats.reduce(
    (total, stat) => total + stat.years.length * yearBound,
    0
  );

  return (
    <div {...props}>
      <table id="stats">
        <tr>
          <th>ruch</th>
          <th>l. gier</th>
          <th>%</th>
          <th>najnowsze</th>
          <th>trend</th>
        </tr>
        {stats.map((item) => (
          <tr
            onClick={() => {
              doMove(item.move);
            }}
          >
            <td>{item.move}</td>
            <td>{item.games}</td>
            <td>{((item.points / item.games) * 100).toFixed(2)}</td>
            <td>{item.last}</td>
            <td>
              <meter
                max={total}
                value={item.years.reduce(
                  (total, year) =>
                    total +
                    (year <= currentYear - yearBound - 1
                      ? 1
                      : yearBound - (currentYear - year)),
                  0
                )}
              />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default PositionMoves;
