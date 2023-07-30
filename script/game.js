import SEARCHING from "./search_functions.js";
import DISPLAY from "./display_functions.js";

window.onload = async () => {
  const REQUEST_GET = get_data();
  const REQUEST_POST = post_data();

  let current = parseInt(REQUEST_POST.current) || 0;
  let list;
  try {
    list = REQUEST_POST.list.split(",");
  } catch {
    list = [REQUEST_GET.id];
  }
  let base = REQUEST_GET.base;

  const GAME = await SEARCHING.game(list[current], base);
  DISPLAY.game_controls(base, list, current);
  DISPLAY.game(GAME);
};
