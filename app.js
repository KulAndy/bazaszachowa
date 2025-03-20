import express from "express";
import path from "path";
import settings from "./settings.js";
import axios from "axios";
import fs from "fs-extra";
import { Chess } from "chess.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(
  __dirname,
  "bazaszachowa-react",
  "public",
  "docs"
);

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    process.exit(1);
  }

  const fileList = JSON.stringify(files.filter((file) => file.endsWith(".md")));

  const outputPath = path.join(
    __dirname,
    "bazaszachowa-react",
    "build",
    "fileList.json"
  );

  fs.ensureDir(path.dirname(outputPath))
    .then(() => {
      fs.writeFile(outputPath, fileList, (err) => {
        if (err) {
          console.error("Error writing file list:", err);
          process.exit(1);
        }
      });
    })
    .catch((err) => {
      console.error("Error ensuring directory exists:", err);
      process.exit(1);
    });

  const outputPath2 = path.join(
    __dirname,
    "bazaszachowa-react",
    "public",
    "fileList.json"
  );

  fs.ensureDir(path.dirname(outputPath2))
    .then(() => {
      fs.writeFile(outputPath2, fileList, (err) => {
        if (err) {
          console.error("Error writing file list:", err);
          process.exit(1);
        }
      });
    })
    .catch((err) => {
      console.error("Error ensuring directory exists:", err);
      process.exit(1);
    });
});
const app = express();

app.use(express.static(path.join(__dirname, "bazaszachowa-react", "build")));

app.post(settings.urls.send_mail, (req, res) => {
  res.send("<h1>jeszcze nie zaimplementowano</h1>");
});

app.get(settings.urls.game_raw + ":base/:gameid", (req, res) => {
  const base = req.params.base;
  const gameid = req.params.gameid;

  axios
    .get(settings.urls.API_URL + settings.urls.game + base + "/" + gameid)
    .then((response) => {
      const data = response.data[0];
      res.setHeader("Content-Type", "text/plain");
      if (data) {
        const chess = new Chess();
        chess.header(
          "Event",
          data.Event || "?",
          "Site",
          data.Site || "?",
          "Date",
          `${data.Year}.${data.Month || "??"}.${data.Day || "??"}`,
          "Round",
          data.Round || "?",
          "White",
          data.White || "?",
          "Black",
          data.Black || "?",
          "Result",
          data.Result || "?",
          "ECO",
          data.ECO || "?",
          "WhiteElo",
          data.WhiteElo || "?",
          "BlackElo",
          data.BlackElo || "?"
        );
        for (const move of data.moves) {
          const doneMove = chess.move(move);
          if (!doneMove) {
            break;
          }
        }

        const pgn = chess.pgn();

        res.send(pgn);
      } else {
        res.send(
          `[Event "?"]
  [Site "?"]
  [Date "????.??.??"]
  [Round "?"]
  [White "N, N"]
  [Black "N, N"]
  [Result "*"]
  [ECO "?"]
  [WhiteElo "0"]
  [BlackElo "0"]

  1. *
  `
        );
      }
    })
    .catch((error) => {
      res
        .status(400)
        .send(
          settings.urls.API_URL +
            settings.urls.game +
            base +
            "/" +
            gameid +
            "\n" +
            error.message
        );
    });
});

app.all("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "bazaszachowa-react", "build", "index.html")
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
