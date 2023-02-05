import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { TextChannel } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('s')
    .setDescription('Find and replace text in the last message of the channel your\'re in')
    .addStringOption(o =>
      o.setName('find')
        .setDescription('Text to find')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('replace')
        .setDescription('Text to replace the found text with')
        .setRequired(true)),
  usage: '<find>/<replace>',
  example: 'tst/test',
}];

/**
 * Get the content of the previous message in a channel with text replaced in it
 * @param {TextChannel} channel Channel to get the previous message from
 * @param {string} find Find this string
 * @param {string} replace Replace with this string
 * @param {number} amount How many messages to go back in history (1 for slash-command, 2 for legacy)
 */
export async function getSubstitute(channel, find, replace, amount) {
  const messages = await channel.messages.fetch({ limit: amount });
  const m = messages.last();
  return m.author.toString() + ': ' + m.content.replace(find, replace);
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const find = interaction.options.getString('find');
  const replace = interaction.options.getString('replace');
  await interaction.reply(await getSubstitute(interaction.channel, find, replace, 1));
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
  const match = /s (.+)\/(.*)/.exec(message.content.substring(1));
  if (match === null) {
    await replySingleCommandHelp(message, 's');
  } else {
    await message.reply(await getSubstitute(message.channel, match[1], match[2], 2));
  }
}