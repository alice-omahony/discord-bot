import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../deploy-commands";

export const data = new SlashCommandBuilder()
  .setName('reload_commands')
  .setDescription("Reload server commands for this server");

export async function execute(interaction: CommandInteraction) {
  if(interaction.guild?.ownerId !== interaction.user.id)
    return interaction.reply("Only the guild owner can reload commands!")

  await deployCommands({guildId: interaction.guildId as string})
  return interaction.reply("Reloading commands!");
} 

