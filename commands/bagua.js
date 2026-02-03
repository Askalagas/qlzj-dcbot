import { SlashCommandBuilder } from 'discord.js';
import { generateHexagram } from '../engines/baguaEngine.js';
import { narrateDivination } from '../divinationNarrator.js'; 
import { openai, trackUsage, canUse, PROMPTS, isChinese, getUserTitle, modifyMerit } from '../utils/shared.js';

export const data = new SlashCommandBuilder()
    .setName('bagua')
    .setDescription('Cast an I Ching (Bagua) reading')
    .addStringOption(option => 
        option.setName('question')
            .setDescription('Your question for the Tao')
            .setRequired(false));

export const execute = async (interaction) => {
    // 1. Check Limits
    if (!canUse(interaction.user.id, "bagua")) {
        return interaction.reply({ content: "今日易卦已现，天机不可再问。", ephemeral: true });
    }

    await interaction.deferReply();

    modifyMerit(interaction.user.id, 1);

    const question = interaction.options.getString("question") || "未言之问";
    const hex = generateHexagram();
    const narrative = narrateDivination("bagua", hex);

    const useChinese = isChinese(question);

    const userTitle = getUserTitle(interaction.user.id, useChinese);

    const systemPrompt = useChinese ? PROMPTS.CN_SERIOUS : PROMPTS.EN_SERIOUS;
    
    const userPrompt = useChinese 
        ? `【提问者身份】${userTitle}
           【提问】${question}
           【占卜数据】${narrative}
           【任务】
           请根据象征回答。
           注意：提问者是${userTitle}，请务必使用尊称。
           必须包含：结果趋势、关键时间、行动建议。请以严肃的神谕口吻书写。`
        : `[User Rank] ${userTitle}
           [Question] ${question}
           [Divination Data] ${narrative}
           [Task] 
           Interpret these symbols. 
           IMPORTANT: The user is the ${userTitle}. Address them as such, not as a disciple.
           Include: Outcome trend, Key timing, and Actionable advice. 
           Write in a solemn, holy scripture style.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 800,
            temperature: 0.7
        });

        trackUsage(completion.usage.total_tokens);
        await interaction.editReply(completion.choices[0].message.content);
        
    } catch (error) {
        console.error(error);
        await interaction.editReply("The Tao is silent. (API Error)");
    }
};