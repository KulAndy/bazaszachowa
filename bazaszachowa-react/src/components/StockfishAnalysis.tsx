import { Chess } from "chess.js";
import React, { useEffect, useState } from "react";

import { useI18n } from "../i18n/I18nContext";

interface UciVariant2SanProperties {
  fen: string;
  moves: string[];
}

const uciVariant2San = ({ fen, moves }: UciVariant2SanProperties) => {
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

interface StockfishAnalysisProperties {
  readonly depth?: number;
  readonly fen: string;
  readonly hashSize?: number;
  readonly multiPV?: number;
  readonly threads?: number;
  readonly visible: boolean;
}

interface Variant {
  prefix: string;
  san: string;
  type: string;
  value: number;
  variant: string[];
}

const evalRegex = new RegExp(/score (cp|mate) ([\d-]+) .*$/);

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
  const [stockfish, setStockfish] = useState(
    () => new Worker("/js/stockfish.js"),
  );

  useEffect(() => {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    stockfish.onmessage = (event) => {
      let message = event.data as string;
      if (message.includes("info depth")) {
        const match = evalRegex.exec(message);

        if (match) {
          const chess = new Chess(fen);
          const turn = chess.turn();
          const type = match[1];
          const value = Number(match[2]);
          const infoArray = message.split(" pv ");
          const move = infoArray[1].split(" ")[0];

          let san: null | string = null;
          try {
            const doneMove = chess.move(move);
            if (!doneMove) {
              return;
            }
            san = doneMove.san;
          } catch {
            return;
          }

          if (san !== null) {
            setVariants((previousVariants) => ({
              ...previousVariants,
              [move]: {
                prefix:
                  ((turn === "b" && value >= 0) || (turn === "w" && value < 0)
                    ? "-"
                    : "+") + (type === "mate" ? "#" : ""),
                san: san!,
                type,
                value: type === "mate" ? value : value / 100,
                variant: infoArray[1].split(" "),
              },
            }));
          }
        }
      } else if (message.startsWith("bestmove")) {
        message = message.replaceAll(/bestmove |ponder |\(none\) /g, "");
        const newBest = message
          .trim()
          .split(" ")
          .find((item) => item !== "(none)");

        if (newBest) {
          setBest(newBest);
        }
        if (currentDepth < depth) {
          setCurrentDepth(currentDepth + 1);
        }
      }
    };
    stockfish.postMessage("uci");
    stockfish.postMessage(`setoption name Threads value ${threads}`);
    stockfish.postMessage(`setoption name MultiPV value ${multiPV}`);
    stockfish.postMessage(`setoption name Hash value ${hashSize}`);
  }, [currentDepth, depth, fen, hashSize, multiPV, stockfish, threads]);

  useEffect(() => {
    stockfish.terminate();
    setStockfish(new Worker("/js/stockfish.js"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  useEffect(() => {
    stockfish.postMessage("stop");
    stockfish.postMessage("uci");
    stockfish.postMessage(`setoption name Threads value ${threads}`);
    stockfish.postMessage(`setoption name MultiPV value ${multiPV}`);
    stockfish.postMessage(`setoption name Hash value ${hashSize}`);
    stockfish.postMessage(`position fen ${fen}`);

    setCurrentDepth(1);
  }, [fen, threads, multiPV, hashSize, stockfish]);

  useEffect(() => {
    setVariants({});
    setBest(null);
    stockfish.postMessage(`go depth ${currentDepth}`);
  }, [currentDepth, stockfish]);

  const valuesArray: Variant[] = Object.values(variants)
    .filter((item) => item.san !== null)
    .sort((a, b) => {
      let aValue = a.value;
      if (a.type === "mate") {
        aValue = (10_000 - Math.abs(a.value)) * Math.sign(a.value);
      }
      let bValue = b.value;
      if (b.type === "mate") {
        bValue = (10_000 - Math.abs(b.value)) * Math.sign(b.value);
      }
      return bValue - aValue;
    });

  return (
    <div className={visible ? "" : "inactive"} id="engine_container">
      {best && variants[best] ? (
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
      ) : (
        <>
          <p>
            {t("stockfish.best_move")}{" "}
            <span>
              {valuesArray.length === 0 ? <>-</> : valuesArray[0].san}
            </span>
          </p>
          <p>
            {t("stockfish.eval")}{" "}
            <span>
              {valuesArray.length === 0 ? (
                <>-</>
              ) : (
                <>
                  {valuesArray[0].prefix}
                  {valuesArray[0].value}
                </>
              )}
            </span>
          </p>
        </>
      )}
      {valuesArray.map(
        (value, index) =>
          index < 3 && (
            <p key={index}>
              <span style={{ fontWeight: "bolder" } as const}>
                {value.san} {value.prefix}
                {Math.abs(value.value) || 0}
              </span>{" "}
              {uciVariant2San({ fen, moves: value.variant }).join(" ")}
            </p>
          ),
      )}
    </div>
  );
};

export default StockfishAnalysis;
