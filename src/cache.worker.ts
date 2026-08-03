/// <reference lib="webworker" />

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

import handleExtremes from "./CacheWorker/handleExtremes";
import handleFiltered from "./CacheWorker/handleFiltered";
import handleGame from "./CacheWorker/handleGame";
import handlePlayerGames from "./CacheWorker/handleGames";
import handleOpenings from "./CacheWorker/handleOpenings";
import handlePlayers from "./CacheWorker/handlePlayers";
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

registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new NetworkFirst({
    cacheName: "static-assets",
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 100,
      }),
    ],
  }),
);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.hostname !== baseUrlObject.hostname) {
    return;
  }

  if (url.pathname.startsWith(API.games.filter)) {
    event.respondWith(handleFiltered(event.request));
  } else if (url.pathname.startsWith(API.games.normal)) {
    event.respondWith(handlePlayerGames(event.request));
  } else if (url.pathname.startsWith(API.game)) {
    event.respondWith(handleGame(event.request));
  } else if (url.pathname.startsWith(API.extremes)) {
    event.respondWith(handleExtremes(event.request));
  } else if (url.pathname.startsWith(API.openings)) {
    event.respondWith(handleOpenings(event.request));
  } else if (url.pathname.startsWith(API.players)) {
    event.respondWith(handlePlayers(event.request));
  }
});

self.addEventListener("install", () => {
  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
