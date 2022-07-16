import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../../config.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-Ball a question')
    .addStringOption(o =>
      o.setName('question')
        .setDescription('The question you want to ask')
        .setRequired(false)),
  usage: '[question]',
  example: 'Is this real life?',
}];

/**
 * Get a random Magic 8-Ball response
 * @returns {string}
 */
export function get8BallResponse() {
  const rnd = Math.floor(Math.random() * config.eightBallResponses.length);
  return config.eightBallResponses[rnd];
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  await interaction.reply(get8BallResponse());
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
  await message.reply(get8BallResponse());
}