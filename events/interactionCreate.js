import { Events } from 'discord.js';

export const name = Events.InteractionCreate;
export const once = false;

export const execute = async (interaction) => {
    // Only listen to Slash Commands
    if (!interaction.isChatInputCommand()) return;

    // Find the command in the bot's "Brain" (Collection)
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        // Run the command's "execute" function
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
        
        // Safety reply if something crashes
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'The threads of fate got tangled (Command Error).', ephemeral: true });
        } else {
            await interaction.reply({ content: 'The threads of fate got tangled (Command Error).', ephemeral: true });
        }
    }
};