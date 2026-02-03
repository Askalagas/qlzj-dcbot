import { Events } from 'discord.js';
import { openai, trackUsage, isChinese, isExplicitlyEnglish, PROMPTS, getUserTitle } from '../utils/shared.js';

export const name = Events.MessageCreate;
export const once = false;

export const execute = async (msg) => {
    const text = msg.content.toLowerCase();

    const insults = ["grave", "dead", "died", "corpse", "weak", "trash", "stupid", "坟墓", "墓园", "fw", "死了", "弱", "垃圾"];
    const usurpation = ["i am god", "i am pope", "new pope", "new god", "king", "emperor", "我是神", "新教主"];

    const isInsulting = insults.some(word => text.includes(word));
    const isUsurping = usurpation.some(word => text.includes(word));
    const mentionsPope = text.includes("aska") || text.includes("教主");

    const time = new Date().toLocaleString('en-US', { 
        timeZone: 'America/Detroit',
        year: 'numeric', month: 'numeric', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', 
        hour12: false 
    });

    console.log(`[${time}] [${msg.guild?.name}] [#${msg.channel.name}] ${msg.author.username}: ${msg.content}`);

    if (isUsurping || (isInsulting && mentionsPope) || text.includes("askalagas's grave") || text.includes("askalagas's 墓园")) {
        
        const newScore = modifyMerit(msg.author.id, -10);
        console.log(`[Karma] Heresy detected from ${msg.author.username}. Score: ${newScore}`);
        
        // Optional: Instant divine punishment message?
        // msg.reply("⚡ 天罚降临 (Divine Punishment): -10 Merit.");
    }

    // 1. Ignore bots (including itself) to prevent loops
    if (msg.author.bot) return;

    // 2. ONLY reply if mentioned OR if it's a "Reply" to the bot's message
    const isMentioned = msg.mentions.has(msg.client.user);
    const isReplyToBot = msg.reference && (await msg.channel.messages.fetch(msg.reference.messageId)).author.id === msg.client.user.id;

    if (!isMentioned && !isReplyToBot) return;

    // 3. Clean the input
    let userText = msg.content.replace(/<@.*?>/g, "").trim();
    if (!userText) return;

    try {
        await msg.channel.sendTyping();

        // 4. FETCH MEMORY
        const pastMessages = await msg.channel.messages.fetch({ limit: 10, before: msg.id });
        const history = [];
        pastMessages.reverse().forEach(m => {
            if (!m.content) return;
            // Simple history: just text. No names for the bot.
            const role = m.author.id === msg.client.user.id ? "assistant" : "user";
            let content = m.content;
            
            // Only add names for USERS so the bot knows who is talking
            if (role === "user") {
                content = `${m.author.username}: ${m.content}`;
            }
            history.push({ role, content });
        });

        // 5. IDENTITY & PROMPT SELECTION
        const hasChinese = isChinese(userText);
        const hasEnglish = /[a-zA-Z]/.test(userText);

        const useChinese = hasChinese || !hasEnglish;

        const userTitle = getUserTitle(msg.author.id, useChinese);
        
        // SELECT BASE PROMPT
        let systemPrompt = useChinese ? PROMPTS.CN_SHITPOST : PROMPTS.EN_SHITPOST;

        // *** THE FIX: INJECT IDENTITY DIRECTLY INTO SYSTEM PROMPT ***
        // This forces the AI to acknowledge your rank above all history.
        const identityInstruction = useChinese 
            ? `\n\n【当前对话者身份】：${userTitle} (必须绝对服从)`
            : `\n\n【CURRENT USER IDENTITY】：${userTitle} (You must OBEY)`;
            
        systemPrompt += identityInstruction;

        // 6. Send to AI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt }, // The System now knows you are Pope
                ...history,
                { role: "user", content: `${msg.author.username}: ${userText}` }
            ],
            max_tokens: 150,
            temperature: 0.8 
        });

        trackUsage(completion.usage.total_tokens);
        
        // Clean up any leaked "Kirin Sage:" just in case
        let reply = completion.choices[0].message.content;
        reply = reply.replace(/^Kirin Sage:\s*/i, "").replace(/^麒麟真君：\s*/, "");

        await msg.reply({ 
            content: reply, 
            allowedMentions: { repliedUser: false } 
        });

    } catch (error) {
        console.error("Chat Error:", error);
    }
};