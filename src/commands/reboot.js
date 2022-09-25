import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import { Message } from 'discord.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Restart the bot'),
  doNotRegister: true,
}];

/**
 * Restart the bot
 * @param {Message} message The message to reply to, to confirm that the bot is restarting
 * @returns {boolean} false if the author does not have the permission to use the reboot command
 */
export function doReboot(message) {
  if (message.author.id === config.ownerId) {
    message.reply('Restarting!').then(() => {
      console.log('Restarted by ' + message.author.tag);
      process.exit(0);
    });
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
  if (!doReboot(message)) {
    await message.reply('You ain\'t doing that!');
  }
}