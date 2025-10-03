/* eslint-disable @typescript-eslint/no-floating-promises -- just a try catch */
import type { Interaction } from "discord.js";

const handleInteractionCreate = (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};

export default handleInteractionCreate;
