// console_speak.js
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
// Import BOTH IDs (Make sure to add GENERAL_CHANNEL_ID to config.js first!)
import { SCRIPTURE_CHANNEL_ID, GENERAL_CHANNEL_ID } from './utils/constants.js';

dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const args = process.argv.slice(2);
const channelName = args[0]; // First word is the channel
const message = args.slice(1).join(' '); // Rest is the message

client.once('ready', async () => {
    // Select ID based on the first word
    let targetID = SCRIPTURE_CHANNEL_ID; // Default
    if (channelName === 'gen') targetID = GENERAL_CHANNEL_ID;
    
    const channel = await client.channels.fetch(targetID);
    await channel.send(message);
    console.log(`✅ Sent to #${channel.name}: "${message}"`);
    
    client.destroy();
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);