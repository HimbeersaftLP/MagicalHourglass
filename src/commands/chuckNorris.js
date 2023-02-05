import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import {
  EmbedBuilder,
  MessagePayload,
} from 'discord.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('chuck')
    .setDescription('Get a random Chuck Norris fact from api.chucknorris.io'),
}];

/**
 * Get a message containing a chuck norris fact
 * @returns {Promise<MessagePayload|string>}
 */
export async function getChuckNorrisFact() {
  try {
    const cn = await (await fetch('https://api.chucknorris.io/jokes/random')).json();
    return {
      embeds: [new EmbedBuilder()
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
  } catch (err) {
    console.error(err);
    return 'You can\'t access the Chuck Norris API, the Chuck Norris API accesses you!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  await interaction.reply(await getChuckNorrisFact());
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
  await message.reply(await getChuckNorrisFact());
}