import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';

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
 * Get an embed containing a SOFe avatar with the given parameters
 * @param {string} hex HEX color for foreground
 * @param {string} bghex HEX color for background
 * @param {number} rot Rotation in degrees
 * @returns {MessagePayload}
 */
export function getSofeEmbed(hex, bghex, rot = 0) {
  const sofeUrl = 'https://himbeer.me/sofeavatars/sofeavatar.php?hex=' + hex + '&bghex=' + bghex + '&rot=' + rot;
  return {
    embeds: [new MessageEmbed()
      .setColor(parseInt(hex, 16))
      .setTitle('Your SOFe avatar has been generated!')
      .setDescription('Link: ' + sofeUrl)
      .setThumbnail(sofeUrl),
    ],
  };
}