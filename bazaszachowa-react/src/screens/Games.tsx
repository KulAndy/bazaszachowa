import "../styles/Games.scss";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import type { GameData } from "../ChessEditor";
import Content from "../components/Content";
import GamesTable from "../components/GamesTable";
import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../context/useI18n";
import { API } from "../settings";

const Games = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [white, setWhite] = useState("");
  const [black, setBlack] = useState("");
  const [ignore, setIgnore] = useState(false);
  const [minYear, setMinYear] = useState(1475);
  const [maxYear, setMaxYear] = useState(currentYear);
  const [minEco, setMinEco] = useState(1);
  const [maxEco, setMaxEco] = useState(500);
  const [base, setBase] = useState("all");
  const [searching, setSearching] = useState("classic");
  const [event, setEvent] = useState("");
  const [games, setGames] = useState<GameData[]>([]);
  const [searchedBase, setSearchedBase] = useState("all");
  const [loadingGames, setLoadingGames] = useState(false);

  const [helpOpen, setHelpOpen] = useState(false);

  const options1 = [];
  const options2 = [];
  let counter = 1;
  for (const letter of ["A", "B", "C", "D", "E"] as const) {
    for (let index = 0; index < 10; index++) {
      for (let index_ = 0; index_ < 10; index_++) {
        options1.push(
          <MenuItem key={`min-${counter}`} value={counter}>
            {letter}
            {index}
            {index_}
          </MenuItem>,
        );
        options2.push(
          <MenuItem key={`max-${counter}`} value={counter++}>
            {letter}
            {index}
            {index_}
          </MenuItem>,
        );
      }
    }
  }

  const handleSubmit = useCallback(
    (event_: React.FormEvent) => {
      event_.preventDefault();
      if (white.trim().length > 0 || black.trim().length > 0) {
        const body: Record<string, string> = {
          black,
          event,
          ignore: String(ignore),
          maxEco: String(maxEco),
          maxYear: String(maxYear),
          minEco: String(minEco),
          minYear: String(minYear),
          searching,
          table: base,
          white,
        };
        const url = new URL(API.BASE_URL + API.games.normal);
        url.search = new URLSearchParams(body).toString();
        setLoadingGames(true);
        fetch(url)
          .then((response) => response.json())
          .then((data: { rows: GameData[]; table: string }) => {
            setSearchedBase(data.table);
            setGames(data.rows);
          })
          .finally(() => {
            setLoadingGames(false);
          });
      } else {
        alert("Wymagane nazwisko przynajmniej jednego z graczy");
      }
    },
    [
      base,
      black,
      event,
      ignore,
      maxEco,
      maxYear,
      minEco,
      minYear,
      searching,
      white,
    ],
  );

  const handleToggleIgnore = useCallback(() => {
    setIgnore(!ignore);
  }, [ignore]);

  const handleMinYearChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setMinYear(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleMaxYearChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setMaxYear(Number.parseInt(event_.target.value));
    },
    [],
  );

  const handleEventChange = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) => {
      setEvent(event_.target.value);
    },
    [],
  );

  const handleMinEcoChange = useCallback(
    (event_: SelectChangeEvent<number>) => {
      setMinEco(event_.target.value);
    },
    [],
  );

  const handleMaxEcoChange = useCallback(
    (event_: SelectChangeEvent<number>) => {
      setMaxEco(event_.target.value);
    },
    [],
  );

  const closeCallback = useCallback(() => setHelpOpen(false), []);
  const openCallback = useCallback(() => setHelpOpen(true), []);

  const baseCallback = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) =>
      setBase(event_.target.value),
    [],
  );

  const searchCallback = useCallback(
    (event_: React.ChangeEvent<HTMLInputElement>) =>
      setSearching(event_.target.value),
    [],
  );

  return (
    <div id="games">
      <Content style={{ display: "flex", flexDirection: "column" } as const}>
        <div id="search-container">
          <form onSubmit={handleSubmit}>
            <table className="no-border">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <SearchPlayersWithHints
                      callback={setWhite}
                      id="white"
                      label={t("white")}
                      list="whitelist"
                      placeholder="Nowak, Jan"
                      type="text"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <SearchPlayersWithHints
                      callback={setBlack}
                      id="black"
                      label={t("black")}
                      list="blacklist"
                      placeholder="Nowak, Jan"
                      type="text"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ignore}
                          onChange={handleToggleIgnore}
                        />
                      }
                      label={t("games.ignore_colors")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("years")}:</label>
                  </td>
                  <td
                    style={
                      {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "flex-start",
                      } as const
                    }
                  >
                    <TextField
                      onChange={handleMinYearChange}
                      slotProps={
                        { htmlInput: { max: currentYear, min: 1475 } } as const
                      }
                      type="number"
                      value={minYear}
                    />
                    {" — "}
                    <TextField
                      onChange={handleMaxYearChange}
                      slotProps={
                        { htmlInput: { max: currentYear, min: 1475 } } as const
                      }
                      type="number"
                      value={maxYear}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <TextField
                      fullWidth
                      label={t("tournament")}
                      onChange={handleEventChange}
                      value={event}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {
                      // eslint-disable-next-line i18next/no-literal-string
                    }
                    ECO:
                  </td>
                  <td
                    style={
                      {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "flex-start",
                      } as const
                    }
                  >
                    <FormControl>
                      <Select onChange={handleMinEcoChange} value={minEco}>
                        {options1}
                      </Select>
                    </FormControl>
                    {" — "}
                    <FormControl>
                      <Select onChange={handleMaxEcoChange} value={maxEco}>
                        {options2}
                      </Select>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{t("base")}:</label>
                  </td>
                  <td>
                    <FormControl component="fieldset">
                      <RadioGroup onChange={baseCallback} row value={base}>
                        <FormControlLabel
                          control={<Radio />}
                          label={t("games.poland")}
                          value="poland"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label={t("games.all")}
                          value="all"
                        />
                      </RadioGroup>
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "18ch" } as const}>
                    <label>{t("games.searching")}</label>
                  </td>
                  <td>
                    <FormControl component="fieldset">
                      <RadioGroup
                        onChange={searchCallback}
                        row
                        value={searching}
                      >
                        <FormControlLabel
                          control={<Radio />}
                          label={t("games.searching_classic")}
                          value="classic"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          label={t("games.searching_exact")}
                          value="fulltext"
                        />
                      </RadioGroup>
                    </FormControl>
                  </td>
                </tr>
                <tr style={{ height: "4em" } as const}>
                  <th colSpan={2}>
                    <button>{t("games.search")}</button>
                  </th>
                </tr>
              </tbody>
            </table>
          </form>
          <div>
            <Button
              onClick={openCallback}
              sx={{ ml: 2 } as const}
              type="button"
              variant="outlined"
            >
              {t("games.help")}
            </Button>
          </div>

          <Dialog
            fullWidth
            maxWidth="sm"
            onClose={closeCallback}
            open={helpOpen}
          >
            <DialogTitle>{t("games.help")}</DialogTitle>
            <DialogContent dividers>
              <ul>
                {t("games.params")}:<li>{t("games.param.player")}</li>
                <li>
                  {t("games.param.eco")}{" "}
                  <a href={t("eco_href")}>{t("games.param.ecoLink")}</a>
                </li>
                <li>
                  {t("games.param.database")}
                  <ul>
                    <li>{t("games.param.database.pl")}</li>
                    <li>{t("games.param.database.all")}</li>
                  </ul>
                </li>
                <li>
                  {t("games.param.search")}
                  <ul>
                    <li>{t("games.param.search.normal")}</li>
                    <li>{t("games.param.search.exact")}</li>
                  </ul>
                </li>
              </ul>
            </DialogContent>
          </Dialog>
        </div>
        {loadingGames ? (
          <div>
            <div className="loading">
              <CircularProgress />
              <Typography>{t("games.loading_games")}...</Typography>
            </div>
          </div>
        ) : (
          <GamesTable base={searchedBase} games={games} noEmpty={true} />
        )}
      </Content>
    </div>
  );
};

export default Games;
