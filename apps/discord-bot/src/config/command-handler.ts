import {
  Collection,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
} from "discord.js";
import { botCommands } from "../commands";

export const CommandPermissions = {
  Administrator: "Administrator",
  ManageGuild: "ManageGuild",
  ManageRoles: "ManageRoles",
  ManageChannels: "ManageChannels",
} as const;

export interface SlashCommand {
  name: string;
  description: string;
  data: SlashCommandBuilder;
  requiredPermissions: (typeof CommandPermissions)[keyof typeof CommandPermissions][];
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}
export const rawBotCommands = botCommands;

export const getCommandCollection = () => {
  const commands = new Collection<string, SlashCommand>();
  for (const command of rawBotCommands) {
    commands.set(command.name, command);
  }
  return commands;
};
