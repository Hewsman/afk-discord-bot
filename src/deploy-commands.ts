import "dotenv/config";
import {
  REST,
  Routes,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error("Missing configuration in .env");
}

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is online"),
  new SlashCommandBuilder().setName("hello").setDescription("Say hello"),
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join your current voice channel"),
  new SlashCommandBuilder()
    .setName("sali-bebu")
    .setDescription("Join your current voice channel"),
  new ContextMenuCommandBuilder()
    .setName("AFK")
    .setType(ApplicationCommandType.User),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

async function main() {
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  });

  console.log("Successfully registered slash commands!");
}

main().catch(console.error);
