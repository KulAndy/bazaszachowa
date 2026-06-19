/* eslint-disable unicorn/prefer-https */
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
import axios, { type AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

import { useI18n } from "../context/useI18n";
import { API } from "../settings";

import TournamentTimeSeries from "./stats/TournamentTimeSeries";

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
    void axios
      .get(
        API.BASE_URL + API.poland_tournaments + encodeURIComponent(name || ""),
      )
      .then((response: AxiosResponse<Tournament[]>) => response.data)
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
        {t("player.poland_tournaments")}: {tournaments.length}
      </AccordionSummary>
      <AccordionDetails>
        <TournamentTimeSeries series={tournaments} />
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
                    {item.url ? <a href={item.url}>{t("link")}</a> : null}
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
