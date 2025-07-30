import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";

const stockfish = new Worker("/js/stockfish.js");

interface uciVariant2SanProps {
  fen: string;
  moves: string[];
}

const uciVariant2San = ({ fen, moves }: uciVariant2SanProps) => {
  const chess = new Chess(fen);
  const splittedFen = fen.split(" ");
  const turn = chess.turn();
  let moveNo = Number(splittedFen[splittedFen.length - 1]);
  const variant: string[] = [`${moveNo++}.`];
  if (turn === "b") {
    variant.push("...");
  }

  for (const move of moves) {
    try {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      let promotion: undefined | string = undefined;
      if (move.length > 4) {
        promotion = move.slice(5);
      }

      const doneMove = chess.move({ from, to, promotion });

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

interface Variant {
  prefix: string;
  type: string;
  value: number;
  variant: string[];
  san: string;
}

interface StockfishAnalysisProps {
  fen: string;
  visible: boolean;
  depth?: number;
  threads?: number;
  multiPV?: number;
  hashSize?: number;
}

const StockfishAnalysis: React.FC<StockfishAnalysisProps> = ({
  fen,
  visible = true,
  depth = 20,
  threads = 3,
  multiPV = 3,
  hashSize = 1024,
}) => {
  const [variants, setVariants] = useState<Record<string, Variant>>({});
  const [currentDepth, setCurrentDepth] = useState(0);
  const [best, setBest] = useState<string | null>(null);

  stockfish.onmessage = function (event) {
    let message = event.data as string;
    if (message.includes("info depth")) {
      const match = message.match(/score (cp|mate) ([-\d]+) .*$/);

      if (match) {
        const chess = new Chess(fen);
        const turn = chess.turn();
        const type = match[1];
        const value = Number(match[2]);
        const infoArr = message.split(" pv ");
        const key = infoArr[1].split(" ")[0];

        let san: string | null = null;
        try {
          const move = infoArr[1].split(" ")[0];
          const from = move.slice(0, 2);
          const to = move.slice(2, 4);
          let promotion: undefined | string = undefined;
          if (move.length > 4) {
            promotion = move.slice(5);
          }

          const doneMove = chess.move({ from, to, promotion });
          if (!doneMove) {
            return;
          }
          san = doneMove.san;
        } catch (error) {
          return;
        }

        if (san !== null) {
          setVariants((prevVariants) => ({
            ...prevVariants,
            [key]: {
              prefix:
                ((turn === "b" && value >= 0) || (turn === "w" && value < 0)
                  ? "-"
                  : "+") + (type === "mate" ? "#" : ""),
              type,
              value: type === "mate" ? value : value / 100,
              variant: infoArr[1].split(" "),
              san: san as string,
            },
          }));
        }
      }
    } else if (message.startsWith("bestmove")) {
      message = message.replace(/bestmove |ponder |\(none\) /g, "");
      const best = message
        .trim()
        .split(" ")
        .filter((item) => item !== "(none)")[0];

      if (best) {
        setBest(best);
      }
      if (currentDepth < depth) {
        setCurrentDepth(currentDepth + 1);
      }
    }
  };

  useEffect(() => {
    stockfish.postMessage("uci");
    stockfish.postMessage("setoption name Threads value " + threads);
    stockfish.postMessage("setoption name MultiPV value " + multiPV);
    stockfish.postMessage("setoption name Hash value " + hashSize);

    return () => {
      stockfish.postMessage("stop");
    };
  }, [threads, multiPV, hashSize]);

  useEffect(() => {
    stockfish.postMessage("stop");
    setVariants({});
    setBest(null);
    stockfish.postMessage("uci");
    stockfish.postMessage("setoption name Threads value " + threads);
    stockfish.postMessage("setoption name MultiPV value " + multiPV);
    stockfish.postMessage("setoption name Hash value " + hashSize);
    stockfish.postMessage("position fen " + fen);
    stockfish.postMessage("go depth 1");
    setCurrentDepth(1);
  }, [fen, threads, multiPV, hashSize]);

  useEffect(() => {
    // stockfish.postMessage("position fen " + fen);
    stockfish.postMessage("go depth " + currentDepth);
  }, [currentDepth]);

  const valuesArray: Variant[] = Object.values(variants)
    .filter((item) => item.san !== null)
    .sort((a, b) => {
      if (a.type === "mate" && b.type !== "mate") {
        return -1;
      } else if (a.type !== "mate" && b.type === "mate") {
        return 1;
      } else if (a.type === "mate" && b.type === "mate") {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });

  return (
    <div id="engine_container" className={visible ? "" : "inactive"}>
      {best ? (
        <>
          <p>
            Najlepszy ruch{" "}
            <span style={{ fontWeight: "bolder" }}>
              {variants[best]?.san || ""}
            </span>
          </p>
          <p>
            Ocena{" "}
            <span style={{ fontWeight: "bolder" }}>
              {variants[best]?.prefix || ""}
              {Math.abs(variants[best]?.value ?? NaN)}
            </span>
          </p>
        </>
      ) : (
        <>
          <p>
            Najlepszy ruch{" "}
            <span>
              {valuesArray.length === 0 ? <>-</> : <>{valuesArray[0].san}</>}
            </span>
          </p>
          <p>
            Ocena{" "}
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
      {valuesArray.map((value, index) => (
        <>
          {index < 3 && (
            <p key={index}>
              <span style={{ fontWeight: "bolder" }}>
                {value.san} {value.prefix}
                {Math.abs(value.value) || 0}
              </span>{" "}
              {uciVariant2San({ fen, moves: value.variant }).join(" ")}
            </p>
          )}
        </>
      ))}
    </div>
  );
};

export default StockfishAnalysis;
