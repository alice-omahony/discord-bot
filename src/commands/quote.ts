import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Create a quote and save it to the database.");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Quote created!");
}
