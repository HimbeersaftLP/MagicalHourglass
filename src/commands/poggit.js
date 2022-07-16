import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import {
  UnrealEmbed,
} from '../extras.js';
import fetch from 'node-fetch';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('poggit')
    .setDescription('Search for a plugin release on Poggit')
    .addStringOption(o =>
      o.setName('plugin_name')
        .setDescription('Name of the plugin to get info about')
        .setRequired(true)),
  usage: '<plugin name>',
  example: 'DevTools',
}];

/**
 * Get an embed with info about a plugin on Poggit
 * @param {string} plugin Poggit plugin name
 * @returns {Promise<MessagePayload|string>}
 */
export async function getPoggitPlugin(plugin) {
  try {
    const body = await (await fetch('https://poggit.pmmp.io/releases.json?name=' + plugin)).text();
    if (body === '[]') {
      return 'Error: Plugin not found!';
    } else {
      const pl = JSON.parse(body)[0];
      const uemb = new UnrealEmbed()
        .setDescription(pl.tagline)
        .addField('Version', pl.version)
        .addField('Downloads', pl.downloads)
        .addField('Build', pl.build_number)
        .addField('Github', 'https://github.com/' + pl.repo_name)
        .addField('Download', pl.artifact_url + '/' + pl.name + '.phar');
      if (pl.api.length > 0) uemb.addField('For APIs', pl.api[0].from + ' - ' + pl.api[0].to);
      uemb.addField('License', pl.license);
      return {
        embeds: [new MessageEmbed()
          .setColor(Math.floor(Math.random() * 16777215))
          .setTitle(pl.name + ' (' + pl.state_name + '):')
          .setDescription(uemb.toString())
          .setThumbnail(pl.icon_url)
          .setTimestamp(new Date(pl.submission_date * 1000))
          .setURL(pl.html_url)
          .setFooter({
            text: 'Data from poggit.pmmp.io',
            iconURL: 'https://avatars7.githubusercontent.com/u/22367352?v=4&s=50',
          }),
        ],
      };
    }
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the Poggit API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const plugin_name = interaction.options.getString('plugin_name');
  await interaction.reply(await getPoggitPlugin(plugin_name));
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
    await replySingleCommandHelp(message, 'poggit');
  } else {
    message.channel.sendTyping();
    await message.reply(await getPoggitPlugin(args[0]));
  }
}