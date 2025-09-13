import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import stylelint from "vite-plugin-stylelint";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  build: { emptyOutDir: true },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        watchPath: "./src",
      },
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
    }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
  },
});
