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
import React, { useEffect, useState } from "react";

import { useI18n } from "../context/useI18n";
import { API } from "../settings";

interface PolandTournamentsProperties {
  readonly name: string;
}

interface Tournament {
  end: string;
  id: number;
  name: string;
  start: string;
  url: string;
}
const PolandTournaments: React.FC<PolandTournamentsProperties> = ({ name }) => {
  const { t } = useI18n();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    void fetch(
      API.BASE_URL + API.poland_tournaments + encodeURIComponent(name || ""),
    )
      .then((response) => response.json())
      .then((data: Tournament[]) => {
        setTournaments(data);
      });
  }, [name]);

  return (
    <Accordion>
      <AccordionSummary>
        {t("player.poland_tournaments")}: {tournaments.length}
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("tournament.name")}</TableCell>
                <TableCell>{t("tournament.start_date")}</TableCell>
                <TableCell>{t("tournament.end_date")}</TableCell>
                <TableCell>{t("tournament.page")}</TableCell>
                <TableCell>CR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournaments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.start.slice(0, 10)}</TableCell>
                  <TableCell>{item.end.slice(0, 10)}</TableCell>
                  <TableCell>
                    <a href={item.url}>{t("link")}</a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`http://www.cr-pzszach.pl/ew/viewpage.php?page_id=10&id_turnieju=${item.id}`}
                    >
                      {item.id}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default PolandTournaments;
