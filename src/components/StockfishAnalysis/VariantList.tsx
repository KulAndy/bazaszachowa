import { Typography } from "@mui/material";
import { Chess } from "chess.js";
import type React from "react";

export interface Variant {
  prefix: string;
  san: string;
  type: string;
  value: number;
  variant: string[];
}

interface UciVariant2SanProperties {
  fen: string;
  moves: string[];
}

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

interface VariantListProperties {
  fen: string;
  valuesArray: Variant[];
}

const VariantList: React.FC<VariantListProperties> = ({ fen, valuesArray }) => {
  return valuesArray.slice(0, 3).map((value) => (
    <Typography key={value.san} sx={{ mb: 1 } as const} variant="body2">
      <Typography component="span" sx={{ fontWeight: "bold" } as const}>
        {value.san} {value.prefix}
        {Math.abs(value.value) || 0}
      </Typography>{" "}
      {uciVariant2San({ fen, moves: value.variant }).join(" ")}
    </Typography>
  ));
};

export default VariantList;
