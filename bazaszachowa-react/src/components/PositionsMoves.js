import React from "react";

const PositionMoves = ({ stats, doMove = () => {}, ...props }) => {
  if (!stats || stats.length === 0) {
    return <></>;
  }

  const yearBound = 10;
  const currentYear = new Date().getFullYear();
  const base = Math.pow(yearBound, 1 / yearBound);

  const total = stats.reduce(
    (total, stat) => total + stat.years.length * Math.pow(base, yearBound),
    0
  );

  const values = stats.map((item) =>
    item.years.reduce(
      (accum, year) =>
        accum +
        Math.pow(
          base,
          year <= currentYear - yearBound - 1
            ? 1
            : yearBound - (currentYear - year)
        ),
      0
    )
  );

  const maxValue = Math.max(...values);
  const maxYear = Math.max(...stats.map((item) => Math.max(...item.years)));

  let scaleFactor = 1;
  const denominator =
    1 +
    (maxYear <= currentYear - yearBound
      ? yearBound
      : currentYear - maxYear + 1);
  if (maxValue !== 0 && maxValue < total / denominator) {
    scaleFactor = total / maxValue / denominator;
  }

  return (
    <div {...props}>
      <table id="stats">
        <thead>
          <tr>
            <th>ruch</th>
            <th>l. gier</th>
            <th>%</th>
            <th>najnowsze</th>
            <th>trend</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr
              key={item.move}
              onClick={() => {
                doMove(item.move);
              }}
            >
              <td>{item.move}</td>
              <td>{item.games}</td>
              <td>{((item.points / item.games) * 100).toFixed(2)}</td>
              <td>{Math.max(...item.years)}</td>
              <td>
                <meter max={total} value={values[index] * scaleFactor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionMoves;
