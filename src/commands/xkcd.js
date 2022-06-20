import fetch from 'node-fetch';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';

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
  } catch (e) {
    console.error(e);
    return 'An error occured while accessing the xkcd API!';
  }
}