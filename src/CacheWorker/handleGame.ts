import type { GameData } from "../ChessEditor";
import { CACHE } from "../settings";

import findCacheValue from "./findCacheValue";
import getCache from "./getCache";
import putCache from "./putCache";

const handleGame = async (request: Request): Promise<Response> => {
  const cache = await caches.open(CACHE.single_games_cache);
  const cached = await getCache(cache, request);

  if (cached) {
    return cached;
  }

  const playersCache = await caches.open(CACHE.player_cache);
  const url = new URL(request.url);
  const gameId = Number(url.pathname.split("/")[3]);
  const games = await findCacheValue<GameData[]>(playersCache, (array) =>
    array.some((x) => x.id === gameId),
  );

  if (games) {
    const game = games.find((x) => x.id === gameId);
    return Response.json([game], {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await fetch(request);
  if (response.ok) {
    await putCache(cache, request, response.clone());
  }

  return response;
};

export default handleGame;
