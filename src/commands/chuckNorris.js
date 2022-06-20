import fetch from 'node-fetch';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';

/**
 * Get a message containing a chuck norris fact
 * @returns {Promise<MessagePayload|string>}
 */
export async function getChuckNorrisFact() {
  try {
    const cn = await (await fetch('https://api.chucknorris.io/jokes/random')).json();
    return {
      embeds: [new MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777215))
        .setTitle('Your Chuck Norris fact, fresh from chucknorris.io:')
        .setDescription(cn.value.replace(/`/g, '\''))
        .setThumbnail(cn.icon_url)
        .setURL(cn.url)
        .setFooter({
          text: 'Fact from api.chucknorris.io',
          iconURL: 'https://api.chucknorris.io/img/favicon.ico',
        }),
      ],
    };
  } catch (e) {
    console.error(e);
    return 'You can\'t access the Chuck Norris API, the Chuck Norris API accesses you!';
  }
}