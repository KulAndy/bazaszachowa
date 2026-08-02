import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { round, sumBy, uniq } from "es-toolkit";
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Content from "../../components/app/Content";
import { useI18n } from "../../context/useI18n";

import {
  calculateAvgRating,
  calculateDelta,
  calculateGameResults,
  countPlayedGames,
  getNorm,
  playerRating,
} from "./calculations";
import { TITLES } from "./constants";
import OpponentRow, { type Opponent } from "./OpponentRow";
import PlayerRow, { type Player } from "./PlayerRow";

import "./styles.scss";

const getRatingRanges = (sex: "F" | "M") => {
  const ratings = uniq(
    TITLES.filter((item) => item.sex === sex && item.rating !== null).map(
      (item) => item.rating,
    ),
  ).toSorted((a, b) => b - a);

  return ratings.map((rating, index) => ({
    max: index === 0 ? null : rating,
    min: index === ratings.length - 1 ? null : ratings[index + 1] + 1,
    rating,
  }));
};

const femaleRatingRanges = getRatingRanges("F");
const maleRatingRanges = getRatingRanges("M");

const PZSzachCalculator = () => {
  const { t } = useI18n();
  const [player, setPlayer] = useState<Player>({
    sex: "M",
    title: "bk",
  });
  const [system, setSystem] = useState("swiss");
  const [rounds, setRounds] = useState(9);
  const [baseTime, setBaseTime] = useState(90);
  const [increment, setIncrement] = useState(30);
  const [controlBonus, setControlBonus] = useState(0);
  const [showEloConverting, setShowEloConverting] = useState(false);

  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const updateOpponent = useCallback(
    (index: number) => (value: SetStateAction<Opponent>) => {
      setOpponents((previous) =>
        // eslint-disable-next-line sonarjs/no-nested-functions
        previous.map((opponent, currentIndex) => {
          if (currentIndex !== index) {
            return opponent;
          }

          return typeof value === "function" ? value(opponent) : value;
        }),
      );
    },
    [],
  );

  useEffect(() => {
    if (rounds < opponents.length) {
      setOpponents((previous) => previous.slice(0, rounds));
    } else if (rounds > opponents.length) {
      setOpponents((previous) => [
        ...previous,
        ...Array.from(
          { length: rounds - previous.length },
          () =>
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            ({
              result: "P",
              sex: "M",
              title: "bk",
            }) as Opponent,
        ),
      ]);
    }
  }, [rounds, setOpponents, opponents.length]);

  const playedGames = useMemo(() => countPlayedGames(opponents), [opponents]);
  const gameResults = useMemo(
    () => calculateGameResults(opponents),
    [opponents],
  );
  const averageRating = useMemo(
    () =>
      calculateAvgRating([
        player,
        ...opponents.filter((item) => ["=", "0", "1"].includes(item.result)),
      ]),
    [player, opponents],
  );
  const delta = useMemo(() => calculateDelta(opponents), [opponents]);
  const { remark, title } = useMemo(
    () =>
      getNorm(
        player,
        opponents.filter((item) => ["=", "0", "1"].includes(item.result)),
        baseTime + increment + controlBonus,
        system === "round-robin",
      ),
    [player, opponents, system, baseTime, increment, controlBonus],
  );
  return (
    <div id="calculator">
      <Content>
        <Typography variant="h4">
          {t("pol_calculator.tournament_data")}
        </Typography>
        <Box>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t("system")}</FormLabel>
            <RadioGroup
              onChange={(event) => setSystem(event.target.value)}
              sx={{ display: "flex", flexDirection: "row" } as const}
              value={system}
            >
              <FormControlLabel
                control={<Radio />}
                label={t("pol_calculator.swiss")}
                value="swiss"
              />
              <FormControlLabel
                control={<Radio />}
                label={t("pol_calculator.round_robin")}
                value="round-robin"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <TextField
            label={t("pol_calculator.no_rounds")}
            onChange={(event) =>
              setRounds(Number.parseInt(event.target.value) || 0)
            }
            type="number"
            value={rounds || ""}
          />
        </Box>
        <Box>
          <FormControl
            component="fieldset"
            sx={
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              } as const
            }
          >
            <FormLabel
              component="legend"
              sx={{ marginBottom: 1, marginX: "auto" } as const}
            >
              {t("pol_calculator.rate")}
            </FormLabel>
            <TextField
              label={t("pol_calculator.base_time")}
              onChange={(event) =>
                setBaseTime(Number.parseInt(event.target.value) || 0)
              }
              type="number"
              value={baseTime || ""}
            />
            <TextField
              label={t("pol_calculator.increment")}
              onChange={(event) =>
                setIncrement(Number.parseInt(event.target.value) || 0)
              }
              type="number"
              value={increment || ""}
            />
            <TextField
              label={t("pol_calculator.control")}
              onChange={(event) =>
                setControlBonus(Number.parseInt(event.target.value) || 0)
              }
              type="number"
              value={controlBonus || ""}
            />
          </FormControl>
        </Box>
        <Box>
          <Typography variant="h4">
            {t("pol_calculator.calculations")}
          </Typography>
          <Typography>
            {t("pol_calculator.max_norm")}:{" "}
            {TITLES.filter(
              (item) =>
                item.sex === player.sex &&
                item.required_rating !== null &&
                item.min_time <= baseTime + increment + controlBonus &&
                item.games <= rounds,
            ).toSorted((a, b) => b.rating - a.rating)[0]?.title || t("none")}
          </Typography>
          {system === "round-robin" && (
            <Typography>{t("pol_calculator.4.6")}</Typography>
          )}
          <Typography>
            {t("pol_calculator.rating_sum")}:{" "}
            {sumBy(
              opponents.filter((item) => ["=", "0", "1"].includes(item.result)),
              (item) => playerRating(item),
            ) + playerRating(player)}
          </Typography>
          <Typography>
            {t("pol_calculator.avg_rating")}: {round(averageRating)}
          </Typography>
          <Typography>
            {t("result")}: {gameResults["1"] + gameResults["="] * 0.5}/
            {playedGames}
          </Typography>
          <Typography>
            {t("won")}: {gameResults["1"]}, {t("draw")}: {gameResults["="]},{" "}
            {t("lost")}: {gameResults["0"]}
          </Typography>
          <Typography>
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            ΔR = {round(delta)}
          </Typography>
          <Typography>
            {t("pol_calculator.rating_performance")}:{" "}
            {round(averageRating + delta)}
          </Typography>
          <Typography>
            {t("pol_calculator.norm")}: {title?.title || t("none")}
          </Typography>
          {title && remark ? (
            <Typography>
              {t(`pol_calculator.${remark}`)}: {remark}
            </Typography>
          ) : null}
        </Box>
        <Typography variant="h4">{t("players")}</Typography>
        <div>
          <Button
            onClick={() => setShowEloConverting(true)}
            sx={{ ml: 2 } as const}
            type="button"
            variant="outlined"
          >
            {t("pol_calculator.converting_rating")}
          </Button>
        </div>

        <Dialog
          fullWidth
          maxWidth="sm"
          onClose={() => setShowEloConverting(false)}
          open={showEloConverting}
        >
          <DialogTitle>{t("pol_calculator.converting_rating")}</DialogTitle>
          <DialogContent dividers>
            <Typography>
              {t("pol_calculator.converting_rating_explanation")}
            </Typography>
            <Typography variant="h6"> {t("male")}</Typography>
            <TableContainer
              component={Paper}
              sx={{ margin: "auto", width: "fit-content" } as const}
            >
              <Table
                className="colorful-table"
                sx={{ width: "fit-content" } as const}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{t("min")}</TableCell>
                    <TableCell>{t("max")}</TableCell>
                    <TableCell>{t("pol_calculator.rating_pzszach")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maleRatingRanges.map((item) => (
                    <TableRow key={item.rating}>
                      <TableCell>{item.min}</TableCell>
                      <TableCell>{item.max}</TableCell>
                      <TableCell>{item.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6"> {t("female")}</Typography>
            <TableContainer
              component={Paper}
              sx={{ margin: "auto", width: "fit-content" } as const}
            >
              <Table
                className="colorful-table"
                sx={{ width: "fit-content" } as const}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{t("min")}</TableCell>
                    <TableCell>{t("max")} </TableCell>
                    <TableCell>{t("pol_calculator.rating_pzszach")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {femaleRatingRanges.map((item) => (
                    <TableRow key={item.rating}>
                      <TableCell>{item.min}</TableCell>
                      <TableCell>{item.max}</TableCell>
                      <TableCell>{item.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>

        <TableContainer
          component={Paper}
          sx={{ margin: "auto", width: "fit-content" } as const}
        >
          <Table
            className="colorful-table"
            sx={{ width: "fit-content" } as const}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("round")}</TableCell>
                <TableCell>{t("sex")}</TableCell>
                <TableCell>{t("player.cr_title")}</TableCell>
                <TableCell>{t("result")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell />
                <PlayerRow player={player} setPlayer={setPlayer} />
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} />
              </TableRow>
              {opponents.map((opponent, index) => (
                <TableRow key={opponent.title + index}>
                  <TableCell sx={{ textAlign: "center" } as const}>
                    {index + 1}
                  </TableCell>
                  <OpponentRow
                    opponent={opponent}
                    setOpponent={updateOpponent(index)}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Content>
    </div>
  );
};

export default PZSzachCalculator;
