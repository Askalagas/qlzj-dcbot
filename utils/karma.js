import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const karmaPath = path.join(__dirname, '../data/karma.json');

// Ensure file exists
if (!fs.existsSync(karmaPath)) {
    fs.writeFileSync(karmaPath, '{}');
}

// 1. Get Merit
export function getMerit(userId) {
    try {
        const data = JSON.parse(fs.readFileSync(karmaPath, 'utf8'));
        return data[userId] || 0;
    } catch (e) {
        return 0;
    }
}

// 2. Modify Merit
export function modifyMerit(userId, amount) {
    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(karmaPath, 'utf8'));
    } catch (e) {}

    const current = data[userId] || 0;
    const newScore = current + amount;
    
    data[userId] = newScore;
    fs.writeFileSync(karmaPath, JSON.stringify(data, null, 2));
    
    return newScore;
}

// 3. Get Rank Title based on Merit
export function getKarmaRank(merit, isChinese) {
    if (merit >= 50) return isChinese ? "圣人" : "Exalted Saint";
    if (merit >= 10) return isChinese ? "真人" : "Virtuous Sage";
    if (merit <= -50) return isChinese ? "魔道孽障" : "Abyssal Heretic";
    if (merit <= -10) return isChinese ? "愚徒" : "Ignorant Fool";
    
    return isChinese ? "凡人" : "Mortal";
}