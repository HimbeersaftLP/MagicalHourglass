import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import {
  Message,
  EmbedBuilder,
  MessagePayload,
} from 'discord.js';

import { getAllCommandInfos } from '../commandManager.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display the bot\'s help message'),
  doNotRegister: true,
}];

let helpEmbed = null;
const singleCommandHelps = {};

/**
 * Generate the help embed (only needs to run once)
 * @returns {Promise}
 */
export async function generateHelpEmbed() {
  helpEmbed = new EmbedBuilder()
    .setColor(Math.floor(Math.random() * 16777215))
    .setTitle('Help for MagicalHourglass:')
    .setDescription('Invite this bot to your server: https://discordapp.com/oauth2/authorize?client_id=305631536852631552&scope=bot&permissions=1144384577\nCommands:')
    .setThumbnail('https://himbeer.me/images/logo-monochrome.png');

  const commands = await getAllCommandInfos();
  commands.forEach(cmd => {
    if (cmd.doNotRegister) return;

    let fieldName = `${config.prefix}${cmd.builder.name}`;
    cmd.aliases?.forEach(alias => {
      fieldName += ` or ${config.prefix}${alias}`;
    });
    const fieldValues = [];
    if (cmd.builder.description) fieldValues.push(cmd.builder.description);
    if (cmd.usage) fieldValues.push(`Usage: ${config.prefix}${cmd.builder.name} ${cmd.usage}`);
    if (cmd.example) fieldValues.push(`Example: ${config.prefix}${cmd.builder.name} ${cmd.example}`);
    const fieldValue = fieldValues.join('\n');

    helpEmbed.addFields([{
      name: fieldName,
      value: fieldValue,
    }]);

    const embed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setDescription('Command help:')
      .addFields([{
        name: fieldName,
        value: fieldValue,
      }]);

    singleCommandHelps[cmd.builder.name] = embed;
    cmd.aliases?.forEach(alias => {
      singleCommandHelps[alias] = embed;
    });
  });
}

/**
 * Get the command help embed for one command
 * @param {string} commandName Which command to get help for
 * @returns {EmbedBuilder|null}
 */
export function getSingleCommandHelp(commandName) {
  return singleCommandHelps[commandName] || null;
}

/**
 * Reply to a message with help for a specific command (i.e. when it is used wrongly)
 * @param {Message} messageToReplyTo Message that should be replied to
 * @param {string} commandName Which command to get help for
 * @param {string} additionalText Optional text of the reply
 * @returns {Promise}
 */
export async function replySingleCommandHelp(messageToReplyTo, commandName, additionalText = null) {
  const commandHelpEmbed = getSingleCommandHelp(commandName);
  if (additionalText === null) additionalText = `Error: Invalid or missing arguments used for ${config.prefix}${commandName}`;
  commandHelpEmbed.setTitle(additionalText);
  await messageToReplyTo.reply({
    embeds: [commandHelpEmbed],
  });
}

/**
 * Gets the help embed for the bot
 * @returns {MessagePayload}
 */
export function getHelp() {
  return {
    embeds: [helpEmbed],
  };
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
    await message.author.send(getHelp());
    await message.reply('Sent you a DM!');
  } else if (getSingleCommandHelp(args[0]) === null) {
    await message.reply('Error: Command not found!');
  } else {
    await replySingleCommandHelp(message, args[0], `Help for ${config.prefix}${args[0]}`);
  }
}