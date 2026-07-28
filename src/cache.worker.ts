/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";

import handleGame from "./CacheWorker/handleGame";
import handleOpeningRequest from "./CacheWorker/handleOpeningRequest";
import handlePlayerGames from "./CacheWorker/handlePlayerGames";
import { API } from "./settings";

declare const self: ServiceWorkerGlobalScope;
const baseUrlObject = new URL(API.BASE_URL);

precacheAndRoute(self.__WB_MANIFEST);

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
