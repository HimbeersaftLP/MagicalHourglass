import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import {
  MessagePayload,
} from 'discord.js';
import {
  embed,
} from '../extras.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('Convert currencies (also supports 🤢crypto🤢)')
    .addNumberOption(o =>
      o.setName('amount')
        .setDescription('Amount of origin currency')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('from')
        .setDescription('Currency to convert from')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('to')
        .setDescription('Currency to convert to')
        .setRequired(true)),
  usage: '<amount> <from> <to>',
  example: '2 eur usd',
}];

/**
 * Get a message containing a currency conversion
 * @param {number} amount The amount of money
 * @param {string} from The currency to convert from
 * @param {string} to The currency to convert to
 * @returns {Promise<MessagePayload|string>}
 */
export async function getConversion(amount, from, to) {
  try {
    const con = await (await fetch('https://api.cryptonator.com/api/ticker/' + encodeURIComponent(from) + '-' + encodeURIComponent(to))).json();
    if (con.success === false) {
      return 'Error: ' + con.error;
    } else {
      const conv = amount * con.ticker.price;
      const convResText = 'Converted from: ' + from.toUpperCase() + '\nConversion result: ' + (Math.round(conv * 10000) / 10000) + ' ' + to.toUpperCase();
      return {
        embeds: [embed('Conversion result:', convResText, 'http://i.imgur.com/qbeZJNk.png')
          .setFooter({
            text: 'api.cryptonator.com',
            iconURL: 'http://i.imgur.com/qbeZJNk.png',
          })
          .setURL('https://www.cryptonator.com/'),
        ],
      };
    }
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the Cryptonator API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const amount = interaction.options.getNumber('amount');
  const from = interaction.options.getString('from');
  const to = interaction.options.getString('to');
  await interaction.reply(await getConversion(amount, from, to));
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
  if (!args[2] | isNaN(args[0])) {
    await replySingleCommandHelp(message, 'convert');
  } else {
    await message.reply(await getConversion(args[0], args[1], args[2]));
  }
}