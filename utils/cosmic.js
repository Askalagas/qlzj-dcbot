import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ERAS = [
    "Genesis (创世纪)",                 // Ch 1-299
    "The Age of Blasphemy (渎神纪元)",   // Ch 300-599
    "The Great Tribulation (大灾变)",    // Ch 600-899
    "The Final Judgment (末日审判)",     // Ch 900-1199
    "Apotheosis (飞升纪元)"              // Ch 1200+
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statusPath = path.join(__dirname, '../data/status.json');

// 1. Solar Terms (24 Jieqi)
function getSolarTerm(date) {
    const terms = [
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", 
        "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
        "小暑", "大暑", "立秋", "处暑", "白露", "秋分", 
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
    ];
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const termIndex = Math.floor(dayOfYear / 15.218);
    return terms[termIndex % 24] || "虚空";
}

// 2. Lunar Phase
function getLunarPhase(date) {
    const knownNewMoon = new Date('2000-01-06T18:14:00').getTime();
    const lunation = 29.53058867 * 24 * 60 * 60 * 1000;
    const diff = date.getTime() - knownNewMoon;
    const phase = (diff % lunation) / lunation;

    if (phase < 0.05 || phase > 0.95) return "🌑 新月";
    if (phase < 0.25) return "🌒 蛾眉月";
    if (phase < 0.35) return "🌓 上弦月";
    if (phase < 0.45) return "🌔 盈凸月";
    if (phase < 0.55) return "🌕 满月";
    if (phase < 0.70) return "🌖 亏凸月";
    if (phase < 0.80) return "🌗 下弦月";
    return "🌘 残月";
}

// 3. Planetary Ruler
function getPlanetaryRuler(date) {
    const days = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"];
    return days[date.getDay()];
}

// 4. Daily Hash
function getDailyResonance(dateString) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 100);
}

// ===== EXPORTS =====
export function getCosmicStatus() {
    const now = new Date();
    const detroitDateString = now.toLocaleDateString("en-US", { timeZone: "America/Detroit" });
    const detroitDate = new Date(detroitDateString);

    const solarTerm = getSolarTerm(detroitDate);
    const moon = getLunarPhase(now);
    const planet = getPlanetaryRuler(detroitDate);
    const resonance = getDailyResonance(detroitDateString);

    const year = detroitDate.getFullYear();
    const month = (detroitDate.getMonth() + 1).toString().padStart(2, '0');
    const day = detroitDate.getDate().toString().padStart(2, '0');
    const hash = `0x${year}${month}${day}`;

    return { star: planet, resonance, term: solarTerm, moon, hash };
}

export function getNextChapter() {
    let data = { chapter: 1, era: "Genesis" };
    try {
        if (fs.existsSync(statusPath)) {
            data = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        }
    } catch (e) { console.error("Error reading status:", e); }

    const currentChapter = data.chapter;
    
    const eraIndex = Math.floor(currentChapter / 300);
    // Safety check: if we run out of eras, stick to the last one
    const currentEra = ERAS[eraIndex] || ERAS[ERAS.length - 1];

    data.chapter += 1;
    fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));

    return { number: currentChapter, era: currentEra };
}