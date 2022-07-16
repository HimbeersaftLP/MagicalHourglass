import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../../config.js';
import fetch from 'node-fetch';
import { MessageEmbed, MessagePayload } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('googlepic')
    .setDescription('Search Google for images')
    .addStringOption(o =>
      o.setName('search_term')
        .setDescription('What to search for')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('result_index')
        .setDescription('Choose which result to display')
        .setRequired(false)),
  usage: '<search term>',
  example: 'cute cats',
}];

/**
 * Search for pictures on google
 * @param {string} q Search query
 * @param {number} r Image result index
 * @returns {Promise<MessagePayload>}
 */
export async function getGooglePic(q, r = 1) {
  const url = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(q) + '&cx=' + config.googleCseId +
              '&searchType=image&fields=items(image%2FcontextLink%2Clink%2Ctitle)%2CsearchInformation&safe=medium&key=' + config.googleKey;
  try {
    const g = await (await fetch(url)).json();
    let ri = Math.floor(Number(r));
    if (ri <= 0 || ri > g.items.length) {
      ri = 0;
      return 'This result index is invalid!';
    } else {
      ri = ri - 1;
    }
    const gres = new MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle('#' + (ri + 1).toString() + ' Result: ' + g.items[ri].title)
      .setDescription('Image URL: ' + g.items[ri].link + '\nImage from: ' + g.items[ri].image.contextLink + '\n\nResult ' + (ri + 1).toString() + ' of ' + g.items.length.toString() + ' loaded results.\nUse `/googlepic <search term> <number>` or `,googlepic <search term> -r <number>` to see the other results.')
      .setImage(g.items[ri].link);
    return {
      content: g.searchInformation.formattedTotalResults + ' results in ' + g.searchInformation.formattedSearchTime + ' seconds:',
      embeds: [gres],
    };
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the Google Custom Search API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const search_term = interaction.options.getString('search_term');
  const result_index = interaction.options.getInteger('result_index', false) || 1;
  await interaction.reply(await getGooglePic(search_term, result_index));
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
    await replySingleCommandHelp(message, 'googlepic');
  } else {
    message.channel.sendTyping();
    const oargs = JSON.parse(JSON.stringify(args));
    let ri;
    if (args[args.length - 2] === '-r' && !isNaN(args[args.length - 1])) {
      args.splice(args.length - 2, 2);
      ri = oargs[oargs.length - 1];
    } else {
      ri = 1;
    }
    await message.reply(await getGooglePic(args.join(' '), ri));
  }
}