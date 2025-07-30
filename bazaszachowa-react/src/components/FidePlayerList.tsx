import React from "react";

import FidePlayer, { FidePlayerType } from "./FidePlayer";

interface FidePlayersListProps {
  players: FidePlayerType[];
}

const FidePlayersList: React.FC<FidePlayersListProps> = ({ players }) => {
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
        <details id="ambigous">
          <summary>inni znalezieni</summary>
          {items.slice(1).map((item) => (
            <FidePlayer key={item.fideid} player={item} />
          ))}
        </details>
      )}
    </div>
  );
};

export default FidePlayersList;
