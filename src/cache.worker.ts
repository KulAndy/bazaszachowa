/// <reference lib="webworker" />

import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

import handleGame from "./CacheWorker/handleGame";
import handlePlayerGames from "./CacheWorker/handleGames";
import handleOpeningRequest from "./CacheWorker/handleOpeningRequest";
import { API } from "./settings";

declare const self: ServiceWorkerGlobalScope;
const baseUrlObject = new URL(API.BASE_URL);

precacheAndRoute(self.__WB_MANIFEST);

const navigationHandler = createHandlerBoundToURL("/index.html");

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/game_raw\/.*/, /chess_processor|game_stats|stats|uci2pgn/],
  }),
);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.hostname !== baseUrlObject.hostname) {
    return;
  }

  if (url.pathname.startsWith(API.games.filter)) {
    event.respondWith(handleOpeningRequest(event.request));
  } else if (url.pathname.startsWith(API.games.normal)) {
    event.respondWith(handlePlayerGames(event.request));
  } else if (url.pathname.startsWith(API.game)) {
    event.respondWith(handleGame(event.request));
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
