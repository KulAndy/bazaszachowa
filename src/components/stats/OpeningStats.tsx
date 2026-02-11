import { sumBy } from "es-toolkit";
import { Link } from "react-router-dom";

import { useI18n } from "../../context/useI18n";
import { NOMENU_URLS } from "../../settings";

import ColorStats, { type Stat } from "./ColorStats";

interface OpeningsStatsProperties {
  readonly name: string;
  readonly stats: {
    blacks: Stat[];
    whites: Stat[];
  };
}

const OpeningsStats: React.FC<OpeningsStatsProperties> = ({ name, stats }) => {
  const { t } = useI18n();
  const sum =
    sumBy(stats.whites, (item) => item.count) +
    sumBy(stats.blacks, (item) => item.count);

  return (
    <table id="stats_table" style={{ border: 0 } as const}>
      <tbody>
        <tr>
          <td colSpan={4} style={{ padding: 0 } as const}>
            <ColorStats color="white" name={name} stats={stats.whites} />
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            <ColorStats color="black" name={name} stats={stats.blacks} />
          </td>
        </tr>
        <tr>
          <td>{t("sum")}</td>
          <td>{sum}</td>
          <td>
            {(
              sumBy(
                [...stats.whites, ...stats.blacks],
                (item) => item.count * item.percent,
              ) / sum
            ).toFixed(2)}
          </td>
          <td>
            <Link to={`${NOMENU_URLS.profile}${encodeURIComponent(name)}`}>
              {t("stats.reset")}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OpeningsStats;
