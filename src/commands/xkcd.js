import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Gets the given or most recent comic from xkcd.com')
    .addIntegerOption(o =>
      o.setName('id')
        .setDescription('ID of an xkcd.com comic')
        .setRequired(false)),
  usage: '[id]',
  example: '292\nWhen no ID is provided, the most recent one will be displayed.',
}];

/**
 * Get a message with the given xkcd comic or the latest one if no number is given
 * @param {number?} number Number of the xkcd or null for the latest
 * @returns {Promise<MessagePayload|string>}
 */
export async function getXkcd(number) {
  const xkcdurl = (number === null) ? '' : ('/' + encodeURIComponent(number));
  try {
    const res = await fetch('https://xkcd.com' + xkcdurl + '/info.0.json');
    if (res.status === 404) {
      return `XKCD comic number ${number} was not found!`;
    }
    const xkcd = await res.json();
    return {
      embeds: [new MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777215))
        .setTitle(xkcd.num + ': ' + xkcd.safe_title)
        .setDescription('Hover text: ' + xkcd.alt)
        .setImage(xkcd.img)
        .setURL('https://xkcd.com/' + xkcd.num)
        .setTimestamp(new Date(xkcd.year, xkcd.month, xkcd.day))
        .setFooter({
          text: 'xkcd',
          iconURL: 'https://i.imgur.com/kvScABp.png',
        }),
      ],
    };
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the xkcd API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const id = interaction.options.getInteger('id', false);
  await interaction.reply(await getXkcd(id));
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
  if (isNaN(args[0]) && typeof args[0] !== 'undefined') {
    await replySingleCommandHelp(message, 'xkcd');
  } else {
    await message.reply(await getXkcd(args[0] || null));
  }
}