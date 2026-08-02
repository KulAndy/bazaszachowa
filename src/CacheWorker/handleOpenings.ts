import { orderBy, round, sumBy } from "es-toolkit";

import type { GameData } from "../ChessEditor";

import createColorRequest from "./createColorRequest";
import ECO from "./ECO";
import handleOpeningRequest from "./handleFiltered";

const string2points = (result: string) => {
  if (result === "1-0") {
    return 1;
  } else if (result === "1/2-1/2") {
    return 0.5;
  }

  return 0;
};

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

const groupOpenings = (games: GameData[]) =>
  Object.entries(ECO).flatMap(([opening, range]) => {
    const filteredGames = games.filter(
      (game) => game.ECO && range.includes(game.ECO),
    );

    if (filteredGames.length === 0) {
      return [];
    }

    return [
      {
        count: filteredGames.length,
        opening,
        percent: round(
          (sumBy(filteredGames, (game) => string2points(game.Result ?? "")) /
            filteredGames.length) *
            100,
          2,
        ),
      },
    ];
  });

const handleOpenings = async (request: Request): Promise<Response> => {
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

    return Response.json({
      blacks: orderBy(
        groupOpenings(blackGames),
        ["count", "percent"],
        ["desc", "desc"],
      ),

      whites: orderBy(
        groupOpenings(whiteGames),
        ["count", "percent"],
        ["desc", "desc"],
      ),
    });
  } catch {
    return fetch(request);
  }
};

export default handleOpenings;
