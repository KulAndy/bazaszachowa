import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import { useI18n } from "../../context/useI18n";

import FidePlayer, { type FidePlayerType } from "./FidePlayer";

interface FidePlayersListProperties {
  readonly players: FidePlayerType[];
}

const FidePlayersList: React.FC<FidePlayersListProperties> = ({ players }) => {
  const { t } = useI18n();
  if (players.length === 0) {
    return <div id="fide-data-container"></div>;
  }

  const items = players.map((player, index) => ({
    ...player,
    key: index,
  }));

  items.sort((a, b) => b.rating - a.rating);

  return (
    <div id="fide-data-container">
      <FidePlayer player={items[0]} showSource={true} />

      {items.length > 1 && (
        <Accordion id="ambigous">
          <AccordionSummary>{t("player.other_found")}</AccordionSummary>
          <AccordionDetails>
            {items.slice(1).map((item) => (
              <FidePlayer key={item.fideid} player={item} />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default FidePlayersList;
