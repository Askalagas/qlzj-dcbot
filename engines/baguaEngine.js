import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

// 1. Get the absolute path of THIS file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Build the path to the JSON file safely
const dataPath = path.join(__dirname, "../data/iching.json");

// 3. Load it
const hexagrams = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function tossLine() {
  // 3-coin method: 6,7,8,9
  let sum = 0;
  for (let i = 0; i < 3; i++) sum += crypto.randomInt(2) ? 3 : 2;

  return {
    value: sum,
    line: sum % 2, // 1 yang, 0 yin
    moving: sum === 6 || sum === 9
  };
}

export function generateHexagram() {
  const lines = [];
  for (let i = 0; i < 6; i++) lines.push(tossLine());

  const primary = lines.map(l => l.line).join("");

  // moving lines transform
  const transformedLines = lines.map(l =>
    l.moving ? (l.line === 1 ? 0 : 1) : l.line
  );
  const secondary = transformedLines.join("");

  const primaryHex = hexagrams.find(h => h.binary === primary);
  const secondaryHex = hexagrams.find(h => h.binary === secondary);

  return {
    lines,
    primary,
    secondary,
    primaryHex,
    secondaryHex
  };
}
