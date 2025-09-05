import { Chess } from "chess.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useI18n } from "../i18n/I18nContext";

const wasmSupported =
  typeof WebAssembly === "object" &&
  WebAssembly.validate(
    Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
  );
const stockfishFile = wasmSupported
  ? "/js/stockfish.wasm.js"
  : "/js/stockfish.js";

interface StockfishAnalysisProperties {
  readonly depth?: number;
  readonly fen: string;
  readonly hashSize?: number;
  readonly multiPV?: number;
  readonly threads?: number;
  readonly visible: boolean;
}

interface UciVariant2SanProperties {
  fen: string;
  moves: string[];
}

interface Variant {
  prefix: string;
  san: string;
  type: string;
  value: number;
  variant: string[];
}

const evalRegex = /score (cp|mate) ([\d-]+) .*$/;

const uciVariant2San = ({ fen, moves }: UciVariant2SanProperties): string[] => {
  const chess = new Chess(fen);
  const splittedFen = fen.split(" ");
  const turn = chess.turn();
  let moveNo = Number(splittedFen.at(-1));
  const variant: string[] = [`${moveNo++}.`];

  if (turn === "b") {
    variant.push("...");
  }

  for (const move of moves) {
    try {
      const doneMove = chess.move(move);
      if (!doneMove) {
        break;
      }

      if (variant.length % 3 === 0) {
        variant.push(`${moveNo++}.`);
      }
      variant.push(doneMove.san);
    } catch {
      break;
    }
  }

  return variant;
};

const StockfishAnalysis: React.FC<StockfishAnalysisProperties> = ({
  depth = 20,
  fen,
  hashSize = 1024,
  multiPV = 3,
  threads = 3,
  visible = true,
}) => {
  const { t } = useI18n();
  const [variants, setVariants] = useState<Record<string, Variant>>({});
  const [currentDepth, setCurrentDepth] = useState(0);
  const [best, setBest] = useState<null | string>(null);
  const [stockfish, setStockfish] = useState<null | Worker>(null);

  useEffect(() => {
    const worker = new Worker(stockfishFile);
    setStockfish(worker);

    return () => {
      worker.terminate();
    };
  }, [fen]);

  useEffect(() => {
    if (!stockfish) {
      return;
    }

    stockfish.postMessage("ucinewgame");
    stockfish.postMessage(`setoption name Threads value ${threads}`);
    stockfish.postMessage(`setoption name MultiPV value ${multiPV}`);
    stockfish.postMessage(`setoption name Hash value ${hashSize}`);
    stockfish.postMessage(`position fen ${fen}`);
    setCurrentDepth(1);
    setVariants({});
    setBest(null);
  }, [threads, multiPV, hashSize, stockfish, fen]);

  useEffect(() => {
    if (!stockfish) {
      return;
    }

    const onMessage = (event: MessageEvent) => {
      const message = event.data as string;

      if (message.includes("info depth")) {
        const match = evalRegex.exec(message);
        if (match) {
          const chess = new Chess(fen);
          const turn = chess.turn();
          const type = match[1];
          const value = Number(match[2]);
          const infoArray = message.split(" pv ");
          const move = infoArray[1]?.split(" ")[0];

          if (!move) {
            return;
          }

          try {
            const doneMove = chess.move(move);
            if (!doneMove) {
              return;
            }

            setVariants((previous) => ({
              ...previous,
              [move]: {
                prefix:
                  ((turn === "b" && value >= 0) || (turn === "w" && value < 0)
                    ? "-"
                    : "+") + (type === "mate" ? "#" : ""),
                san: doneMove.san,
                type,
                value: type === "mate" ? value : value / 100,
                variant: infoArray[1].split(" "),
              },
            }));
          } catch {
            /* empty */
          }
        }
      } else if (message.startsWith("bestmove")) {
        const newBest = message
          .replaceAll(/bestmove |ponder |\(none\) /g, "")
          .trim()
          .split(" ")
          .find((item) => item !== "(none)");

        if (newBest) {
          setBest(newBest);
        }

        if (currentDepth < depth) {
          setCurrentDepth((previous) => previous + 1);
        }
      }
    };

    stockfish.addEventListener("message", onMessage);

    // eslint-disable-next-line consistent-return
    return () => {
      stockfish.removeEventListener("message", onMessage);
    };
  }, [currentDepth, depth, fen, stockfish, threads, multiPV, hashSize]);

  useEffect(() => {
    if (!stockfish || currentDepth === 0) {
      return;
    }

    stockfish.postMessage(`go depth ${currentDepth}`);
  }, [currentDepth, stockfish]);

  const valuesArray = useMemo(() => {
    return Object.values(variants)
      .filter((item) => item.san !== null)
      .sort((a, b) => {
        const aValue =
          a.type === "mate"
            ? (10_000 - Math.abs(a.value)) * Math.sign(a.value)
            : a.value;
        const bValue =
          b.type === "mate"
            ? (10_000 - Math.abs(b.value)) * Math.sign(b.value)
            : b.value;
        return bValue - aValue;
      });
  }, [variants]);

  const renderBestMove = useCallback(() => {
    if (best && variants[best]) {
      return (
        <>
          <p>
            {t("stockfish.best_move")}{" "}
            <span style={{ fontWeight: "bolder" } as const}>
              {variants[best].san || ""}
            </span>
          </p>
          <p>
            {t("stockfish.eval")}{" "}
            <span style={{ fontWeight: "bolder" } as const}>
              {variants[best].prefix || ""}
              {Math.abs(variants[best].value ?? Number.NaN)}
            </span>
          </p>
        </>
      );
    }

    return (
      <>
        <p>
          {t("stockfish.best_move")}{" "}
          <span>{valuesArray.length === 0 ? "-" : valuesArray[0]?.san}</span>
        </p>
        <p>
          {t("stockfish.eval")}{" "}
          <span>
            {valuesArray.length === 0 ? (
              "-"
            ) : (
              <>
                {valuesArray[0]?.prefix}
                {valuesArray[0]?.value}
              </>
            )}
          </span>
        </p>
      </>
    );
  }, [best, variants, valuesArray, t]);

  const renderVariants = useCallback(() => {
    return valuesArray.slice(0, 3).map((value, index) => (
      <p key={index}>
        <span style={{ fontWeight: "bolder" } as const}>
          {value.san} {value.prefix}
          {Math.abs(value.value) || 0}
        </span>{" "}
        {uciVariant2San({ fen, moves: value.variant }).join(" ")}
      </p>
    ));
  }, [valuesArray, fen]);

  return (
    <div className={visible ? "" : "inactive"} id="engine_container">
      {renderBestMove()}
      {renderVariants()}
    </div>
  );
};

export default StockfishAnalysis;
