import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getClientCredentials } from "../backend/auth";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");


export async function execute(interaction: CommandInteraction) {
  getClientCredentials()
    .then((res) => console.log(res));

  return interaction.reply("Pong!");
}
