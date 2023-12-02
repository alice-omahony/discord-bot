import { Client } from "discord.js";
import { Client as PgClient } from "pg";

import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config, dbConfig } from "./config";
import { startServer } from "./backend/server";


const client = new Client({
    intents: ["Guilds", "GuildMessages"],
});

client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
    console.log('Starting auth server...');
    startServer();

    const client = new PgClient({
      database: 'discordbot',
      host: 'postgres',
      user: 'postgres',
      password: 'postgres',
      port: 5432
    });
    client.connect()
      .then(() => console.log('Connected to PostgreSQL'))
      .catch(error => console.error('Error connecting to PostgreSQL:', error));


      try {
        const query = {
          // give the query a unique name
          name: 'fetch-quote',
          text: 'SELECT * FROM quote WHERE id = $1',
          values: [1],
        }


        const res = await client.query(query);
        console.log(res);
      } catch (err) {
          console.error(err);
      } finally {
          await client.end()
      }


});

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


