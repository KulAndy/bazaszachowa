import React from "react";

import { NOMENU_URLS } from "../settings";

export interface ColorStatsProps {
  color: string;
  name: string;
  // eslint-disable-next-line no-use-before-define
  stats: Stat[];
}

export interface Stat {
  count: number;
  opening: string;
  percent: number;
}

const ColorStats: React.FC<ColorStatsProps> = ({ color, name, stats }) => {
  const items = stats.map((stat, index) => ({
    ...stat,
    key: index,
  }));

  const sum = items.reduce(
    (accumulator, currentItem) => accumulator + currentItem.count,
    0,
  );

  return (
    <details>
      <summary>
        {`${color} `}
        <a
          href={`${NOMENU_URLS.profile}${encodeURIComponent(
            name,
          )}/${encodeURIComponent(color)}`}
        >
          filtruj
        </a>
      </summary>
      <table style={{ border: 0 }}>
        <tr>
          <td>Debiut</td>
          <td>ilość</td>
          <td>%</td>
          <td>filtr</td>
        </tr>

        {items.map((item) => (
          <tr key={item.key}>
            <td>{item.opening}</td>
            <td>{item.count}</td>
            <td>{item.percent}</td>
            <td>
              <a
                href={`${NOMENU_URLS.profile}${encodeURIComponent(
                  name,
                )}/${encodeURIComponent(color)}/${encodeURIComponent(
                  item.opening,
                )}`}
              >
                filtruj
              </a>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={2}>{sum}</td>
          <td colSpan={2}>
            {(
              items.reduce(
                (acc, { count, percent }) => acc + count * percent,
                0,
              ) / sum
            ).toFixed(2)}
          </td>
        </tr>
      </table>
    </details>
  );
};

export default ColorStats;
