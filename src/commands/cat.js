import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import fetch from 'node-fetch';

/**
 * Get a message with a random cat picture from random.cat
 * @returns {Promise<MessagePayload|string>}
 */
export async function getRandomCat() {
  try {
    const c = await (await fetch('http://aws.random.cat/meow')).json();
    return {
      embeds: [new MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777215))
        .setTitle('Here\'s your random cat:')
        .setDescription('Link: [Click Here](' + c.file + ')')
        .setImage(c.file)
        .setFooter({
          text: 'Randomly generated cat link by random.cat',
        }),
      ],
    };
  } catch (e) {
    console.error(e);
    return 'An error occured while accessing the random.cat API!';
  }
}