import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import util from 'util';
import { Message } from 'discord.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate an expression'),
  doNotRegister: true,
}];

/**
 * Execute code and send the response in a channel
 * @param {string} authorId Author of the eval message (for permission checking)
 * @param {Message} message Message to reply to
 * @param {string} code Code to execute
 * @returns {Promise<boolean>} true if the author has the permission to use the eval command
 */
export async function doEval(authorId, message, code) {
  if (authorId === config.ownerId) {
    try {
      const estart = process.hrtime();
      const evaled = eval(code);
      const eend = process.hrtime(estart);
      const tm = '*Executed in ' + (eend[0] * 1000 + eend[1] / 1000000) + ' ms.*\n';
      if (typeof evaled === 'object') {
        await message.reply(sendLong(tm + '```\n' + util.inspect(evaled).replace(config.discordToken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      } else if (typeof evaled === 'undefined') {
        await message.reply(tm + '```\nundefined\n```');
      } else if (evaled === null) {
        await message.reply(tm + '```\nnull\n```');
      } else {
        await message.reply(sendLong(tm + '```\n' + evaled.toString().replace(config.discordToken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      }
    } catch (err) {
      let errToSend = err;
      if (err !== null && typeof err === 'object') {
        errToSend = util.inspect(err);
      }
      await message.reply(':x: Error!\n```\n' + errToSend.replace(config.discordToken, '<TOKEN HAS BEEN HIDDEN>') + '\n```');
    }
    return true;
  } else {
    return false;
  }
}

function sendLong(text, max = 2000, limintext = max) {
  if (text.length > max) {
    return 'Message is too long to send (' + text.length + ' of ' + limintext + ' chars)';
  } else {
    return text;
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
  if (!await doEval(message.author.id, message, args.join(' '))) {
    await message.reply('You ain\'t doing that!');
  }
}