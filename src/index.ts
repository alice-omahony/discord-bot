import { Client, Events, TextChannel } from "discord.js";

import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import { startServer } from "./backend/server";


const client = new Client({
    intents: ["Guilds", "GuildMessages"],
});

client.once(Events.ClientReady, async () => {
    console.log("Discord bot is ready! 🤖");
    startServer();
  });

client.on(Events.GuildCreate, async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const [modalType, targetMsgId] = interaction.customId.split("_");
    
    if (modalType === 'editModal') {      
      const channel = await client.channels.fetch("510376758705389571");
      if(!channel) return;
      
      await commands['edit_quote'].handleModalCallback(targetMsgId, interaction, channel as TextChannel);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);


