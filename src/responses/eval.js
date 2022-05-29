import config from '../../config.js';
import util from 'util';
import { TextChannel } from 'discord.js';

/**
 * Execute code and send the response in a channel
 * @param {string} authorId Author of the eval message (for permission checking)
 * @param {TextChannel} channel Channel the eval output will be sent to
 * @param {string} code Code to execute
 * @returns {boolean} true if the author has the permission to use the eval command
 */
export function doEval(authorId, channel, code) {
  if (authorId === config.ownerid) {
    try {
      const estart = process.hrtime();
      const evaled = eval(code);
      const eend = process.hrtime(estart);
      const tm = '*Executed in ' + (eend[0] * 1000 + eend[1] / 1000000) + ' ms.*\n';
      let mtd;
      if (typeof evaled === 'object') {
        mtd = channel.send(sendLong(tm + '```\n' + util.inspect(evaled).replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      } else if (typeof evaled === 'undefined') {
        mtd = channel.send(tm + '```\nundefined\n```');
      } else if (evaled === null) {
        mtd = channel.send(tm + '```\nnull\n```');
      } else {
        mtd = channel.send(sendLong(tm + '```\n' + evaled.toString().replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```', 1992, 2000));
      }
      mtd.then(function(msg) {
        if (typeof evaled !== 'undefined') {
          if (typeof evaled.then === 'function') {
            msg.delete(10000);
          }
        }
      });
    } catch (err) {
      let errToSend = err;
      if (err !== null && typeof err === 'object') {
        errToSend = util.inspect(err);
      }
      channel.send(':x: Error!\n```\n' + errToSend.replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + '\n```').then(function(msg) {
        msg.delete(10000);
      });
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