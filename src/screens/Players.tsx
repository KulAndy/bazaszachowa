import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios, { type AxiosResponse } from "axios";
import { useActionState, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Content from "../components/app/Content";
import SubmitButton from "../components/app/SubmitButton";
import SearchPlayersWithHints from "../components/player/SearchPlayersWithHint";
import { useI18n } from "../context/useI18n";
import { API, NOMENU_URLS } from "../settings";

async function fetchPlayers(formData: FormData): Promise<string[]> {
  "use server";
  return new Promise((resolve, reject) => {
    const formValue = formData.get("player");
    if (typeof formValue !== "string") {
      reject(new Error("Empty player"));
      return;
    }
    const player = formValue?.toString().trim() || "";
    axios
      .get(API.BASE_URL + API.players + encodeURIComponent(player))
      .then((response: AxiosResponse<string[]>) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(new Error("Failed to fetch players"));
      });
  });
}

const Players = () => {
  const { t } = useI18n();
  const { name } = useParams();
  const [player, setPlayer] = useState(name || "");

  const [players, submit] = useActionState(
    async (_previous: unknown, formData: FormData) => {
      const list = await fetchPlayers(formData);
      return list;
    },
    [] as string[],
  );

  return (
    <Content className="players">
      <Paper sx={{ mb: 3, p: 3 } as const}>
        <Box
          action={submit}
          component="form"
          sx={
            {
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            } as const
          }
        >
          <SearchPlayersWithHints
            callback={setPlayer}
            id="search-hints"
            name="player"
            required
            value={player}
          />
          <SubmitButton text={t("search")} />
        </Box>
      </Paper>

      {players.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    sx={{ fontWeight: "bold" } as const}
                    variant="subtitle1"
                  >
                    {t("players.fullname")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ fontWeight: "bold" } as const}
                    variant="subtitle1"
                  >
                    {t("players.profile")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((item) => (
                <TableRow key={item}>
                  <TableCell>{item}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      size="small"
                      to={NOMENU_URLS.profile + encodeURIComponent(item)}
                      variant="outlined"
                    >
                      {t("players.see")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Content>
  );
};

export default Players;
