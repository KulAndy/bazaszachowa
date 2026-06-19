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
  TextField,
  Typography,
} from "@mui/material";
import axios, { type AxiosResponse } from "axios";
import { useActionState, useState } from "react";

import type { GameData } from "../ChessEditor";
import Content from "../components/app/Content";
import SubmitButton from "../components/app/SubmitButton";
import GamesTable from "../components/GamesTable";
import SearchPlayersWithHint from "../components/player/SearchPlayersWithHint";
import { useI18n } from "../context/useI18n";
import { API } from "../settings";

const currentYear = new Date().getFullYear();

const Games = () => {
  const { t } = useI18n();
  const [ignore, setIgnore] = useState(false);
  const [searchedBase, setSearchedBase] = useState("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [minYear, setMinYear] = useState("1475");
  const [maxYear, setMaxYear] = useState(currentYear.toString());
  const [tournamentEvent, setTournamentEvent] = useState("");

  const [base, setBase] = useState("all");
  const [searching, setSearching] = useState("classic");
  const [minEco, setMinEco] = useState("A00");
  const [maxEco, setMaxEco] = useState("E99");

  const [games, submitAction, isPending] = useActionState(
    async (previousState: GameData[], formData: FormData) => {
      const whiteForm = formData.get("white") as string;
      const blackForm = formData.get("black") as string;
      if (!whiteForm.trim() && !blackForm.trim()) {
        alert(t("games.min1"));
        return previousState;
      }

      const body: Record<string, string> = {
        black: blackForm,
        event: tournamentEvent,
        ignore: String(ignore),
        maxEco,
        maxYear,
        minEco,
        minYear,
        searching,
        table: base,
        white: whiteForm,
      };

      const response: AxiosResponse<{ rows: GameData[]; table: string }> =
        await axios.get(API.BASE_URL + API.games.normal, {
          params: body,
        });

      const data: {
        rows: GameData[];
        table: string;
      } = response.data;
      setSearchedBase(data.table);

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return data.rows;
    },
    [],
  );

  const options1 = [];
  const options2 = [];
  let counter = 1;
  for (const letter of ["A", "B", "C", "D", "E"] as const) {
    for (let index = 0; index < 10; index++) {
      for (let index_ = 0; index_ < 10; index_++) {
        const ecoValue = `${letter}${index}${index_}`;
        options1.push(
          <MenuItem key={`min-${counter}`} value={ecoValue}>
            {ecoValue}
          </MenuItem>,
        );
        options2.push(
          <MenuItem key={`max-${counter++}`} value={ecoValue}>
            {ecoValue}
          </MenuItem>,
        );
      }
    }
  }

  return (
    <div id="games">
      <Content
        style={
          {
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
          } as const
        }
      >
        <div
          id="search-container"
          style={
            { display: "flex", flexDirection: "row", margin: "auto" } as const
          }
        >
          <form action={submitAction}>
            <table className="no-border">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <SearchPlayersWithHint
                      id="white"
                      label={t("white")}
                      list="whitelist"
                      name="white"
                      placeholder="Nowak, Jan"
                      type="text"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <SearchPlayersWithHint
                      id="black"
                      label={t("black")}
                      list="blacklist"
                      name="black"
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
                          onChange={() => {
                            setIgnore((previous) => !previous);
                          }}
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
                    <FormControl>
                      <TextField
                        defaultValue={minYear}
                        name="minYear"
                        onChange={(event) => setMinYear(event.target.value)}
                        slotProps={
                          {
                            htmlInput: { max: currentYear, min: 1475 },
                          } as const
                        }
                        type="number"
                        value={minYear}
                      />
                    </FormControl>

                    {" — "}

                    <FormControl>
                      <TextField
                        defaultValue={maxYear}
                        name="maxYear"
                        onChange={(event) => setMaxYear(event.target.value)}
                        slotProps={
                          {
                            htmlInput: { max: currentYear, min: 1475 },
                          } as const
                        }
                        type="number"
                        value={maxYear}
                      />
                    </FormControl>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <TextField
                      fullWidth
                      label={t("tournament")}
                      name="event"
                      onChange={(event) =>
                        setTournamentEvent(event.target.value)
                      }
                      value={tournamentEvent}
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
                      <Select
                        name="minEco"
                        onChange={(event) => setMinEco(event.target.value)}
                        value={minEco}
                      >
                        {options1}
                      </Select>
                    </FormControl>
                    {" — "}
                    <FormControl>
                      <Select
                        defaultValue="E99"
                        name="maxEco"
                        onChange={(event) => setMaxEco(event.target.value)}
                        value={maxEco}
                      >
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
                      <RadioGroup
                        name="table"
                        onChange={(event) => setBase(event.target.value)}
                        row
                        value={base}
                      >
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
                        name="searching"
                        onChange={(event) => setSearching(event.target.value)}
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

                <tr>
                  <th colSpan={2}>
                    <SubmitButton text={t("games.search")} />
                  </th>
                </tr>
              </tbody>
            </table>
          </form>
          <div>
            <Button
              onClick={() => setHelpOpen(true)}
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
            onClose={() => setHelpOpen(false)}
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
        {isPending ? (
          <div className="loading">
            <CircularProgress />
            <Typography>{t("games.loading_games")}...</Typography>
          </div>
        ) : (
          <GamesTable base={searchedBase} games={games} noEmpty={true} />
        )}
      </Content>
    </div>
  );
};

export default Games;
