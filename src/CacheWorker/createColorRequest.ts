import { API } from "../settings";

const createColorRequest = (
  player: string,
  color: "black" | "white",
  parameters?: RequestInit,
) =>
  new Request(
    `${API.BASE_URL}${API.games.filter}${encodeURIComponent(player)}/${color}`,
    parameters,
  );

export default createColorRequest;
