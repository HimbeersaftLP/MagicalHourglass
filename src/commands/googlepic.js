import config from '../../config.js';
import fetch from 'node-fetch';
import { MessageEmbed, MessagePayload } from 'discord.js';

/**
 * Search for pictures on google
 * @param {string} q Search query
 * @param {number} r Image index
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
      .setDescription('Image URL: ' + g.items[ri].link + '\nImage from: ' + g.items[ri].image.contextLink + '\n\nResult ' + (ri + 1).toString() + ' of ' + g.items.length.toString() + ' loaded results.\n,googlepic <search term> -r <number> to see the other results.')
      .setImage(g.items[ri].link);
    return {
      content: g.searchInformation.formattedTotalResults + ' results in ' + g.searchInformation.formattedSearchTime + ' seconds:',
      embeds: [gres],
    };
  } catch (e) {
    console.error(e);
    return 'An error occured while accessing the Google Custom Search API!';
  }
}