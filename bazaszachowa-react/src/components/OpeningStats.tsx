import React from "react";
import ColorStats, { Stat } from "./ColorStats";
import { NOMENU_URLS } from "../settings";

interface OpeningsStatsProps {
  stats: {
    whites: Stat[];
    blacks: Stat[];
  };
  name: string;
}

const OpeningsStats: React.FC<OpeningsStatsProps> = ({ stats, name }) => {
  const sum =
    stats.whites.reduce(
      (accumulator: number, currentItem: Stat) =>
        accumulator + currentItem.count,
      0
    ) +
    stats.blacks.reduce(
      (accumulator: number, currentItem: Stat) =>
        accumulator + currentItem.count,
      0
    );

  return (
    <table id="stats_table" style={{ border: 0 }}>
      <tr>
        <td colSpan={4} style={{ padding: 0 }}>
          <ColorStats name={name} color={"white"} stats={stats.whites} />
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <ColorStats name={name} color={"black"} stats={stats.blacks} />
        </td>
      </tr>
      <tr>
        <td>Suma</td>
        <td>{sum}</td>
        <td>
          {(
            stats.whites
              .concat(stats.blacks)
              .reduce((acc, { count, percent }) => acc + count * percent, 0) /
            sum
          ).toFixed(2)}
        </td>
        <td>
          <a href={`${NOMENU_URLS.profile}${encodeURIComponent(name)}`}>
            resetuj filtruj
          </a>
        </td>
      </tr>
    </table>
  );
};

export default OpeningsStats;
