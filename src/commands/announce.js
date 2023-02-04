import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import { EmbedBuilder, Message, PermissionsBitField } from 'discord.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Make an announcement across all servers the bot is on'),
  doNotRegister: true,
}];

/**
 * Make an announcement across all servers the bot is on
 * @param {string} authorId Author of the announce message (for permission checking)
 * @param {Message} message Message to reply to
 * @param {string} announcement Announcement message content
 * @returns {Promise<boolean>} true if the author has the permission to use the eval command
 */
export async function doAnnounce(authorId, message, announcement) {
  // TODO: Use embed instead of message for more characters
  if (authorId === config.ownerId) {
    const guilds = await message.client.guilds.fetch();
    const channelsWithErrors = [];
    for (const partialGuild of guilds) {
      const guild = await partialGuild[1].fetch(); // Get all data for partial guild
      const channels = (await guild.channels.fetch()).filter(c => {
        if (!c.isTextBased()) {
          return false; // Filter out all non-text channels
        }
        if (c.isVoiceBased()) {
          return false; // Filter out all VC-Text channels
        }
        return c.permissionsFor(guild.members.me).has([
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ]);
      });
      const channel = channels.find(c => {
        ['chat', 'general'].includes(c.name);
      }) || channels.first();
      try {
        await channel.send(announcement);
      } catch (err) {
        console.log(`Failed to send to guild ${guild.name} (${guild.id})`);
        console.error(err);
        channelsWithErrors.push({ channel: channel, err: err });
      }
    }
    if (channelsWithErrors.length === 0) {
      await message.reply(`${guilds.size} announcements sent successfully!`);
    } else {
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Failed channels')
            .setDescription(channelsWithErrors.map(c => `${c.channel.guild.name} (${c.channel.guild.id}) #${c.channel.name}: ${c.err.message}`).join('\n')),
        ],
      });
    }
    return true;
  } else {
    return false;
  }
}

/**
 * Execute this command from a message (legacy style)
 * @param {Message} message The message that caused command execution
 * @param {string} cmd Command name
 * @param {string[]} args Command arguments
 * @returns {Promise}
 */
// eslint-disable-next-line no-unused-vars
export async function executeFromMessage(message, cmd, args) {
  if (!await doAnnounce(message.author.id, message, args.join(' '))) {
    await message.reply('You ain\'t doing that!');
  }
}