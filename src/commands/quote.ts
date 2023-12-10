import { CacheType, CommandInteraction, CommandInteractionOption, SlashCommandBuilder } from "discord.js";
import { dbClient } from "../backend/server";

export const data = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Create a quote and save it to the database.")
  .addStringOption((string) =>
    string
      .setName('content')
      .setDescription('The content of the quote')
      .setRequired(true)
  )
  .addStringOption((string) =>
    string
      .setName('name')
      .setDescription('The name of the person associated with the quote')
      .setRequired(true)
  );


export async function execute(interaction: CommandInteraction) {
  const inputData: readonly CommandInteractionOption<CacheType>[] = interaction.options.data;

  const outputData = inputData.reduce<Record<string, string>>((acc, item) => {
    if (item.value !== undefined && typeof item.value === 'string') {
      acc[item.name] = item.value;
    }
    return acc;
  }, {});

  console.log(outputData);

  if(!dbClient) {
    interaction.reply("Database current unavailable, unable to save quote.")
  }

  // TODO: rewrite this is a better way??
  return interaction.reply({
    content: `"${outputData.content}" - _${outputData.name}_`,
    fetchReply: true
  }).then( msg => {
    dbClient?.saveMessages([
      {
        id: msg.id,
        content: outputData.content,
        author: outputData.name,
        timestamp: interaction.createdAt.toISOString(),
        reporter: interaction.user.username
      }
    ]);
  }
  ).catch(() => {
    console.log("An issue occured while saving to the DB.");
    // TODO: add followUp step here with ephemeral message if a message is not properly saved to the DB
  });

}
