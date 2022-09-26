import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  EmbedBuilder,
  MessagePayload,
} from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('makesofe')
    .setDescription('Generate a SOFe avatar with the specified properties')
    .addStringOption(o =>
      o.setName('foreground')
        .setDescription('Hexadecimal colour code for the foreground')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('background')
        .setDescription('Hexadecimal colour code for the background')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('rotation')
        .setDescription('Rotation in degrees')
        .setRequired(false)),
  usage: '<hexcode> <hexcode for background> [rotation in degrees]',
  example: 'FFEE00 FFFFFF 90',
},
{
  builder: new SlashCommandBuilder()
    .setName('randomsofe')
    .setDescription('Generate a random SOFe avatar'),
},
];

/**
 * Get a random rotation value in degrees
 * @returns {Number}
 */
export function getRandomRotation() {
  return Math.floor(Math.random() * 4) * 90;
}

/**
 * Get a random hex color as string
 * @returns {string}
 */
export function getRandomHexColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Prepare a hexadecimal color code for SOFe API consumption by removing trailing #
 * @param {string} color Hexadecimal color code
 */
function prepareHexColor(color) {
  // TODO: Accept three digit colors, properly validate and accept CSS colors
  if (color.startsWith('#')) {
    return color.substring(1);
  }
  return color;
}

/**
 * Get an embed containing a SOFe avatar with the given parameters
 * @param {string} fgHex HEX color for foreground
 * @param {string} bgHex HEX color for background
 * @param {number} rotation Rotation in degrees
 * @returns {MessagePayload}
 */
export function getSofeEmbed(fgHex, bgHex, rotation = 0) {
  fgHex = prepareHexColor(fgHex);
  bgHex = prepareHexColor(bgHex);
  const sofeUrl = 'https://himbeer.me/sofeavatars/sofeavatar.php?hex=' + fgHex + '&bghex=' + bgHex + '&rot=' + rotation;
  return {
    embeds: [new EmbedBuilder()
      .setColor(parseInt(fgHex, 16))
      .setTitle('Your SOFe avatar has been generated!')
      .setDescription('Link: ' + sofeUrl)
      .setThumbnail(sofeUrl),
    ],
  };
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  let fgHex;
  let bgHex;
  let rotation;

  if (interaction.commandName === 'makesofe') {
    fgHex = interaction.options.getString('foreground');
    bgHex = interaction.options.getString('background');
    rotation = interaction.options.getInteger('rotation', false);
  } else {
    fgHex = getRandomHexColor();
    bgHex = getRandomHexColor();
    rotation = getRandomRotation();
  }

  await interaction.reply(getSofeEmbed(fgHex, bgHex, rotation));
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
  let fgHex;
  let bgHex;
  let rotation;

  if (cmd === 'makesofe') {
    if (!(args[0] && args[1])) {
      await replySingleCommandHelp(message, 'makesofe');
      return;
    }
    fgHex = args[0];
    bgHex = args[1];
    rotation = args[2] || 0;
  } else {
    fgHex = getRandomHexColor();
    bgHex = getRandomHexColor();
    rotation = getRandomRotation();
  }
  await message.reply(getSofeEmbed(fgHex, bgHex, rotation));
}