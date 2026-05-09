import { countBy, meanBy } from "es-toolkit";

import { TITLES } from "./constants";
import type { Opponent } from "./OpponentRow";
import type { Player } from "./PlayerRow";

export const playerRating = (player: Player) => {
  const title = TITLES.find(
    (item) => item.title === player.title && item.sex === player.sex,
  );
  return title?.rating || 1000;
};

export const countPlayedGames = (opponents: Opponent[]) =>
  opponents.filter((item) => ["=", "0", "1"].includes(item.result)).length;

export const calculateAvgRating = (players: Player[]) =>
  meanBy(players, (item) => playerRating(item));

export const calculateGameResults = (opponents: Opponent[]) => {
  const results = countBy(opponents, (item) => item.result);
  results["+"] ||= 0;
  results["="] ||= 0;
  results["-"] ||= 0;
  results["0"] ||= 0;
  results["1"] ||= 0;

  return results;
};

export const calculateDelta = (opponents: Opponent[]) => {
  const playedGames = countPlayedGames(opponents);
  const results = calculateGameResults(opponents);

  return (400 / (playedGames + 1)) * (results["1"] - results["0"]);
};

export const getNorm = (player: Player, opponents: Opponent[]) => {
  const rounds = countPlayedGames(opponents);
  const results = calculateGameResults(opponents);

  if (results["1"] + results["="] * 0.5 < rounds / 3) {
    return null;
  }

  const ratingPerformance =
    calculateAvgRating(opponents) + calculateDelta(opponents);

  const gainedTitles = TITLES.filter(
    (item) =>
      item.required_rating !== null &&
      item.required_rating <= ratingPerformance &&
      item.sex === player.sex &&
      item.games !== null &&
      item.games <= rounds,
  );

  if (gainedTitles.length === 0) {
    return null;
  }
  return gainedTitles.toSorted((a, b) => b.rating - a.rating)[0];
};
