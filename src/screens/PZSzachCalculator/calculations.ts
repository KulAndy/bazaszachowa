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

const check43 = (
  sex: "F" | "M",
  opponents: Opponent[],
  avgRating: number,
  results: ReturnType<typeof calculateGameResults>,
  rate: number,
) => {
  const rounds = countPlayedGames(opponents);
  const totalPoints = results["1"] + results["="] * 0.5;
  let maxTitle = null;
  for (let index = 5; index <= 9; index += 2) {
    if (rounds >= index || totalPoints < index / 3) {
      continue;
    }
    const delta =
      (400 / (index + 1)) * (results["1"] - results["0"] + (index - rounds));
    const ratingPerformance = avgRating + delta;

    const gainedTitles = TITLES.filter(
      (item) =>
        item.required_rating !== null &&
        item.required_rating <= ratingPerformance &&
        item.sex === sex &&
        item.games !== null &&
        item.games <= rounds &&
        item.min_time !== null &&
        item.min_time <= rate,
    );

    if (
      gainedTitles.length > 0 &&
      (maxTitle === null || maxTitle.rating < gainedTitles[0].rating)
    ) {
      maxTitle = gainedTitles[0];
    }
  }

  return maxTitle;
};

const check44 = (player: Player, opponents: Opponent[], rate: number) => {
  const defeatedOpponents = opponents.filter((item) => item.result === "1");
  const nonDefeatedOpponents = opponents.filter((item) =>
    ["=", "0"].includes(item.result),
  );
  defeatedOpponents.sort((a, b) => playerRating(b) - playerRating(a));
  let maxTitle: (typeof TITLES)[0] | null = null;

  for (let index = -1; index < defeatedOpponents.length; index++) {
    const roundOpponents = [
      ...nonDefeatedOpponents,
      ...defeatedOpponents.slice(0, index),
    ];
    const rounds = countPlayedGames(roundOpponents);
    const results = calculateGameResults(roundOpponents);
    if (results["1"] + results["="] * 0.5 < rounds / 3) {
      continue;
    }
    const ratingPerformance =
      calculateAvgRating([player, ...roundOpponents]) +
      calculateDelta(roundOpponents);
    const gainedTitles = TITLES.filter(
      (item) =>
        item.required_rating !== null &&
        item.required_rating <= ratingPerformance &&
        item.sex === player.sex &&
        item.games !== null &&
        item.games <= rounds &&
        item.min_time !== null &&
        item.min_time <= rate,
    );

    if (
      gainedTitles.length > 0 &&
      (!maxTitle || maxTitle.rating < gainedTitles[0].rating)
    ) {
      maxTitle = gainedTitles[0];
    }
  }
  return maxTitle;
};

const check45 = (player: Player, opponents: Opponent[], rate: number) => {
  let maxTitle: (typeof TITLES)[0] | null = null;
  for (let index = 5; index < opponents.length; index++) {
    const roundOpponents = opponents.slice(0, index);
    const rounds = countPlayedGames(roundOpponents);
    const results = calculateGameResults(roundOpponents);
    if (results["1"] + results["="] * 0.5 < rounds / 3) {
      continue;
    }
    const ratingPerformance =
      calculateAvgRating([player, ...roundOpponents]) +
      calculateDelta(roundOpponents);
    const gainedTitles = TITLES.filter(
      (item) =>
        item.required_rating !== null &&
        item.required_rating <= ratingPerformance &&
        item.sex === player.sex &&
        item.games !== null &&
        item.games <= rounds &&
        item.min_time !== null &&
        item.min_time <= rate,
    );

    if (
      gainedTitles.length > 0 &&
      (!maxTitle || maxTitle.rating < gainedTitles[0].rating)
    ) {
      maxTitle = gainedTitles[0];
    }
  }
  return maxTitle;
};

const check47 = (player: Player, opponents: Opponent[], rate: number) => {
  const rounds = countPlayedGames(opponents);
  const results = calculateGameResults(opponents);

  if (results["1"] + results["="] * 0.5 < rounds / 3) {
    return null;
  }

  if (rounds < 5 || rounds >= 9) {
    return null;
  }

  const ratingPerformance =
    calculateAvgRating([player, ...opponents]) + calculateDelta(opponents);

  const gainedTitles = TITLES.filter(
    (item) =>
      ["I", "K", "M"].includes(item.title) &&
      item.required_rating !== null &&
      item.required_rating <= ratingPerformance &&
      item.sex === player.sex &&
      item.games !== null &&
      item.min_time !== null &&
      item.min_time <= rate,
  );

  if (gainedTitles.length === 0) {
    return null;
  }

  return gainedTitles[0];
};

export const getNorm = (
  player: Player,
  opponents: Opponent[],
  rate: number,
  roundRobin: boolean,
) => {
  const rounds = countPlayedGames(opponents);
  const results = calculateGameResults(opponents);

  if (results["1"] + results["="] * 0.5 < rounds / 3) {
    return { remark: "", title: null };
  }

  const avg = calculateAvgRating([player, ...opponents]);
  const ratingPerformance = avg + calculateDelta(opponents);

  const gainedTitles = TITLES.filter(
    (item) =>
      item.required_rating !== null &&
      item.required_rating <= ratingPerformance &&
      item.sex === player.sex &&
      item.games !== null &&
      item.games <= rounds &&
      item.min_time !== null &&
      item.min_time <= rate,
  );

  let maxTitle: (typeof TITLES)[0] | null = null;
  let remark = "";
  if (gainedTitles.length > 0) {
    maxTitle = gainedTitles[0];
  }

  if (!roundRobin) {
    let newTitle = check43(player.sex, opponents, avg, results, rate);

    if (newTitle && (!maxTitle || maxTitle.rating < newTitle.rating)) {
      maxTitle = newTitle;
      remark = "4.3";
    }

    newTitle = check44(player, opponents, rate);

    if (newTitle && (!maxTitle || maxTitle.rating < newTitle.rating)) {
      maxTitle = newTitle;
      remark = "4.4";
    }

    newTitle = check45(player, opponents, rate);

    if (newTitle && (!maxTitle || maxTitle.rating < newTitle.rating)) {
      maxTitle = newTitle;
      remark = "4.5";
    }

    newTitle = check47(player, opponents, rate);

    if (newTitle && (!maxTitle || maxTitle.rating < newTitle.rating)) {
      maxTitle = newTitle;
      remark = "4.7";
    }
  }

  if (maxTitle && maxTitle?.rating < playerRating(player)) {
    maxTitle = null;
  }

  return { remark, title: maxTitle };
};
