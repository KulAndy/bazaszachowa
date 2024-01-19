import React from "react";
import ColorStats from "./ColorStats";
import { NOMENU_URLS } from "../settings";

const OpeningsStats = ({ stats, name }) => {
  const sum =
    stats.whites.reduce(
      (accumulator, currentItem) => accumulator + currentItem.count,
      0
    ) +
    stats.blacks.reduce(
      (accumulator, currentItem) => accumulator + currentItem.count,
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
