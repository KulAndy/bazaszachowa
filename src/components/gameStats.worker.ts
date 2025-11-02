import type { GameData } from "../ChessEditor";
import { computeStats } from "../stats";
import initWasm from "../wasm/game_stats";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/prefer-top-level-await
void initWasm().then((wasm: any) => {
  // eslint-disable-next-line sonarjs/post-message
  self.addEventListener(
    "message",
    (event: {
      data: {
        games: GameData[];
        player: string;
      };
    }) => {
      const pom = async () => {
        const { games, player } = event.data;

        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const calcGameStats = async (rows: GameData[], color: "b" | "w") => {
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

          wasmGames.delete();
          wasmColor.delete();

          return {
            attackedPieces: computeStats(attackedPices as number[]),
            centerControl: computeStats(centerControl as number[]),
            extendedCenterControl: computeStats(
              extendedCenteControl as number[],
            ),
            heatMap,
            materialBalance: computeStats(materialBalance as number[]),
            mobility: computeStats(mobility as number[]),
            pawnStruct,
          };
        };
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

        const black = await calcGameStats(
          games.filter((g) => g.Black === player),
          "b",
        );
        const white = await calcGameStats(
          games.filter((g) => g.White === player),
          "w",
        );

        globalThis.postMessage({ black, white });
      };

      void pom();
    },
  );
});
