import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/rune.json");

const runes = JSON.parse(fs.readFileSync(dataPath, "utf8"));

export function drawRunes(n = 2) {
  const pool = [...runes];
  const picks = [];

  for (let i = 0; i < n; i++) {
    const idx = crypto.randomInt(pool.length);
    const rune = pool.splice(idx, 1)[0];

    // 50% reversal chance
    const reversed = crypto.randomInt(0, 2) === 1;

    picks.push({
      ...rune,
      reversed,
      meaning: reversed ? rune.shadow : rune.meaning
    });
  }

  return picks;
}
