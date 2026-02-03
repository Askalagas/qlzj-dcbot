import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { POPE_ID } from './config.js'; // Import ID from config to avoid circular dep

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const limitsPath = path.join(__dirname, '../data/limits.json');

// ===== HELPERS =====
export function isChinese(text) {
    return /[\u4e00-\u9fff]/.test(text);
}

export function isExplicitlyEnglish(text) {
    // Looks for at least 2 consecutive English words or sentences
    // This prevents "1+1" or "ok" from triggering English mode.
    // It matches typical English sentence structures.
    return /[a-zA-Z]{3,}\s+[a-zA-Z]{3,}/.test(text) || /^[a-zA-Z\s,.?']{5,}$/.test(text);
}

export function getUserTitle(userId, isChineseLanguage) {
    if (userId === POPE_ID) {
        return isChineseLanguage ? "教主" : "Supreme Pontiff";
    }
    return isChineseLanguage ? "弟子" : "Disciple";
}

// ===== USAGE TRACKING =====
let monthlyTokens = 0;
const TOKEN_LIMIT = 1_500_000;

export function trackUsage(tokens) {
    monthlyTokens += tokens;
    console.log(`[Usage] Added ${tokens}. Total: ${monthlyTokens}`);
    if (monthlyTokens > TOKEN_LIMIT) console.warn("WARNING: Budget exceeded");
}

// ===== PERSISTENT DAILY LIMITS =====
let dailyLimits;
try {
    if (fs.existsSync(limitsPath)) {
        const raw = fs.readFileSync(limitsPath, 'utf8');
        dailyLimits = new Map(Object.entries(JSON.parse(raw)));
    } else {
        dailyLimits = new Map();
    }
} catch (e) {
    dailyLimits = new Map();
}

export function canUse(userId, type) {
    const today = new Date().toDateString();
    const key = `${userId}-${today}`;

    // 1. Check Memory
    if (!dailyLimits.has(key)) dailyLimits.set(key, {});
    const record = dailyLimits.get(key);

    if (record[type]) return false;

    // 2. Update Memory
    record[type] = true;

    // 3. Clean & Save
    for (const [k, v] of dailyLimits) {
        if (!k.includes(today)) dailyLimits.delete(k);
    }

    const jsonObj = Object.fromEntries(dailyLimits);
    fs.writeFileSync(limitsPath, JSON.stringify(jsonObj));

    return true;
}