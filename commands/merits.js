import { SlashCommandBuilder } from 'discord.js';
import { getMerit, getKarmaRank, isChinese, POPE_ID } from '../utils/shared.js';

export const data = new SlashCommandBuilder()
    .setName('merit')
    .setDescription('Check your spiritual merit');

export const execute = async (interaction) => {
    const userId = interaction.user.id;
    const name = interaction.member.displayName;
    const useChinese = isChinese(name);

    let score, rank, flavorText;

    // 1. GOD MODE CHECK
    if (userId === POPE_ID) {
        score = "∞"; // Infinity symbol
        rank = useChinese ? "至高主宰" : "Supreme Ruler";
        
        flavorText = useChinese 
            ? "【天道无常】法外之地，因果不沾身。" // "Heaven is unpredictable; You are outside the law, karma does not touch you."
            : "The laws of karma do not apply to the one who wrote them.";
    
    } else {
        // 2. MORTAL MODE
        score = getMerit(userId);
        rank = getKarmaRank(score, useChinese);

        if (score < -10) {
            flavorText = useChinese 
                ? "【百鬼厌弃】The spirits look at you with disgust." 
                : "The spirits look at you with disgust. (百鬼厌弃)";
        } else if (score > 10) {
            flavorText = useChinese 
                ? "【天官赐福】The heavens smile upon you." 
                : "The heavens smile upon you. (天官赐福)";
        } else {
            flavorText = useChinese 
                ? "【尘缘未了】Your soul is yet unweighed." 
                : "Your soul is yet unweighed. (尘缘未了)";
        }
    }

    // 3. BILINGUAL HEADER
    const headerTitle = useChinese ? "天启功德" : "Apocalypse Merit";
    const rankTitle = useChinese ? "位阶" : "Rank";

    const msg = `🔮 **${name}**\n${headerTitle}: **${score}**\n${rankTitle}: **${rank}**\n\n${flavorText}`;

    await interaction.reply(msg);
};