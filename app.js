const express = require("express");
const path = require("path");
const settings = require("./settings");
const axios = require("axios");
const fs = require("fs-extra");

const app = express();
const distPath = path.join(__dirname, "bazaszachowa-react", "dist");

const directoryPath = path.join(distPath, "docs");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const fileList = JSON.stringify(files.filter((file) => file.endsWith(".md")));

  const outputPath = path.join(distPath, "fileList.json");

  fs.ensureDir(path.dirname(outputPath))
    .then(() => fs.writeFile(outputPath, fileList))
    .catch((err) => {
      console.error("Error ensuring directory exists or writing file:", err);
    });
});

app.use(express.static(distPath));

app.get(settings.urls.game_raw + ":base/:gameid", async (req, res) => {
  const base = req.params.base;
  const gameid = req.params.gameid;

  axios
    .get(settings.urls.API_URL + settings.urls.game + base + "/" + gameid)
    .then(async (response) => {
      const data = response.data[0];
      res.setHeader("Content-Type", "text/plain");
      if (data == undefined) {
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
`,
        );
      } else {
        const { Chess } = await import("chess.js");
        const chess = new Chess();
        chess.header(
          "Event",
          data.Event,
          "Site",
          data.Site,
          "Date",
          `${data.Year}.${data.Month || "??"}.${data.Day || "??"}`,
          "Round",
          data.Round,
          "White",
          data.White,
          "Black",
          data.Black,
          "Result",
          data.Result,
          "ECO",
          data.ECO,
          "WhiteElo",
          data.WhiteElo || 0,
          "BlackElo",
          data.BlackElo || 0,
        );
        for (const move of data.moves) {
          chess.move(move);
        }
        res.send(chess.pgn());
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
            error.message,
        );
    });
});

app.all("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
