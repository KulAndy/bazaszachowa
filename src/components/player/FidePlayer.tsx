import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { useI18n } from "../../context/useI18n";

export interface FidePlayerType {
  birthday: string;
  blitz_rating: number;
  fideid: string;
  name: string;
  rapid_rating: number;
  rating: number;
  title?: string;
}

interface FidePlayerProperties {
  readonly player: FidePlayerType;
  readonly showSource?: boolean;
}

const FidePlayer: React.FC<FidePlayerProperties> = ({
  player,
  showSource = false,
}) => {
  const { t } = useI18n();
  return (
    <TableContainer component={Paper}>
      <Table className="fide-data">
        {showSource ? (
          <caption>
            <a href="https://ratings.fide.com/download_lists.phtml">FIDE</a>
          </caption>
        ) : null}
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>{player.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <a href={`https://ratings.fide.com/profile/${player.fideid}`}>
                {player.fideid}
              </a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("player.fide_title")}</TableCell>
            <TableCell>{player.title || t("none")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("player.birth_year")}</TableCell>
            <TableCell>{player.birthday}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              {
                // eslint-disable-next-line i18next/no-literal-string
              }
              Elo
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("elo.standard")}</TableCell>
            <TableCell>{player.rating}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("elo.rapid")}</TableCell>
            <TableCell>{player.rapid_rating}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t("elo.blitz")}</TableCell>
            <TableCell>{player.blitz_rating}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FidePlayer;
