import { Client } from "discord.js";

import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import { startServer } from "./backend/server";


const client = new Client({
    intents: ["Guilds", "GuildMessages"],
});

client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
    console.log('Starting auth server...');
    startServer();
  });


      // try {
      //   const query = {
      //     // give the query a unique name
      //     name: 'fetch-quote',
      //     text: 'SELECT * FROM quote WHERE id = $1',
      //     values: [1],
      //   }


      //   const res = await client.query(query);
      //   console.log(res);
      // } catch (err) {
      //     console.error(err);
      // } finally {
      //     await client.end()
      // }

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);


