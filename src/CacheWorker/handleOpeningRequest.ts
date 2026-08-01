import type { GameData } from "../ChessEditor";
import { API, CACHE } from "../settings";

import ECO from "./ECO";
import getCache from "./getCache";
import putCache from "./putCache";

const handleOpeningRequest = async (request: Request): Promise<Response> => {
  const cache = await caches.open(CACHE.player_cache);
  const url = new URL(request.url);

  const parts = url.pathname.split("/");
  const player = parts[3] ?? "";
  const color = parts[4] ?? "";
  const opening = parts[5];

  const exact = await getCache(cache, request);

  if (exact) {
    return exact;
  }

  if (opening && opening in ECO) {
    const parentURL = `${url.origin}${API.games.filter}/${player}/${color}`;
    const parent = await getCache(
      cache,
      new Request(parentURL, {
        headers: request.headers,
        method: request.method,
      }),
    );

    if (parent) {
      const games = (await parent.json()) as GameData[];
      const filtered = games.filter(
        (game) => game.ECO && ECO[opening].includes(game.ECO),
      );

      return Response.json(filtered, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  const response = await fetch(request);
  await putCache(cache, request, response.clone());
  return response;
};

export default handleOpeningRequest;
