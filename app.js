const express = require("express");
const path = require("path");
const settings = require("./settings");
const axios = require("axios");
const fs = require('fs-extra');

const directoryPath = path.join(__dirname, "bazaszachowa-react", 'public', 'docs');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        process.exit(1);
    }

    const fileList = JSON.stringify(files.filter(file => file.endsWith(".md")));

    const outputPath = path.join(__dirname, 'bazaszachowa-react', 'build', 'fileList.json');

    fs.ensureDir(path.dirname(outputPath))
        .then(() => {
            fs.writeFile(outputPath, fileList, (err) => {
                if (err) {
                    console.error('Error writing file list:', err);
                    process.exit(1);
                }
            });
        })
        .catch((err) => {
            console.error('Error ensuring directory exists:', err);
            process.exit(1);
        });

    const outputPath2 = path.join(__dirname, 'bazaszachowa-react', 'public', 'fileList.json');

    fs.ensureDir(path.dirname(outputPath2))
        .then(() => {
            fs.writeFile(outputPath2, fileList, (err) => {
                if (err) {
                    console.error('Error writing file list:', err);
                    process.exit(1);
                }
            });
        })
        .catch((err) => {
            console.error('Error ensuring directory exists:', err);
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
    console.log(req.params);
    console.log(base);
    console.log(gameid);

    axios
        .get(settings.urls.API_URL + settings.urls.game + base + "/" + gameid)
        .then((response) => {
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
     
1. e4 *
`
                );
            } else {
                res.send(
                    `[Event "${data.Event}"]
[Site "${data.Site}"]
[Date "${data.Year}.${data.Month || "??"}.${data.Day || "??"}"]
[Round "${data.Round}"]
[White "${data.White}"]
[Black "${data.Black}"]
[Result "${data.Result}"]
[ECO "${data.ECO}"]
[WhiteElo "${data.WhiteElo || 0}"]
[BlackElo "${data.BlackElo || 0}"]
     
${data.moves}
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
    res.sendFile(path.join(__dirname, "bazaszachowa-react", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
