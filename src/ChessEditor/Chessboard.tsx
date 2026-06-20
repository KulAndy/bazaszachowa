import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";

import { Chessground } from "@lichess-org/chessground";
import type { Api as ChessgroundApi } from "@lichess-org/chessground/api";
import type { Key } from "@lichess-org/chessground/types";
import { Chess, type Square } from "chess.js";
import { noop } from "es-toolkit";
import { useEffect, useRef } from "react";

import type { ShortMove } from ".";

interface ChessboardProperties {
  readonly addMove: (x: ShortMove) => void;
  readonly boardSize: number;
  readonly fen: string;
  readonly flip: boolean;
  readonly nextMove: () => void;
  readonly prevMove: () => void;
  readonly sourceSquare: null | string;
  readonly targetSquares: string[];
}

const Chessboard: React.FC<ChessboardProperties> = ({
  addMove,
  boardSize = 400,
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  flip = false,
  nextMove = noop,
  prevMove: previousMove = noop,
}) => {
  const boardReference = useRef<HTMLDivElement | null>(null);
  const apiReference = useRef<ChessgroundApi | null>(null);

  useEffect(() => {
    const element = boardReference.current;
    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.deltaY > 0) {
        nextMove?.();
      } else {
        previousMove?.();
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [nextMove, previousMove]);

  useEffect(() => {
    if (!boardReference.current) {
      return;
    }

    const chess = new Chess(fen);
    const api = Chessground(boardReference.current, {
      coordinates: false,
      disableContextMenu: true,
      draggable: {
        enabled: true,
        showGhost: true,
      },
      drawable: {
        defaultSnapToValidMove: true,
      },
      events: {
        move: (orig: Key, destination: Key) => {
          addMove({ from: orig as Square, to: destination as Square });
        },
      },
      fen,
      highlight: {
        check: true,
        lastMove: true,
      },
      movable: {
        color: "both",
        dests: chess
          .moves({ verbose: true })
          .reduce((destinations, { from, to }) => {
            destinations.set(from, [...(destinations.get(from) || []), to]);
            return destinations;
          }, new Map<Key, Key[]>()),
        free: false,
        rookCastle: true,
        showDests: true,
      },
      orientation: flip ? "black" : "white",
      predroppable: { enabled: false },
      premovable: {
        enabled: false,
      },
      selectable: {
        enabled: true,
      },
    });

    apiReference.current = api;

    // eslint-disable-next-line consistent-return
    return () => {
      api.destroy();
      apiReference.current = null;
    };
  }, [fen, flip, addMove]);

  return (
    <div
      aria-hidden
      ref={boardReference}
      style={{ height: boardSize, width: boardSize } as const}
    />
  );
};

export default Chessboard;
