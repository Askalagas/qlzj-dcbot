import { SlashCommandBuilder } from 'discord.js';
import { drawTarot } from '../engines/tarotEngine.js'; 
import { narrateDivination } from '../divinationNarrator.js'; 
import { openai, trackUsage, canUse, PROMPTS, isChinese, getUserTitle, modifyMerit } from '../utils/shared.js';

export const data = new SlashCommandBuilder()
    .setName('tarot')
    .setDescription('Cast a Tarot reading')
    .addStringOption(option => 
        option.setName('question')
            .setDescription('Your question for the oracle')
            .setRequired(false));

export const execute = async (interaction) => {
    if (!canUse(interaction.user.id, "tarot")) {
        return interaction.reply({ content: "The cards have already been drawn today.", ephemeral: true });
    }

    await interaction.deferReply();

    modifyMerit(interaction.user.id, 1);

    const question = interaction.options.getString("question") || "Unspoken Query";
    const cards = drawTarot(2);
    const narrative = narrateDivination("tarot", cards);

    // 1. Detect Language
    const useChinese = isChinese(question);

    // 2. Select Persona based on language
    const systemPrompt = useChinese ? PROMPTS.CN_SERIOUS : PROMPTS.EN_SERIOUS;

    const userTitle = getUserTitle(interaction.user.id, useChinese);

    // 3. Select Instruction Template based on language
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
        await interaction.editReply("The stars are silent. (API Error)");
    }
};