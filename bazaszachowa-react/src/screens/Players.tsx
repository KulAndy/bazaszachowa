import "../styles/Players.scss";
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
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Content from "../components/Content";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../context/useI18n";
import { API, NOMENU_URLS, URLS } from "../settings";

const Players = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { name } = useParams();
  const [player, setPlayer] = useState(name);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (player !== null && player !== undefined) {
        const response = await fetch(
          API.BASE_URL + API.players + encodeURIComponent(player.trim()),
        );

        const jsonData = (await response.json()) as string[];
        setPlayers(jsonData);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      navigate(`${URLS.players.url}${player || ""}`);
    },
    [navigate, player],
  );

  return (
    <Content className="players">
      <Paper sx={{ mb: 3, p: 3 } as const}>
        <Box
          alignItems="center"
          component="form"
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent="center"
          onSubmit={handleSubmit}
        >
          <SearchPlayersWithHints
            callback={setPlayer}
            id="search-hints"
            name="search-hints"
            value={player}
          />
          <Button color="primary" type="submit" variant="contained">
            {t("search")}
          </Button>
        </Box>
      </Paper>

      {players.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold" variant="subtitle1">
                    {t("players.fullname")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold" variant="subtitle1">
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
