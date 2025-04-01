/* eslint-disable @typescript-eslint/no-floating-promises -- Discord.js client methods return promises that don't need to be awaited */

import type { Collection } from "discord.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { CreateRedisClient, type Redis } from "@taskcord/redis";
import { checkConnection } from "@taskcord/database";
import type { SlashCommand } from "./config/command-handler";
import { getCommandCollection } from "./config/command-handler";
import { registerCommands } from "./config/command-register";
import handleInteractionCreate from "./events/interaction-create";
import { handleGuildCreate } from "./events/guild-join";
import { handleGuildLeave } from "./events/guild-leave";

dotenv.config();

// Declare module to augment Discord.js types
declare module "discord.js" {
  export interface Client {
    globalCacheDb: Redis;
    commands: Collection<string, SlashCommand>;
  }
}

const createAndStartBot = async () => {
  console.clear();
  const redisUrl = process.env.REDIS_URL;
  const globalCacheDb = CreateRedisClient(redisUrl);
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is not set");
  }
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.commands = getCommandCollection();
  client.globalCacheDb = globalCacheDb;
  await checkConnection();
  await registerCommands();

  client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user?.tag}!`);
  });

  client.on(Events.InteractionCreate, handleInteractionCreate);
  client.on(Events.GuildCreate, handleGuildCreate);
  client.on(Events.GuildDelete, handleGuildLeave);

  client.login(BOT_TOKEN);
};

createAndStartBot();
