import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Guild } from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('channels')
    .setDescription('Shows a list of channels of the provided type')
    .setDMPermission(false)
    .addStringOption(o =>
      o.setName('type')
        .setDescription('Whether to show text or voice channels')
        .setRequired(true)
        .addChoices(
          { name: 'Text channels', value: 'text' },
          { name: 'Voice channels', value: 'voice' },
        )),
  usage: '<text|voice>',
}];

/**
 * Get the channels of a specific type of a guild
 * @param {Guild} guild The guild in question
 * @param {string} channelType The type of channel to get
 * @returns {Promise<string>}
 */
export async function getChannels(guild, channelType) {
  const channels = await guild.channels.fetch();
  const clist = channels.filter(c => {
    if (c.isTextBased() && channelType === 'text') return true;
    if (c.isVoiceBased() && channelType === 'voice') return true;
    return false;
  }).map(c => {
    if (c.isTextBased() && c.isVoiceBased() && channelType === 'text') {
      return c.name + ' (VC text channel)';
    }
    return c.name;
  }).join(', ');
  if (clist === '') {
    return 'No channels of this type were found';
  }
  return `**Channels of type ${channelType}:** ${clist}`;
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const type = interaction.options.getString('type');
  await interaction.reply(await getChannels(interaction.guild, type));
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
    await replySingleCommandHelp(message, 'channels');
  } else {
    if (!message.guild) {
      await message.reply('Error: This command can only be used inside a server!');
      return;
    }
    await message.reply(await getChannels(message.guild, args[0]));
  }
}