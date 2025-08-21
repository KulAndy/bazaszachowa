import React from "react";

import { useI18n } from "../i18n/I18nContext";
import { NOMENU_URLS } from "../settings";

export interface ColorStatsProperties {
  readonly color: string;
  readonly name: string;
  // eslint-disable-next-line no-use-before-define
  readonly stats: Stat[];
}

export interface Stat {
  count: number;
  opening: string;
  percent: number;
}

const ColorStats: React.FC<ColorStatsProperties> = ({ color, name, stats }) => {
  const { t } = useI18n();
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
        {t(color)}{" "}
        <a
          href={`${NOMENU_URLS.profile}${encodeURIComponent(
            name,
          )}/${encodeURIComponent(color)}`}
        >
          {t("stats.filter")}
        </a>
      </summary>
      <table style={{ border: 0 } as const}>
        <tr>
          <td>{t("opening")}</td>
          <td>{t("quantity")}</td>
          <td>%</td>
          <td>{t("stats.filter_header")}</td>
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
                {t("stats.filter")}
              </a>
            </td>
          </tr>
        ))}
        <tr>
          <td />
          <td>{sum}</td>
          <td>
            {(
              items.reduce(
                (accumulator, { count, percent }) =>
                  accumulator + count * percent,
                0,
              ) / sum
            ).toFixed(2)}
          </td>
          <td />
        </tr>
      </table>
    </details>
  );
};

export default ColorStats;
