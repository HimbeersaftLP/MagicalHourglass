import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
// import config from '../../config.js';

// TODO: Add juice emote
// const fishList = [config.juiceEmote, '🐠', '🐟', '🐡', '🐬', '🐳', '🐋'];

const fishList = ['🐠', '🐟', '🐡', '🐬', '🐳', '🐋'];

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Go fishing'),
}];

/**
 * Get a message with a random fish emoji
 * @returns {string}
 */
export function getFish() {
  const fish = fishList[Math.floor(Math.random() * fishList.length)];
  return 'You caught a ' + fish + '.';
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  await interaction.reply(getFish());
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
  await message.reply(getFish());
}