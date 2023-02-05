import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('mock')
    .setDescription('maKeS tHE TeXt loOK lIkE tHiS')
    .addStringOption(o =>
      o.setName('text')
        .setDescription('Text to transform')
        .setRequired(true)),
  usage: '<text>',
  example: 'How can I make an Email address',
}];

/**
 * Get a message where the content is randomly capitalised
 * @param {User} author Author of the message
 * @param {string} messageContent Content of the message
 * @returns {string}
 */
export function getMocked(author, messageContent) {
  let mocked = '';
  for (let i = 0; i < messageContent.length; i++) {
    mocked += (Math.random() >= 0.5) ? messageContent[i].toUpperCase() : messageContent[i].toLowerCase();
  }
  return author.toString() + ': ' + mocked;
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const text = interaction.options.getString('text');
  await interaction.reply(getMocked(interaction.user, text));
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
    await replySingleCommandHelp(message, 'mock');
  } else {
    await message.channel.send(getMocked(message.author, args.join(' ')));
  }
}