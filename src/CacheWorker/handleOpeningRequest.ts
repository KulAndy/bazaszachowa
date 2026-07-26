import type { GameData } from "../ChessEditor";
import { API, CACHE } from "../settings";

import getCache from "./getCache";
import putCache from "./putCache";

const ECO: Record<string, { max: string; min: string }> = {
  Alechin: { max: "B05", min: "B02" },
  Angielska: { max: "A39", min: "A10" },
  Benoni: { max: "A79", min: "A56" },
  Bogoljubow: { max: "E11", min: "E11" },
  "Caro-Kann": { max: "B19", min: "B10" },
  "Debiut czterech skoczków": { max: "C49", min: "C47" },
  "Debiut gońca": { max: "C24", min: "C23" },
  "Debiut pionka hetmańskiego": { max: "E10", min: "A40" },
  "Debiut pionka królewskiego": { max: "C22", min: "C20" },
  "Debiut skoczka królewskiego": { max: "C40", min: "C40" },
  "Debiut trzech skoczków": { max: "C46", min: "C46" },
  Francuska: { max: "C19", min: "C00" },
  "Gambit hetmański": { max: "D69", min: "D30" },
  "Gambit królewski": { max: "C39", min: "C30" },
  Grunfeld: { max: "D99", min: "D70" },
  "Hetmańsko-indyjska": { max: "E19", min: "E12" },
  Hiszpańska: { max: "C99", min: "C60" },
  Holenderska: { max: "A99", min: "A80" },
  Katalońska: { max: "E09", min: "E00" },
  "Królewskie Fianchetto": { max: "B06", min: "B06" },
  "Królewsko-indyjska": { max: "E99", min: "E60" },
  Nimzowitsch: { max: "E59", min: "E20" },
  Philidor: { max: "C41", min: "C41" },
  Pirc: { max: "B09", min: "B07" },
  "Przyjęty gambit hetmański": { max: "D29", min: "D20" },
  Reti: { max: "A09", min: "A09" },
  Rosyjska: { max: "C43", min: "C42" },
  Różne: { max: "B00", min: "A00" },
  Skandynawska: { max: "B01", min: "B01" },
  Słowiańska: { max: "D19", min: "D10" },
  staroindyjska: { max: "A55", min: "A53" },
  Sycylijska: { max: "B99", min: "B20" },
  Szkocka: { max: "C45", min: "C44" },
  Wiedeńska: { max: "C29", min: "C25" },
  Włoska: { max: "C59", min: "C50" },
};

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
        (game) =>
          game.ECO &&
          game.ECO <= ECO[opening].max &&
          game.ECO >= ECO[opening].min,
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
