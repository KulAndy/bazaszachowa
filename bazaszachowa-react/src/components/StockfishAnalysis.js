import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";

const stockfish = new Worker("/js/stockfish.js");

const uciVariant2San = ({ fen, moves }) => {
  const chess = new Chess(fen);
  const splittedFen = fen.split(" ");
  const turn = chess.turn();
  let moveNo = parseInt(splittedFen[splittedFen.length - 1]);
  const variant = [`${moveNo++}.`];
  if (turn === "b") {
    variant.push("...");
  }

  for (const move of moves) {
    try {
      const doneMove = chess.move(move, {
        sloppy: true,
      });
      if (variant.length % 3 === 0) {
        variant.push(`${moveNo++}.`);
      }
      variant.push(doneMove.san);
    } catch (error) {
      return variant;
    }
  }

  return variant;
};

const StockfishAnalysis = ({
  fen,
  visible = true,
  depth = 20,
  threads = 3,
  multiPV = 3,
  hashSize = 1024,
}) => {
  const [variants, setVariants] = useState({});
  const [currentDepth, setCurrentDepth] = useState(0);
  const [best, setBest] = useState(null);

  stockfish.onmessage = function (event) {
    let message = event.data;
    if (message.includes("info depth")) {
      var match = message.match(/score (cp|mate) ([-\d]+) .*$/);

      if (match) {
        const chess = new Chess(fen);
        const turn = chess.turn();
        var type = match[1];
        var value = parseInt(match[2]);
        let infoArr = message.split(" pv ");
        const key = infoArr[1].split(" ")[0];

        let san = null;
        try {
          const doneMove = chess.move(infoArr[1].split(" ")[0], {
            sloppy: true,
          });
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
              san,
            },
          }));
        }
      }
    } else if (message.startsWith("bestmove")) {
      message = message.replace(/bestmove |ponder |\(none\) /g, "");
      let best = message.trim().split(" ")[0];
      if (best.length > 0) {
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
  }, []);

  useEffect(() => {
    stockfish.postMessage("setoption name Threads value " + threads);
  }, [threads]);

  useEffect(() => {
    stockfish.postMessage("setoption name MultiPV value " + multiPV);
  }, [multiPV]);

  useEffect(() => {
    stockfish.postMessage("setoption name Hash value " + hashSize);
  }, [hashSize]);

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
    stockfish.postMessage("position fen " + fen);
    stockfish.postMessage("go depth " + currentDepth);
  }, [depth, currentDepth]);

  const valuesArray = Object.values(variants)
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
    <div id="engine_container" className={!visible ? "inactive" : ""}>
      <p>
        Najlepszy ruch{" "}
        {best !== null ? (
          <span style={{ fontWeight: "bolder" }}>
            {variants[best]?.san || ""}
          </span>
        ) : (
          <span>
            {valuesArray.length === 0 ? <>-</> : <>{valuesArray[0].san}</>}
          </span>
        )}
      </p>
      <p>
        Ocena{" "}
        {best !== null ? (
          <span style={{ fontWeight: "bolder" }}>
            {variants[best]?.prefix || ""}
            {Math.abs(variants[best]?.value || "")}
          </span>
        ) : (
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
        )}
      </p>
      {valuesArray.map((value, index) => (
        <>
          {index < 3 && (
            <p key={index}>
              <span style={{ fontWeight: "bolder" }}>
                {value.san} {value.prefix}
                {Math.abs(value.value)}
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
