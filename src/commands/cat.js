import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  EmbedBuilder,
  MessagePayload,
} from 'discord.js';
import fetch from 'node-fetch';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat image from random.cat'),
}];

/**
 * Get a message with a random cat picture from random.cat
 * @returns {Promise<MessagePayload|string>}
 */
export async function getRandomCat() {
  try {
    const c = await (await fetch('http://aws.random.cat/meow')).json();
    return {
      embeds: [new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 16777215))
        .setTitle('Here\'s your random cat:')
        .setDescription('Link: [Click Here](' + c.file + ')')
        .setImage(c.file)
        .setFooter({
          text: 'Randomly generated cat link by random.cat',
        }),
      ],
    };
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the random.cat API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  await interaction.reply(await getRandomCat());
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
  await message.reply(await getRandomCat());
}