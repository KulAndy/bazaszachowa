import { useI18n } from "../context/useI18n";

import CrPlayer, { type CrPlayerType } from "./CrPlayer";

interface CrPlayersListProperties {
  readonly players: CrPlayerType[];
}

const categoryToRanking = (category: string) => {
  switch (category.toUpperCase()) {
    case "CM": {
      return 2200;
    }
    case "FM": {
      return 2300;
    }
    case "GM": {
      return 2600;
    }
    case "I": {
      return 2000;
    }
    case "I+": {
      return 2075;
    }
    case "I++": {
      return 2100;
    }
    case "II": {
      return 1800;
    }
    case "II+": {
      return 1900;
    }
    case "III": {
      return 1600;
    }
    case "IM": {
      return 2450;
    }
    case "IV": {
      return 1250;
    }
    case "K": {
      return 2200;
    }
    case "K+": {
      return 2275;
    }
    case "K++": {
      return 2300;
    }
    case "M": {
      return 2400;
    }
    case "V": {
      return 1200;
    }
    case "WCM": {
      return 2050;
    }
    case "WFM": {
      return 2100;
    }
    case "WGM": {
      return 2400;
    }
    case "WIM": {
      return 2250;
    }
    default: {
      return 1000;
    }
  }
};

const CrPlayersList: React.FC<CrPlayersListProperties> = ({ players }) => {
  const { t } = useI18n();
  if (players.length === 0) {
    return <div id="cr-data-container"></div>;
  }

  const items = players.map((player, index) => ({
    ...player,
    key: index,
  }));

  if (items.length > 1) {
    items.sort(
      (a, b) => categoryToRanking(b.kat || "") - categoryToRanking(a.kat || ""),
    );
  }

  return (
    <div id="cr-data-container">
      <CrPlayer player={items[0]} showSource={true} />

      {items.length > 1 && (
        <details id="ambigous">
          <summary>{t("player.other_found")}</summary>
          {items.slice(1).map((item) => (
            <CrPlayer key={item.id} player={item} />
          ))}
        </details>
      )}
    </div>
  );
};

export default CrPlayersList;
