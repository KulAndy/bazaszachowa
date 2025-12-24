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

import TournamentTimeSeries from "./TournamentTimeSeries";

interface FideTournamentsProperties {
  readonly name: string;
}

interface Tournament {
  country: string;
  id: number;
  name: string;
  start: string;
}

const FideTournaments: React.FC<FideTournamentsProperties> = ({ name }) => {
  const { t } = useI18n();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    void fetch(
      API.BASE_URL + API.fide_tournaments + encodeURIComponent(name || ""),
    )
      .then((response) => response.json())
      .then((data: Tournament[]) => {
        setTournaments(data);
      });
  }, [name]);

  if (tournaments.length === 0) {
    return null;
  }

  return (
    <Accordion>
      <AccordionSummary>
        {t("player.fide_tournaments")}: {tournaments.length}
      </AccordionSummary>
      <AccordionDetails>
        <TournamentTimeSeries series={tournaments} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("tournament.name")}</TableCell>
                <TableCell>{t("tournament.start_date")}</TableCell>
                <TableCell>{t("tournament.country")}</TableCell>
                <TableCell>FIDE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournaments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.start.slice(0, 10)}</TableCell>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>
                    <a
                      href={`https://ratings.fide.com/report.phtml?event=${item.id}`}
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

export default FideTournaments;
