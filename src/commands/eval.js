import config from '../../config.js';
import util from 'util';
import { Message } from 'discord.js';

/**
 * Execute code and send the response in a channel
 * @param {string} authorId Author of the eval message (for permission checking)
 * @param {Message} message Message to reply to
 * @param {string} code Code to execute
 * @returns {boolean} true if the author has the permission to use the eval command
 */
export function doEval(authorId, message, code) {
  if (authorId === config.ownerid) {
    try {
      const estart = process.hrtime();
      const evaled = eval(code);
      const eend = process.hrtime(estart);
      const tm = '*Executed in ' + (eend[0] * 1000 + eend[1] / 1000000) + ' ms.*\n';
      if (typeof evaled === 'object') {
        message.reply(sendLong(tm + '```\n' + util.inspect(evaled).replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      } else if (typeof evaled === 'undefined') {
        message.reply(tm + '```\nundefined\n```');
      } else if (evaled === null) {
        message.reply(tm + '```\nnull\n```');
      } else {
        message.reply(sendLong(tm + '```\n' + evaled.toString().replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      }
    } catch (err) {
      let errToSend = err;
      if (err !== null && typeof err === 'object') {
        errToSend = util.inspect(err);
      }
      message.reply(':x: Error!\n```\n' + errToSend.replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```');
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