import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { sumBy } from "es-toolkit";
import { Link } from "react-router-dom";

import { useI18n } from "../../context/useI18n";
import { NOMENU_URLS } from "../../settings";

export interface ColorStatsProperties {
  readonly color: string;
  readonly name: string;

  readonly stats: Stat[];
}

export interface Stat {
  count: number;
  opening: string;
  percent: number;
}

const ColorStats: React.FC<ColorStatsProperties> = ({ color, name, stats }) => {
  const { t } = useI18n();
  const sum = sumBy(stats, (item) => item.count);

  return (
    <Accordion>
      <AccordionSummary>{t(color)} </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table style={{ border: 0 } as const}>
            <TableHead>
              <TableRow>
                <TableCell>{t("opening")}</TableCell>
                <TableCell>{t("quantity")}</TableCell>
                <TableCell>%</TableCell>
                <TableCell>{t("stats.filter_header")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((item) => (
                <TableRow key={item.opening}>
                  <TableCell>{t(item.opening)}</TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell>{item.percent}</TableCell>
                  <TableCell>
                    <Link
                      to={`${NOMENU_URLS.profile}${encodeURIComponent(
                        name,
                      )}/${encodeURIComponent(color)}/${encodeURIComponent(
                        item.opening,
                      )}`}
                    >
                      {t("stats.filter")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                <TableCell>{sum}</TableCell>
                <TableCell>
                  {(
                    sumBy(stats, (item) => item.count * item.percent) / sum
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Link
                    to={`${NOMENU_URLS.profile}${encodeURIComponent(
                      name,
                    )}/${encodeURIComponent(color)}`}
                  >
                    {t("stats.filter")}
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default ColorStats;
