import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { POPE_ID } from '../utils/shared.js';
// NEW: Import the generator
import { generateProphecyString } from '../utils/prophecyGenerator.js';

export const data = new SlashCommandBuilder()
    .setName('testprophecy')
    .setDescription('Force a daily prophecy (Pope Only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator); 

export const execute = async (interaction) => {
    if (interaction.user.id !== POPE_ID) {
        return interaction.reply({ content: "呵，滚。", ephemeral: true });
    }

    await interaction.deferReply();

    try {
        // NEW: Use the shared generator
        const prophecyContent = await generateProphecyString();
        
        await interaction.editReply(`**【Testing Daily Prophecy】**\n${prophecyContent}`);

    } catch (error) {
        console.error(error);
        await interaction.editReply("Prophecy generation failed.");
    }
};