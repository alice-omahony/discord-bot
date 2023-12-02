import { CommandInteraction, SlashCommandBuilder, Message } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { config } from "../config";
import { dbClient } from "../backend/server";
import { QuoteData } from "../backend/DatabaseClient";

export const data = new SlashCommandBuilder()
  .setName("get_channel_messages")
  .setDescription("Get the channel messages for a given channel!");


export async function execute(interaction: CommandInteraction) {
  console.log(`Getting messages for channel ${interaction.channelId}`);

  if(!interaction.channel?.lastMessageId){
    return interaction.reply("No messages found.");
  }  
  const channelId: string = interaction.channelId;
  const res: number = await getChannelMessages(channelId);

  const message = (res === -1) ? "Unable to save messages to Database" : "Messages saved to database";
  return interaction.reply(message);
}

async function getChannelMessages(channelId: string): Promise<number> {
  if(!dbClient) {
    return Promise.resolve(-1);
  }

  const authHeader = { 'authorization': `Bot ${config.DISCORD_TOKEN}` }
  const discordApi = 'https://discord.com/api/v10';
  const response: AxiosResponse = await axios.get(`${discordApi}/channels/${channelId}/messages?limit=1`, { headers: authHeader });
  const channelMessages = response.data;

  console.log(channelMessages);
  return Promise.resolve(1);
}

