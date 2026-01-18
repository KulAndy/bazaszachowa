import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { countBy, flatMap, noop, sumBy } from "es-toolkit";
import { type HTMLProps } from "react";

import { useI18n } from "../context/useI18n";

export interface StatsItem {
  games: number;
  move: string;
  points: number;
  stats: Record<number, MoveStats>;
  years: number[];
}

interface MoveStats {
  count: number;
  points: number;
}

interface PositionMovesProperties extends HTMLProps<HTMLDivElement> {
  readonly doMove?: (move: string) => void;
  readonly stats: StatsItem[];
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
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
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

const PositionMoves: React.FC<PositionMovesProperties> = ({
  doMove = noop,
  stats,
  ...properties
}) => {
  const { t } = useI18n();
  if (!stats || stats.length === 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const yearsMap = countBy(
    flatMap(stats, (stat) => stat.years),
    (item) => item,
  );

  const yearBound = 10;
  const base = Math.pow(yearBound, 1 / yearBound);

  const total = sumBy(
    stats,
    (item) => item.years.length * Math.pow(base, yearBound),
  );

  const values = stats.map((item) =>
    sumBy(item.years, (year) =>
      Math.pow(
        base,
        year <= currentYear - yearBound - 1
          ? 1
          : yearBound - (currentYear - year),
      ),
    ),
  );

  const maxValue = Math.max(...values);
  const maxYear = Math.max(...Object.keys(yearsMap).map(Number));
  const minYear = Math.min(...Object.keys(yearsMap).map(Number));

  let scaleFactor = 1;
  const denominator =
    1 +
    (maxYear <= currentYear - yearBound
      ? yearBound
      : currentYear - maxYear + 1);
  if (maxValue !== 0 && maxValue < total / denominator) {
    scaleFactor = total / maxValue / denominator;
  }

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
    <div {...properties}>
      <Table id="stats">
        <TableHead>
          <TableRow>
            <TableCell>{t("move")}</TableCell>
            <TableCell>{t("no_games")}</TableCell>
            <TableCell>%</TableCell>
            <TableCell>{t("latest")}</TableCell>
            <TableCell>
              {
                // eslint-disable-next-line i18next/no-literal-string
              }
              F&alpha;
            </TableCell>
            <TableCell>
              {
                // eslint-disable-next-line i18next/no-literal-string
              }
              F&beta;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((item, index) => (
            <TableRow key={item.move} onClick={() => doMove(item.move)}>
              <TableCell>{item.move}</TableCell>
              <TableCell>{item.games}</TableCell>
              <TableCell>
                {((item.points / item.games) * 100).toFixed(2)}
              </TableCell>
              <TableCell>{Math.max(...item.years)}</TableCell>
              <TableCell>
                {(((values[index] * scaleFactor) / total) * 100).toFixed(2)}%
                <br />
                <meter max={total} value={values[index] * scaleFactor} />
              </TableCell>
              <TableCell>
                {(
                  calcProbability({
                    eps: 0.1,
                    minYear,
                    moveStats: item.stats,
                    year: currentYear,
                    yearsMap,
                  }) *
                  scaleFactor2 *
                  100
                ).toFixed(2)}
                %
                <br />
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PositionMoves;
