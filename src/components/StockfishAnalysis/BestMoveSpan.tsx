import { Box, Typography } from "@mui/material";
import type React from "react";

import { useI18n } from "../../context/useI18n";

import type { Variant } from "./VariantList";

interface BestMoveSpanProperties {
  readonly best: null | string;
  readonly valuesArray: Variant[];
  readonly variants: Record<string, Variant>;
}

const BestMoveSpan: React.FC<BestMoveSpanProperties> = ({
  best,
  valuesArray,
  variants,
}) => {
  const { t } = useI18n();
  const move = best && variants[best] ? variants[best] : valuesArray[0];
  if (!move) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 } as const}>
      <Typography variant="h6">
        {t("stockfish.best_move")}:{" "}
        <Typography component="span" sx={{ fontWeight: "bold" } as const}>
          {move.san}
        </Typography>
      </Typography>
      <Typography variant="subtitle1">
        {t("stockfish.eval")}:{" "}
        <Typography component="span" sx={{ fontWeight: "bold" } as const}>
          {move.prefix}
          {Math.abs(move.value)}
        </Typography>
      </Typography>
    </Box>
  );
};

export default BestMoveSpan;
