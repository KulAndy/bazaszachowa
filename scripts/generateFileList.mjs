import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const documentationDirectory = path.join(__dirname, "..", "dist", "docs");
const files = fs
  .readdirSync(documentationDirectory)
  .filter((f) => f.endsWith(".md"));

fs.writeFileSync(
  path.join(__dirname, "..", "dist", "fileList.json"),
  JSON.stringify(files, null, 2),
);
console.log("✅ fileList.json generated");
