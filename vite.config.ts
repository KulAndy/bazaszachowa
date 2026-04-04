import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint2";
import stylelint from "vite-plugin-stylelint";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    minify: "esbuild",
    sourcemap: false,
  },
  plugins: [
    react({
      babel: {
        presets: ["@babel/preset-typescript"],
        plugins: [
          "babel-plugin-react-compiler",
          "babel-plugin-console-source",
          "@babel/plugin-transform-strict-mode",
          "@babel/plugin-transform-json-strings",
          "@babel/plugin-transform-literals",
          "@babel/plugin-transform-unicode-regex",
        ],
      },
    }),
    eslint({
      build: true,
    }),
    stylelint({
      files: ["./src/**/*.{css,scss,sass,less}"],
    }),
    compression({ algorithm: "brotliCompress" }),
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
        globIgnores: ["**/*worker*.js", "**/*.wasm"],
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
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
  },
});
