import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import type { GameData } from "../ChessEditor";
import { useI18n } from "../context/useI18n";
import { computeStats } from "../stats";
import initWasm from "../wasm/game_stats";

import HeatMap from "./HeatMap";
import StatIndicators from "./StatIndicators";

const emptyStatObject = {
  black: {
    attackedPieces: [],
    centerControl: [],
    extendedCenterControl: [],
    heatMap: {},
    materialBalance: [],
    mobility: [],
    pawnStruct: {
      doubled: 0,
      fianchetto: 0,
      isolated: 0,
      passed: 0,
    },
  },
  white: {
    attackedPieces: [],
    centerControl: [],
    extendedCenterControl: [],
    heatMap: {},
    materialBalance: [],
    mobility: [],
    pawnStruct: {
      doubled: 0,
      fianchetto: 0,
      isolated: 0,
      passed: 0,
    },
  },
};

interface GamesStatsProperties {
  readonly games: GameData[];
  readonly player: string;
}

interface GameStats {
  attackedPieces: number[];
  centerControl: number[];
  extendedCenterControl: number[];
  heatMap: Record<string, number>;
  materialBalance: number[];
  mobility: number[];
  pawnStruct: {
    doubled: number;
    fianchetto: number;
    isolated: number;
    passed: number;
  };
}
const GamesStats: React.FC<GamesStatsProperties> = ({ games, player }) => {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const [calcGameStats, setCalcGameStats] = useState<
    (x: GameData[], color: "b" | "w") => Promise<GameStats>
  >(() => () => Promise.resolve(emptyStatObject.white));
  const [gameStats, setGameStats] = useState<{
    black: GameStats;
    white: GameStats;
  }>(emptyStatObject);

  useEffect(() => {
    if (games && loaded) {
      (async () => {
        const [black, white] = await Promise.all([
          calcGameStats(
            games.filter((g) => g.Black === player),
            "b",
          ),
          calcGameStats(
            games.filter((g) => g.White === player),
            "w",
          ),
        ]);
        setGameStats({ black: black, white: white });
      })();
    }
  }, [calcGameStats, games, loaded, player]);

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void initWasm().then((wasm: any) => {
      setCalcGameStats(() =>
        // eslint-disable-next-line sonarjs/no-nested-functions, unicorn/consistent-function-scoping
        async (rows: GameData[], color: "b" | "w"): Promise<GameStats> => {
          const wasmColor = new wasm.Color(color);
          const wasmGames = new wasm.VectorGameData();
          for (const row of rows) {
            const wasmGame = new wasm.GameData(row.id, row.Result, row.Year);
            const wasmMoves = new wasm.VectorMove();
            for (const move of row.moves) {
              const wasmMove = new wasm.Move(
                move.from,
                move.to,
                move.promotion,
              );
              wasmMoves.push_back(wasmMove);
            }

            wasmGame.moves = wasmMoves;
            wasmGames.push_back(wasmGame);
          }

          const [
            heatMap,
            mobility,
            attackedPices,
            materialBalance,
            centerControl,
            extendedCenteControl,
            pawnStruct,
          ] = await Promise.all([
            wasm.computeHeatmap(wasmGames, wasmColor),
            wasm.computeMobility(wasmGames, wasmColor),
            wasm.computeAttackedPieces(wasmGames, wasmColor),
            wasm.computeMaterialBalances(wasmGames, wasmColor),
            wasm.computeCenterControl(wasmGames, wasmColor),
            wasm.computeExtendedCenterControl(wasmGames, wasmColor),
            wasm.computePawnStruct(wasmGames, wasmColor),
          ]);

          for (let index = 0; index < wasmGames.size(); index++) {
            const wasmGame = wasmGames.get(index);
            if (wasmGame.moves) {
              wasmGame.moves.delete();
            }
            wasmGame.delete();
          }
          wasmGames.delete();
          wasmColor.delete();

          return {
            attackedPieces: attackedPices,
            centerControl,
            extendedCenterControl: extendedCenteControl,
            heatMap,
            materialBalance,
            mobility,
            pawnStruct,
          };
        },
      );
      setLoaded(true);
    });
  }, []);
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

  return (
    <div>
      {gameStats ? (
        <div id="computed-stats">
          <h2>{t("stats.descriptions")}</h2>

          {(["white", "black"] as const).map((item) => (
            <Accordion key={item}>
              <AccordionSummary>{t(item)}</AccordionSummary>
              <AccordionDetails>
                <HeatMap heatmap={gameStats[item].heatMap} />

                <StatIndicators
                  name={t("stats.mobility")}
                  summary={computeStats(gameStats[item].mobility)}
                />
                <StatIndicators
                  name={t("stats.balance")}
                  summary={computeStats(gameStats[item].materialBalance)}
                />
                <StatIndicators
                  name={t("stats.center")}
                  summary={computeStats(gameStats[item].centerControl)}
                />
                <StatIndicators
                  name={t("stats.center_ext")}
                  summary={computeStats(gameStats[item].extendedCenterControl)}
                />
                <StatIndicators
                  name={t("stats.attacked")}
                  summary={computeStats(gameStats[item].attackedPieces)}
                />
                <h4>{t("stats.pawn_struct")}</h4>
                <Table>
                  <TableHead>
                    <TableCell>{t("stats.doubled")}</TableCell>
                    <TableCell>{t("stats.fianchetto")}</TableCell>
                    <TableCell>{t("stats.isolated")}</TableCell>
                    <TableCell>{t("stats.passed")}</TableCell>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {gameStats[item].pawnStruct.doubled}
                      </TableCell>
                      <TableCell>
                        {gameStats[item].pawnStruct.fianchetto}
                      </TableCell>
                      <TableCell>
                        {gameStats[item].pawnStruct.isolated}
                      </TableCell>
                      <TableCell>{gameStats[item].pawnStruct.passed}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default GamesStats;
