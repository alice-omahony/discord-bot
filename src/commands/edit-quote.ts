import {ActionRowBuilder, ApplicationCommandType, TextInputStyle, CommandInteraction, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, ModalSubmitInteraction, TextChannel} from "discord.js";
import { dbClient } from "../backend/server";
import { config } from "../config";
import axios, { AxiosResponse } from "axios";

interface QuoteData {
  quote: string,
  attribution: string
}

export const data = new ContextMenuCommandBuilder()
  .setName("Edit Quote")
  .setType(ApplicationCommandType.Message)

export async function execute(interaction: CommandInteraction) {
  const cmcInteraction = interaction as MessageContextMenuCommandInteraction;
  const {quote, attribution} = extractQuoteFromInteraction(cmcInteraction);

  // Create and add components to edit modal
  const editModal = new ModalBuilder()
  .setCustomId(`editModal_${cmcInteraction.targetMessage.id}`)
  .setTitle("Edit");
  
  const quoteInput = new TextInputBuilder()
  .setCustomId("editQuoteInput")
  .setLabel("Quote Content")
  .setStyle(TextInputStyle.Short)
  .setRequired(true)
  .setPlaceholder(quote);
  
  const quoteAttributionInput = new TextInputBuilder()
  .setCustomId("editQuoteAttributionInput")
  .setLabel("Quote Attribution")
  .setStyle(TextInputStyle.Short)
  .setRequired(true)
  .setPlaceholder(attribution);

  // An action row only holds one text input,
  // so you need one action row per text input.
  const quoteContentActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(quoteInput);
  const quoteAtrActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(quoteAttributionInput);
  editModal.addComponents(quoteContentActionRow, quoteAtrActionRow);
  
  await interaction.showModal(editModal);
}

export async function handleModalCallback(targetMsgId: string, interaction: ModalSubmitInteraction, channel: TextChannel) {
  const editedContent = interaction.fields.getTextInputValue("editQuoteInput");
  const editedAttribution = interaction.fields.getTextInputValue("editQuoteAttributionInput");

  if(!dbClient) {
    interaction.reply({content: "Database current unavailable, unable to save quote.", ephemeral: true});
  }

  try {
    await dbClient?.update(
      {
        id: targetMsgId,
        content: editedContent,
        author: editedAttribution,
        updatedAt: interaction.createdAt.toISOString()
      }
    );
  
    const msg = await channel.messages.fetch(targetMsgId);
    await msg.edit(`"${editedContent}" - _${editedAttribution}_`);  
    interaction.reply({content: "Successfully updated quote", ephemeral: true});

  } catch { (err: Error) =>
    interaction.reply({
      content: `Unable to edit quote date, please try again later: ${err.message}`,
      ephemeral: true
    });
  }
}

function extractQuoteFromInteraction(i: MessageContextMenuCommandInteraction): QuoteData  {
  const message = i.targetMessage.content;

  const quoteSplit = "\" - _";
  const quoteParts = message.split(quoteSplit);

  const formattedQuoteContent = quoteParts.length === 2 ? quoteParts[0].trim().substring(1) : "Quote";
  const formattedQuoteAttribution = quoteParts.length === 2 ? quoteParts[1].trim().substring(0, quoteParts[1].length - 1) : "Attribution";

  return {
    quote: formattedQuoteContent,
    attribution: formattedQuoteAttribution
  };
}