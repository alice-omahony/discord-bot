import {ActionRowBuilder, ApplicationCommandType, TextInputStyle, CommandInteraction, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, ModalSubmitInteraction} from "discord.js";
import { dbClient } from "../backend/server";

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

export async function handleModalCallback(targetMsgId: string, interaction: ModalSubmitInteraction) {
  // console.log(interaction)
  console.log(targetMsgId);

  const content = interaction.fields.getTextInputValue("editQuoteInput");
  const attribution = interaction.fields.getTextInputValue("editQuoteAttributionInput");


  if(!dbClient) {
    interaction.reply("Database current unavailable, unable to save quote.")
  }

  try{
    const result = await dbClient?.update(
      {
        id: targetMsgId,
        content: content,
        author: attribution,
        updatedAt: interaction.createdAt.toISOString()
      }
    );

      // TODO: Update the old message in place in the channel


    interaction.reply({content: "Successfully updated quote", ephemeral: true})

  } catch {() => {
    console.error("something baaaad happened");
  }}



  // interaction.reply({content: "updated DB", ephemeral: true});
}

function extractQuoteFromInteraction(i: MessageContextMenuCommandInteraction): QuoteData  {
  // TODO: Remove text formatting (quotation marks and italics)
  const quoteContentRegex = /"([^"]*)"/;
  const quoteAttributionRegex = /-\s*(.*)$/;

  const message = i.targetMessage.content;

  const quoteContent = message.match(quoteContentRegex);
  const quoteAttribution = message.match(quoteAttributionRegex);


  return {
    quote: quoteContent ? quoteContent[0].trim() : "Quote",
    attribution: quoteAttribution ? quoteAttribution[0].trim() : "Attribution"
  };
}