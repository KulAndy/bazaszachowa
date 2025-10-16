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
  TextField,
  Typography,
} from "@mui/material";
import { useActionState, useCallback, useRef, useState } from "react";

import type { GameData } from "../ChessEditor";
import Content from "../components/Content";
import GamesTable from "../components/GamesTable";
import SearchPlayersWithHint from "../components/SearchPlayersWithHint";
import SubmitButton from "../components/SubmitButton";
import { useI18n } from "../context/useI18n";
import { API } from "../settings";

const Games = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const formReference = useRef<HTMLFormElement>(null);
  const [ignore, setIgnore] = useState(false);
  const [searchedBase, setSearchedBase] = useState("all");
  const [helpOpen, setHelpOpen] = useState(false);

  const [games, submitAction, isPending] = useActionState(
    async (previousState: GameData[], formData: FormData) => {
      const whiteForm = formData.get("white") as string;
      const blackForm = formData.get("black") as string;
      if (!whiteForm.trim() && !blackForm.trim()) {
        alert("Wymagane nazwisko przynajmniej jednego z graczy");
        return previousState;
      }

      const body: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (value && typeof value !== "object") {
          body[key] = String(value);
        }
      }
      body.ignore = String(ignore);

      const url = new URL(API.BASE_URL + API.games.normal);
      url.search = new URLSearchParams(body).toString();

      const response = await fetch(url);
      const data = (await response.json()) as {
        rows: GameData[];
        table: string;
      };
      setSearchedBase(data.table);
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

  const handleToggleIgnore = useCallback(() => {
    setIgnore((previous) => !previous);
  }, []);

  const closeCallback = useCallback(() => setHelpOpen(false), []);
  const openCallback = useCallback(() => setHelpOpen(true), []);

  return (
    <div id="games">
      <Content style={{ display: "flex", flexDirection: "column" } as const}>
        <div id="search-container">
          <form action={submitAction} ref={formReference}>
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
                      defaultValue={1475}
                      name="minYear"
                      slotProps={
                        {
                          htmlInput: { max: currentYear, min: 1475 },
                        } as const
                      }
                      type="number"
                    />
                    {" — "}
                    <TextField
                      defaultValue={currentYear}
                      name="maxYear"
                      slotProps={
                        {
                          htmlInput: { max: currentYear, min: 1475 },
                        } as const
                      }
                      type="number"
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <TextField
                      defaultValue=""
                      fullWidth
                      label={t("tournament")}
                      name="event"
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
                      <Select defaultValue="A00" name="minEco">
                        {options1}
                      </Select>
                    </FormControl>
                    {" — "}
                    <FormControl>
                      <Select defaultValue="E99" name="maxEco">
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
                      <RadioGroup defaultValue="all" name="table" row>
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
                      <RadioGroup defaultValue="classic" name="searching" row>
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
                    <SubmitButton text={t("games.search")} />
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
