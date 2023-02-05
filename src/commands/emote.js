import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Guild } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('emote')
    .setDescription('Send an emote of the server you\'re on (e.g. animated emotes when you don\'t have Nitro)')
    .setDMPermission(false)
    .addStringOption(o =>
      o.setName('name')
        .setDescription('Name of the custom emote')
        .setRequired(true)),
  usage: '<name>',
  example: 'my_cool_animated_emote',
}];

/**
 * Get a custom emote from a guild by name
 * @param {Guild} guild The guild to find the custom emote in
 * @param {*} emoteName The name of the custom emote
 * @returns {string}
 */
export function getCustomEmote(guild, emoteName) {
  const emote = guild.emojis.cache.find(emoji => emoji.name === emoteName);
  if (typeof emote === 'undefined') {
    return 'Error: Emote not found!';
  } else {
    return emote.toString();
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const name = interaction.options.getString('name');
  await interaction.reply(getCustomEmote(interaction.guild, name));
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
  if (!args[0]) {
    await replySingleCommandHelp(message, 'emote');
  } else {
    if (!message.guild) {
      await message.reply('Error: This command can only be used inside a server!');
      return;
    }
    await message.reply(getCustomEmote(message.guild, args[0]));
  }
}