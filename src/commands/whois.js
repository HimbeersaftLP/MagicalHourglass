import { CommandInteraction, Message, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  GuildMember,
  MessagePayload,
} from 'discord.js';
import {
  UnrealEmbed,
  embed,
} from '../extras.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Get information about another member')
    .setDMPermission(false)
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to get information about')
        .setRequired(true)),
  usage: '@mentionOfaUser',
  example: '@Himbeer#8553',
},
{
  builder: new SlashCommandBuilder()
    .setName('whoami')
    .setDescription('Get information about yourself.'),
},
];

/**
 * Get a whois embed for a user
 * @param {User} user The user to generate the embed for
 * @param {GuildMember?} member The GuildMember object of said user
 * @returns {MessagePayload}
 */
export function getWhoisEmbed(user, member = null) {
  const uemb = new UnrealEmbed()
    .addField('Username', user.username)
    .addField('ID', user.id)
    .addField('Discord Tag', user.tag)
    .addField('Avatar URL', user.displayAvatarURL())
    .addField('Is Bot?', user.bot)
    .addField('Created at', user.createdAt);
  if (member) {
    const rls = member.roles.cache.map((r) => r.name).join(', ');
    uemb.addField('Joined server at', member.joinedAt)
      .addField('Roles', rls);
  }
  return {
    embeds: [embed('Information about the user ' + user.username + ':', uemb.toString(), user.displayAvatarURL())],
  };
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  let user, member;
  if (interaction.commandName === 'whois') {
    member = interaction.options.getMember('user');
    user = member.user;
  } else {
    user = interaction.user;
    member = interaction.member;
  }

  await interaction.reply(getWhoisEmbed(user, member));
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
  let user, member;
  if (cmd === 'whois') {
    if (!message.guild) {
      await message.reply('Error: This command can only be used inside a server!');
      return;
    }
    member = message.mentions.members.first();
    if (typeof member === 'undefined') {
      await replySingleCommandHelp(message, 'whois', 'Member not found!');
      return;
    }
    user = member.user;
  } else {
    user = message.author;
    member = message.member;
  }

  await message.reply(getWhoisEmbed(user, member));
}