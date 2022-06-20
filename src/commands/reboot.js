import config from '../../config.js';
import { Message } from 'discord.js';

/**
 * Restart the bot
 * @param {Message} message The message to reply to, to confirm that the bot is restarting
 * @returns {boolean} false if the author does not have the permission to use the reboot command
 */
export function doReboot(message) {
  if (message.author.id === config.ownerid) {
    message.reply('Restarting!').then(() => {
      console.log('Restarted by ' + message.author.username);
      process.exit(0);
    });
    return true;
  } else {
    return false;
  }
}