import { openai, trackUsage, PROMPTS, getNextChapter, getCosmicStatus } from './shared.js';

export async function generateProphecyString() {
    // 1. Get Real Lore Data
    const chapter = getNextChapter();     
    const cosmic = getCosmicStatus();     
    const today = new Date().toLocaleDateString("zh-CN", { timeZone: "America/Detroit" }).replace(/\//g, "-");

    // 2. Generate Text (Prompting for Chinese context)
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: PROMPTS.CN_SERIOUS },
            { role: "user", content: `
                生成今日的天启经文。
                
                【天道参数 (实时)】
                - 值日星君: ${cosmic.star} (请根据此星君的五行属性决定经文风格)
                - 月相: ${cosmic.moon}
                - 节气: ${cosmic.term}
                - 灵气共鸣度: ${cosmic.resonance}%
                - 纪元: ${chapter.era}
                
                请只输出正文内容。不要标题。` 
            }
        ],
        max_tokens: 350,
        temperature: 0.6
    });

    trackUsage(completion.usage.total_tokens);
    const prophecyBody = completion.choices[0].message.content;

    // 3. Assemble the Output
    const header = `📜 **【${chapter.era} · 第 ${chapter.number} 章】**\n📅 \`${today}\``;
    const footer = `\`🌌 节气: ${cosmic.term} | 🌘 月相: ${cosmic.moon} | 🪐 值神: ${cosmic.star} | 📡 灵蕴: ${cosmic.resonance}%\``;

    return `${header}\n\n${prophecyBody}\n\n${footer}`;
}