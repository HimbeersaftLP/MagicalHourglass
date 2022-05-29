import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import {
  UnrealEmbed,
} from '../extras.js';
import fetch from 'node-fetch';

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
  } catch (e) {
    console.error(e);
    return 'An error occured while accessing the Poggit API!';
  }
}