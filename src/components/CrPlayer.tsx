import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { useI18n } from "../context/useI18n";

export interface CrPlayerType {
  fide_id: string;
  id: string;
  kat?: string;
  name: string;
}

interface CrPlayerProperties {
  readonly player: CrPlayerType;
  readonly showSource?: boolean;
}

const CrPlayer: React.FC<CrPlayerProperties> = ({
  player,
  showSource = false,
}) => {
  const { t } = useI18n();
  return (
    <TableContainer component={Paper}>
      <Table className="cr-data">
        {showSource ? (
          <caption>
            <a href="https://www.cr-pzszach.pl">CR</a>
          </caption>
        ) : null}
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}> {player.name}</TableCell>
            <TableCell rowSpan={4}>
              <img
                alt="zdjęcie z cr-u"
                className="cr-foto"
                onError={(event) => {
                  const target = event.target as HTMLElement;
                  target.parentElement?.remove();
                }}
                src={`http://www.cr-pzszach.pl/ew/ew/images/${player.id}.jpg`}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("player.cr_title")}</TableCell>
            <TableCell>
              {player.kat ? <span>{player.kat}</span> : null}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {
                // eslint-disable-next-line i18next/no-literal-string
              }
              CR ID
            </TableCell>
            <TableCell>
              <a
                href={`http://www.cr-pzszach.pl/ew/viewpage.php?page_id=1&zwiazek=&typ_czlonka=&pers_id=${player.id}`}
              >
                PL-{player.id}
              </a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {
                // eslint-disable-next-line i18next/no-literal-string
              }
              FIDE ID
            </TableCell>
            <TableCell>
              <a href={`https://ratings.fide.com/profile/${player.fide_id}`}>
                {player.fide_id}
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CrPlayer;
