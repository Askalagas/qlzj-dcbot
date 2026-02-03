import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/tarot.json");

const tarot = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// secure random int
function randInt(max) {
  return crypto.randomInt(0, max);
}

// draw n unique cards
export function drawTarot(n = 2) {
  const deck = [...tarot];
  const drawn = [];

  for (let i = 0; i < n; i++) {
    const idx = randInt(deck.length);
    const card = deck.splice(idx, 1)[0];

    const reversed = randInt(2) === 1;
    drawn.push({
      ...card,
      reversed,
      meaning: reversed ? card.shadow : card.symbolic
    });
  }

  return drawn;
}
