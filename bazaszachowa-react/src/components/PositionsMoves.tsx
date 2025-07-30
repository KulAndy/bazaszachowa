import React, { HTMLProps } from "react";

export interface StatsItem {
  games: number;
  move: string;
  points: number;
  // eslint-disable-next-line no-use-before-define
  stats: Record<number, MoveStats>;
  years: number[];
}

interface MoveStats {
  count: number;
  points: number;
}

interface PositionMovesProps extends HTMLProps<HTMLDivElement> {
  doMove?: ((move: string) => void) | void;
  stats: StatsItem[];
}

const systemBase = 1 / 2;

const calcProbability = ({
  eps = 0.1,
  minYear = 0,
  moveStats = {},
  year,
  yearsMap = {},
}: {
  eps?: number;
  minYear?: number;
  moveStats: Record<number, MoveStats>;
  year: number;
  yearsMap: Record<number, number>;
}): number => {
  let probability = 1;

  for (let currentYear = minYear; currentYear <= year; currentYear++) {
    probability *= systemBase;
    const yearPercentage =
      yearsMap[currentYear] &&
      moveStats[currentYear] &&
      moveStats[currentYear].count
        ? Math.max(moveStats[currentYear].count / yearsMap[currentYear], eps) *
          Math.max(
            moveStats[currentYear].points / moveStats[currentYear].count,
            eps,
          )
        : eps ** 2;

    probability += yearPercentage * systemBase;
  }

  return probability;
};

const PositionMoves: React.FC<PositionMovesProps> = ({
  doMove = () => {},
  stats,
  ...props
}) => {
  if (!stats || stats.length === 0) {
    return <></>;
  }

  const currentYear = new Date().getFullYear();

  const yearsMap: Record<number, number> = {};
  const moveMap: Record<string, Record<number, number>> = {};
  for (const stat of stats) {
    moveMap[stat.move] = {};
    for (const year of stat.years) {
      yearsMap[year] = (yearsMap[year] || 0) + 1;
      moveMap[stat.move][year] = (moveMap[stat.move][year] || 0) + 1;
    }
  }

  const yearBound = 10;
  const base = Math.pow(yearBound, 1 / yearBound);

  const total = stats.reduce(
    (accumulator, stat) =>
      accumulator + stat.years.length * Math.pow(base, yearBound),
    0,
  );

  const values = stats.map((item) =>
    item.years.reduce(
      (accum, year) =>
        accum +
        Math.pow(
          base,
          year <= currentYear - yearBound - 1
            ? 1
            : yearBound - (currentYear - year),
        ),
      0,
    ),
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

  const minYear = Math.min(...Object.keys(yearsMap).map(Number));
  const values2 = stats.map((item) =>
    calcProbability({
      eps: 0.1,
      minYear,
      moveStats: item.stats,
      year: currentYear,
      yearsMap,
    }),
  );

  const maxValue2 = Math.max(...values2);

  let scaleFactor2 = 1;
  const denominator2 =
    1 +
    (maxYear <= currentYear - yearBound
      ? yearBound
      : currentYear - maxYear + 1);
  if (maxValue2 !== 0 && maxValue2 < 1 / denominator2) {
    scaleFactor2 = 1 / maxValue2 / denominator2;
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
            <th>&alpha;</th>
            <th>&beta;</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr key={item.move} onClick={() => doMove(item.move)}>
              <td>{item.move}</td>
              <td>{item.games}</td>
              <td>{((item.points / item.games) * 100).toFixed(2)}</td>
              <td>{Math.max(...item.years)}</td>
              <td>
                <meter max={total} value={values[index] * scaleFactor} />
              </td>
              <td>
                <meter
                  max={1}
                  value={
                    calcProbability({
                      eps: 0.1,
                      minYear,
                      moveStats: item.stats,
                      year: currentYear,
                      yearsMap,
                    }) * scaleFactor2
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionMoves;
