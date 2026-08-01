import { orderBy, uniqBy } from "es-toolkit";

import type { GameData } from "../ChessEditor";

import createColorRequest from "./createColorRequest";
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
  const base = url.searchParams.get("table") || "all";
  const searching = url.searchParams.get("searching");

  if ((white || black) && base === "all" && searching === "fulltext") {
    const parameters = {
      headers: request.headers,
      method: request.method,
    };

    const requests = [];
    if (white) {
      requests.push(createColorRequest(white, "white", parameters));
      if (ignore) {
        requests.push(createColorRequest(white, "black", parameters));
      }
    }

    if (black) {
      requests.push(createColorRequest(black, "white", parameters));
      if (ignore) {
        requests.push(createColorRequest(black, "black", parameters));
      }
    }

    const responses = await Promise.all(
      requests.map((x) => handleOpeningRequest(x)),
    );

    const gameArrays = await Promise.all(
      responses.map((response) => response.json() as Promise<GameData[]>),
    );

    let games: GameData[] = gameArrays.flat();
    if (minYear && minYear > 1475) {
      games = games.filter((x) => x.Year && x.Year >= minYear);
    }
    if (maxYear && maxYear < currentYear) {
      games = games.filter((x) => x.Year && x.Year <= maxYear);
    }

    if (event) {
      const eventRegex = new RegExp(
        `^${event}%`.replaceAll("_", ".").replaceAll("%", ".*"),
      );

      games = games.filter((game) => game.Event && eventRegex.test(game.Event));
    }

    if (minEco && minEco !== "A00") {
      games = games.filter((x) => x.ECO && x.ECO >= minEco);
    }

    if (maxEco && maxEco !== "E99") {
      games = games.filter((x) => x.ECO && x.ECO <= maxEco);
    }

    if (white && black) {
      games = ignore
        ? games.filter(
            (x) =>
              x.White &&
              x.Black &&
              ((x.White === white && x.Black === black) ||
                (x.White === black && x.Black === white)),
          )
        : games.filter(
            (x) => x.White && x.Black && x.White === white && x.Black === black,
          );
      games = uniqBy(games, (x) => x.id);
    }

    games = orderBy(
      games,
      ["Year", "Month", "Day", "Event", "Round", "White", "Black"],
      ["desc", "desc", "desc", "asc", "desc", "asc", "asc"],
    );

    return Response.json(
      { rows: games, table: "all" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const response = await fetch(request);
  return response;
};

export default handleGames;
