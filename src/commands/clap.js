import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('clap')
    .setDescription('Add 👏 some 👏 applause 👏 to 👏 your 👏 message')
    .addStringOption(o =>
      o.setName('text')
        .setDescription('Text to add applause to')
        .setRequired(true)),
  usage: '<text>',
  example: 'That is great',
}];

/**
 * Get a message where the content has its spaces replaces with clap emojis
 * @param {User} author Author of the message
 * @param {string} messageContent Content of the message
 * @returns {string}
 */
export function getClapped(author, messageContent) {
  return author.toString() + ': ' + messageContent.split(' ').join(' 👏 ');
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const text = interaction.options.getString('text');
  await interaction.reply(getClapped(interaction.user, text));
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
  if (!args[0]) {
    await replySingleCommandHelp(message, 'clap');
  } else {
    await message.channel.send(getClapped(message.author, args.join(' ')));
  }
}