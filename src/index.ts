import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("Missing DISCORD_TOKEN in .env");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once("ready", (readyClient) => {
  console.log(`Bot is online as ${readyClient.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (interaction.commandName === "hello") {
    await interaction.reply("ElJEY ASIM");
  }
  if (
    interaction.commandName === "sali-bebu" ||
    interaction.commandName === "join"
  ) {
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "Join a voice channel first, then use /sali-bebu or /join.",
        ephemeral: true,
      });
      return;
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      await interaction.reply(`Joined **${voiceChannel.name}**!`);
    } catch (error) {
      console.error("Failed to join voice channel:", error);

      await interaction.reply({
        content: "I couldn't join that voice channel.",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
