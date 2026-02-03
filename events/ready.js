import { Events } from 'discord.js';
import cron from 'node-cron';
// NEW: Import the generator
import { SCRIPTURE_CHANNEL_ID } from '../utils/shared.js';
import { generateProphecyString } from '../utils/prophecyGenerator.js';

export const name = Events.ClientReady;
export const once = true;

export const execute = (client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Set Haunting Status (as discussed before)
    client.user.setPresence({
        activities: [{ name: '静观尔等行止', type: 3 }],
        status: 'dnd',
    });

    // Cron Schedule: 9 AM
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Casting daily prophecy...");
            const channel = await client.channels.fetch(SCRIPTURE_CHANNEL_ID);
            
            // NEW: Use the shared generator
            const prophecyContent = await generateProphecyString();
            
            channel.send(prophecyContent);

        } catch (error) {
            console.error("Prophecy Error:", error);
        }
    }, {
        timezone: "America/Detroit"
    });
};