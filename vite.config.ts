import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import checker from "vite-plugin-checker";

import { API } from "./src/settings";

export default defineConfig({
  build: {
    minify: "terser",
    sourcemap: false,
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint ./src --ext .ts,.tsx",
      },
      stylelint: {
        lintCommand: "stylelint './src/**/*.{css,scss,sass,less}'",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        short_name: "bazaszachowa",
        name: "Internetowa baza szachowa",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
      workbox: {
        globIgnores: ["**/*worker*.js", "**/*.wasm", "**/stockfish*"],
        navigateFallbackDenylist: [
          /^\/game_raw\/.*/,
          /chess_processor|game_stats|stats|uci2pgn/,
        ],
        runtimeCaching: [
          {
            urlPattern: /^\/game_raw\/.*/,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /chess_processor|game_stats|stats|uci2pgn/,
            handler: "NetworkOnly",
          },
          {
            urlPattern: new RegExp(`${API.BASE_URL.replaceAll(".", "\\.")}/.*`),

            handler: "NetworkFirst",

            options: {
              cacheName: "bazaszachowa-api",

              expiration: {
                maxEntries: 10000,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
  },
});
