import { Chess } from "chess.js";
import { debounce } from "es-toolkit";
import { useEffect, useMemo, useState } from "react";

import BestMoveSpan from "./BestMoveSpan";
import VariantList, { type Variant } from "./VariantList";

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

const evalRegex = /score (cp|mate) ([\d-]+) .*$/;

const StockfishAnalysis: React.FC<StockfishAnalysisProperties> = ({
  depth = 20,
  fen,
  hashSize = 1024,
  multiPV = 3,
  threads = 3,
  visible = true,
}) => {
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
  }, []);

  useEffect(() => {
    const restartWorker = debounce(() => {
      if (best === null) {
        setStockfish((previous) => {
          previous?.terminate();
          return new Worker(stockfishFile);
        });
      }
    }, 1500);

    restartWorker();

    return () => {
      restartWorker.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [currentDepth, depth, fen, stockfish]);

  useEffect(() => {
    if (stockfish && currentDepth > 0) {
      setVariants({});
      setBest(null);
      stockfish.postMessage(`go depth ${currentDepth}`);
    }
  }, [currentDepth, stockfish]);

  const valuesArray = useMemo(
    () =>
      Object.values(variants)
        .filter((item) => item.san !== null)
        .toSorted((a, b) => {
          const aValue =
            a.type === "mate"
              ? (10_000 - Math.abs(a.value)) * Math.sign(a.value)
              : a.value;
          const bValue =
            b.type === "mate"
              ? (10_000 - Math.abs(b.value)) * Math.sign(b.value)
              : b.value;
          return bValue - aValue;
        }),
    [variants],
  );

  return (
    <div className={visible ? "" : "inactive"} id="engine-container">
      <BestMoveSpan best={best} valuesArray={valuesArray} variants={variants} />
      <VariantList fen={fen} valuesArray={valuesArray} />
    </div>
  );
};

export default StockfishAnalysis;
