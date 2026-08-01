import { max, min } from "es-toolkit/compat";

import type { GameData } from "../ChessEditor";

import createColorRequest from "./createColorRequest";
import handleOpeningRequest from "./handleOpeningRequest";

const fetchGames = async (
  player: string,
  color: "black" | "white",
  parameters: RequestInit,
): Promise<GameData[]> => {
  const response = await handleOpeningRequest(
    createColorRequest(player, color, parameters),
  );
  const data = (await response.json()) as GameData[];
  return data;
};

const handleExtremes = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const player = decodeURIComponent(parts[3]);
  const parameters = {
    headers: request.headers,
    method: request.method,
  };

  try {
    const [whiteGames, blackGames] = await Promise.all([
      fetchGames(player, "white", parameters),
      fetchGames(player, "black", parameters),
    ]);

    const maxElo = max([
      ...whiteGames.map((x) => x.WhiteElo),
      ...blackGames.map((x) => x.BlackElo),
    ]);

    const years = [
      ...whiteGames.map((x) => x.Year),
      ...blackGames.map((x) => x.Year),
    ];

    const maxYear = max(years);
    const minYear = min(years);

    return Response.json([{ maxElo, maxYear, minYear }], {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    const response = await fetch(request);
    return response;
  }
};

export default handleExtremes;
