import type { GameData } from "../ChessEditor";
import { API } from "../settings";

import handleOpeningRequest from "./handleOpeningRequest";

const currentYear = new Date().getFullYear();

const handleGames = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  const white = url.searchParams.get("white");
  const black = url.searchParams.get("black");
  const ignore = url.searchParams.get("ignore") === "true";
  const minYear = Number(url.searchParams.get("minYear"));
  const maxYear = Number(url.searchParams.get("maxYear"));
  const event = url.searchParams.get("event");
  const minEco = url.searchParams.get("minEco");
  const maxEco = url.searchParams.get("maxEco");
  if (
    ((white && !black) ||
      (!white &&
        black &&
        (!minYear || minYear <= 1475) &&
        (!maxYear || maxYear >= currentYear))) &&
    !event &&
    (!minEco || minEco <= "A00") &&
    (!maxEco || maxEco >= "E99")
  ) {
    const whiteRequest = new Request(
      `${API.BASE_URL}${API.games.filter}${encodeURIComponent(white ?? "")}/white`,
      {
        headers: request.headers,
        method: request.method,
      },
    );
    const blackRequest = new Request(
      `${API.BASE_URL}${API.games.filter}${encodeURIComponent(black ?? "")}/black`,
      {
        headers: request.headers,
        method: request.method,
      },
    );
    const requests = [];
    if (white || ignore) {
      requests.push(handleOpeningRequest(whiteRequest));
    }
    if (black || ignore) {
      requests.push(handleOpeningRequest(blackRequest));
    }

    const responses = await Promise.all(requests);

    const gameArrays = await Promise.all(
      responses.map(
        async (response_): Promise<GameData[]> =>
          (await response_.json()) as GameData[],
      ),
    );

    const games: GameData[] = gameArrays
      .flat()
      .toSorted((a: GameData, b: GameData) => {
        const yearA = a.Year ?? -Infinity;
        const yearB = b.Year ?? -Infinity;

        if (yearB !== yearA) {
          return yearB - yearA;
        }

        const monthA = a.Month ?? -Infinity;
        const monthB = b.Month ?? -Infinity;

        if (monthB !== monthA) {
          return monthB - monthA;
        }

        return (b.Day ?? -Infinity) - (a.Day ?? -Infinity);
      });

    return Response.json(games, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await fetch(request);
  return response;
};

export default handleGames;
