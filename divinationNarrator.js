export function narrateDivination(type, data) {
  if (type === "tarot") {
    return data.map(c =>
      // CHANGED: used c.meaning instead of c.symbolism
      `${c.name} (${c.reversed ? "Reversed" : "Upright"}): ${c.meaning}`
    ).join("\n");
  }

  if (type === "rune") {
    return data.map(r =>
      `${r.name} ${r.symbol}: ${r.meaning}`
    ).join("\n");
  }

  if (type === "bagua") {
    return `
Primary Hexagram: ${data.primaryHex?.name}
Meaning: ${data.primaryHex?.meaning}

Changing into:
Secondary Hexagram: ${data.secondaryHex?.name}
Meaning: ${data.secondaryHex?.meaning}
`;
  }
}