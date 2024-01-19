import React from "react";
import CrPlayer from "./CrPlayer";

const CrPlayersList = ({ players }) => {
  if (players.length === 0) {
    return <div id="cr-data-container"></div>;
  }

  const items = players.map((player, index) => ({
    ...player,
    key: index,
  }));

  const categoryToRanking = (category) => {
    switch (category.toUpperCase()) {
      case "GM":
        return 2600;
      case "IM":
        return 2450;
      case "WGM":
        return 2400;
      case "M":
        return 2400;
      case "FM":
        return 2300;
      case "K++":
        return 2300;
      case "K+":
        return 2275;
      case "WIM":
        return 2250;
      case "CM":
        return 2200;
      case "K":
        return 2200;
      case "WFM":
        return 2100;
      case "I++":
        return 2100;
      case "I+":
        return 2075;
      case "WCM":
        return 2050;
      case "I":
        return 2000;
      case "II+":
        return 1900;
      case "II":
        return 1800;
      case "III":
        return 1600;
      case "IV":
        return 1250;
      case "V":
        return 1200;
      default:
        return 1000;
    }
  };

  if (items.length > 1) {
    items.sort((a, b) =>
      categoryToRanking(a.kat) < categoryToRanking(b.kat)
        ? 1
        : categoryToRanking(b.kat) < categoryToRanking(a.kat)
        ? -1
        : 0
    );
  }

  return (
    <div id="cr-data-container">
      <CrPlayer player={items[0]} showSource={true} />

      {items.length > 1 && (
        <details id="ambigous">
          <summary>inni znalezieni</summary>
          {items.slice(1).map((item) => (
            <CrPlayer player={item} />
          ))}
        </details>
      )}
    </div>
  );
};

export default CrPlayersList;
