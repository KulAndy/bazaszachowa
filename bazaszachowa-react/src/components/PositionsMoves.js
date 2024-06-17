import React from "react";

const PositionMoves = ({ stats, doMove = () => {}, ...props }) => {
  if (stats === undefined || stats === null || stats.length === 0) {
    return <></>;
  }

  const smoothFactor = 10;
  const currentYear = new Date().getFullYear();

  const paretoScores = stats.map((item) =>
    item.years.reduce((total, year) => {
      const yearFactor = (1 + smoothFactor) / (currentYear - year + 1);
      return total + yearFactor;
    }, 0)
  );

  const totalParetoScore = paretoScores.reduce(
    (total, score) => total + score,
    0
  );

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
          {stats.map((item, index) => {
            const paretoScore = (paretoScores[index] / totalParetoScore) * 100;
            return (
              <tr
                key={item.move}
                onClick={() => {
                  doMove(item.move);
                }}
              >
                <td>{item.move}</td>
                <td>{item.games}</td>
                <td>{((item.points / item.games) * 100).toFixed(2)}</td>
                <td>{item.last}</td>
                <td>
                  <meter max={100} value={paretoScore} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionMoves;
