import { CACHE } from "../settings";

import getCache from "./getCache";
import putCache from "./putCache";

const handleGame = async (request: Request): Promise<Response> => {
  const cache = await caches.open(CACHE.single_games_cache);
  const cached = await getCache(cache, request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response.ok) {
    await putCache(cache, request, response.clone());
  }

  return response;
};

export default handleGame;
