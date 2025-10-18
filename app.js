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

app.all("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
