import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import type { GameData } from "../ChessEditor";
import { useI18n } from "../context/useI18n";
import { type StatSummary } from "../stats";

import HeatMap from "./HeatMap";
import StatIndicators from "./StatIndicators";

interface GamesStatsProperties {
  readonly games: GameData[];
  readonly player: string;
}

interface GameStats {
  attackedPieces: StatSummary;
  centerControl: StatSummary;
  extendedCenterControl: StatSummary;
  heatMap: Record<string, number>;
  materialBalance: StatSummary;
  mobility: StatSummary;
  pawnStruct: {
    doubled: number;
    fianchetto: number;
    isolated: number;
    passed: number;
  };
}

const GamesStats: React.FC<GamesStatsProperties> = ({ games, player }) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState<{
    black: GameStats;
    white: GameStats;
  }>();
  const [worker, setWorker] = useState(
    () =>
      new Worker(new URL("gameStats.worker.ts", import.meta.url), {
        type: "module",
      }),
  );

  useEffect(() => {
    if (games.length === 0) {
      return;
    }

    const handleMessage = (
      event: MessageEvent<{
        black: GameStats;
        white: GameStats;
      }>,
    ) => {
      setGameStats(event.data);
      setLoading(false);
    };
    worker.addEventListener("message", handleMessage);
    worker.postMessage({ games, player });

    // eslint-disable-next-line consistent-return
    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [games, player, worker]);

  useEffect(() => {
    setWorker(
      new Worker(new URL("gameStats.worker.ts", import.meta.url), {
        type: "module",
      }),
    );
  }, [player]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {games && gameStats ? (
        <div id="computed-stats">
          <h2>{t("stats.descriptions")}</h2>

          {(["white", "black"] as const).map((item) => (
            <Accordion key={item}>
              <AccordionSummary>{t(item)}</AccordionSummary>
              <AccordionDetails>
                <HeatMap heatmap={gameStats[item].heatMap} />

                <StatIndicators
                  name={t("stats.mobility")}
                  summary={gameStats[item].mobility}
                />
                <StatIndicators
                  name={t("stats.balance")}
                  summary={gameStats[item].materialBalance}
                />
                <StatIndicators
                  name={t("stats.center")}
                  summary={gameStats[item].centerControl}
                />
                <StatIndicators
                  name={t("stats.center_ext")}
                  summary={gameStats[item].extendedCenterControl}
                />
                <StatIndicators
                  name={t("stats.attacked")}
                  summary={gameStats[item].attackedPieces}
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
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default GamesStats;
