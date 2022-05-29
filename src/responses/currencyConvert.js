import fetch from 'node-fetch';
import {
  MessagePayload,
} from 'discord.js';
import {
  embed,
} from '../extras.js';

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
  } catch (e) {
    console.error(e);
    return 'An error occured while accessing the Cryptonator API!';
  }
}