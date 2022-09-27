import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import util from 'util';
import { EmbedBuilder, Message } from 'discord.js';

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
  // TODO: Use embed instead of message for more characters
  if (authorId === config.ownerId) {
    try {
      const estart = process.hrtime();
      const evaled = eval(code);
      const eend = process.hrtime(estart);
      const tm = '*Executed in ' + (eend[0] * 1000 + eend[1] / 1000000) + ' ms.*\n';
      let output;
      if (typeof evaled === 'undefined') {
        output = 'undefined';
      } else {
        output = util.inspect(evaled).replace(config.discordToken, '<TOKEN HAS BEEN HIDDEN>');
      }
      await message.reply({
        embeds: [ getEvalEmbed(tm, output) ],
      });
    } catch (err) {
      const errToSend = util.inspect(err);
      await message.reply(':x: Error!\n```\n' + errToSend.replace(config.discordToken, '<TOKEN HAS BEEN HIDDEN>') + '\n```');
    }
    return true;
  } else {
    return false;
  }
}

// https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
const embedDescriptionMaxChars = 4096;
const truncateLength = embedDescriptionMaxChars - '```\n\n```'.length;

function getEvalEmbed(title, output) {
  const embed = new EmbedBuilder().setTitle(title);
  if (output.length > truncateLength) {
    output = output.slice(0, truncateLength);
    embed.addFields([
      { name: 'Notice', value: `Output truncated to ${embedDescriptionMaxChars} characters.` },
    ]);
  }
  output = '```\n' + output + '\n```';
  embed.setDescription(output);
  return embed;
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