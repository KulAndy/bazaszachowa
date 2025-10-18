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
    <Box mb={2}>
      <Typography variant="h6">
        {t("stockfish.best_move")}:{" "}
        <Typography component="span" fontWeight="bold">
          {move.san}
        </Typography>
      </Typography>
      <Typography variant="subtitle1">
        {t("stockfish.eval")}:{" "}
        <Typography component="span" fontWeight="bold">
          {move.prefix}
          {Math.abs(move.value)}
        </Typography>
      </Typography>
    </Box>
  );
};

export default BestMoveSpan;
