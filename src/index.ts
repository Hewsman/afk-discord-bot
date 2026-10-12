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
    interaction.commandName === "afk" ||
    interaction.commandName === "not-afk"
  ) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);

    if (!interaction.guild || !member) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const afkSuffix = " | AFK";
    const isAfk = interaction.commandName === "afk";
    const currentNickname = member.nickname ?? member.user.username;

    try {
      if (isAfk) {
        if (currentNickname.endsWith(afkSuffix)) {
          await interaction.reply({
            content: "You're already marked as AFK.",
            ephemeral: true,
          });
          return;
        }

        // Discord nickname limit: 32 characters.
        const newNickname =
          currentNickname.slice(0, 32 - afkSuffix.length) + afkSuffix;

        await member.setNickname(newNickname);

        await interaction.reply(`<@${interaction.user.id}> is now AFK.`);
      } else {
        if (!currentNickname.endsWith(afkSuffix)) {
          await interaction.reply({
            content: "You're not currently marked as AFK.",
            ephemeral: true,
          });
          return;
        }

        const newNickname = currentNickname
          .slice(0, -afkSuffix.length)
          .trimEnd();

        await member.setNickname(newNickname || null);

        await interaction.reply(`<@${interaction.user.id}> is no longer AFK.`);
      }
    } catch (error) {
      console.error("Failed to update AFK status:", error);

      await interaction.reply({
        content:
          "I couldn't update your nickname. Check whether the bot has Manage Nicknames permission and a sufficiently high role.",
        ephemeral: true,
      });
    }
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
        selfDeaf: true,
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

  if (interaction.isUserContextMenuCommand()) {
    if (interaction.commandName === "afk") {
      const targetUser = interaction.targetUser;

      const targetMember = await interaction.guild?.members.fetch(
        targetUser.id,
      );

      if (!interaction.guild || !targetMember) {
        await interaction.reply({
          content: "This command can only be used in a server.",
          ephemeral: true,
        });
        return;
      }

      const currentNickname = targetMember.nickname ?? targetUser.username;

      if (currentNickname.endsWith(" | afk")) {
        await interaction.reply({
          content: `${targetUser.username} is already marked as afk.`,
          ephemeral: true,
        });
        return;
      }

      try {
        await targetMember.setNickname(`${currentNickname} | afk`);

        await interaction.reply({
          content: `Marked ${targetUser.username} as afk.`,
          ephemeral: true,
        });
      } catch {
        await interaction.reply({
          content:
            "I couldn't change that user's nickname. Check my Manage Nicknames permission and role position.",
          ephemeral: true,
        });
      }
    }

    return;
  }
});

client.login(token);
