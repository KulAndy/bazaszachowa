import { uniq } from "es-toolkit";

import { CACHE } from "../settings";

const handlePlayers = async (request: Request): Promise<Response> => {
  if (navigator.onLine) {
    const response = await fetch(request);
    return response;
  }

  const players: string[] = [];
  const cache = await caches.open(CACHE.player_cache);
  const cachedRequests = await cache.keys();

  for (const cachedRequest of cachedRequests) {
    const response = await cache.match(cachedRequest);

    if (!response) {
      continue;
    }

    try {
      const url = new URL(cachedRequest.url);
      const playerEncoded = url.pathname.split("/")[3];
      const player = decodeURIComponent(playerEncoded);
      players.push(player);
    } catch {}
  }

  return Response.json(uniq(players), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default handlePlayers;
