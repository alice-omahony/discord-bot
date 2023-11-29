import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { URLSearchParams } from "url";

type ApiResponse = {
  status: number,
  statusText: string
  data: {}
}

export const data = new SlashCommandBuilder()
  .setName("get_channel_messages")
  .setDescription("Get the channel messages for a given channel!");


export async function execute(interaction: CommandInteraction) {
  console.log(`Getting messages for channel ${interaction.channelId}`);
  console.log(`Last message ids ${interaction.channel?.lastMessageId}`);


  if(interaction.channel?.lastMessageId){
    const messageId: number = parseInt(interaction.channel.lastMessageId);
    const channelId: number = parseInt(interaction.channelId);

    await getChannelMessages(channelId, messageId);
  } else {
    return interaction.reply("No messages found.")
  }


  return interaction.reply("Roger");
}

async function getChannelMessages(channelId: number, messageId: number) {
  const params = new URLSearchParams({limit: "1"}).toString();

  const discordApi = 'https://discord.com/api/v10'
  const response = axios.get(`${discordApi}/channels/${channelId}/messages/${messageId}}`)
    .then(function (response) {
      console.log(Object.keys(response.data))
    });
}


// 789148379866333205