import { useI18n } from "../i18n/I18nContext";
import { NOMENU_URLS } from "../settings";

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
    stats.whites.reduce(
      (accumulator: number, currentItem: Stat) =>
        accumulator + currentItem.count,
      0,
    ) +
    stats.blacks.reduce(
      (accumulator: number, currentItem: Stat) =>
        accumulator + currentItem.count,
      0,
    );

  return (
    <table id="stats_table" style={{ border: 0 } as const}>
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
            [...stats.whites, ...stats.blacks].reduce(
              (accumulator, { count, percent }) =>
                accumulator + count * percent,
              0,
            ) / sum
          ).toFixed(2)}
        </td>
        <td>
          <a href={`${NOMENU_URLS.profile}${encodeURIComponent(name)}`}>
            {t("stats.reset")}
          </a>
        </td>
      </tr>
    </table>
  );
};

export default OpeningsStats;
