import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";

import { useI18n } from "../context/useI18n";

import Markdown from "./app/Markdown";

const TrendFunctionExplanation = () => {
  const { t } = useI18n();

  return (
    <Box style={{ margin: "auto" } as const}>
      <Accordion>
        <AccordionSummary>{t("math.function")} α</AccordionSummary>
        <AccordionDetails>
          <Markdown screen="math" section="alpha" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>{t("math.function")} β</AccordionSummary>
        <AccordionDetails>
          <Markdown screen="math" section="beta" />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TrendFunctionExplanation;
