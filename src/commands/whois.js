import {
  GuildMember,
  MessagePayload,
} from 'discord.js';
import {
  UnrealEmbed,
  embed,
} from '../extras.js';

/**
 * Get a whois embed for a user
 * @param {GuildMember} member The member to generate the embed for
 * @returns {MessagePayload}
 */
export function getWhoisEmbed(member) {
  const m = member.user;
  const rls = member.roles.cache.map((r) => r.name).join(', ');
  const uemb = new UnrealEmbed()
    .addField('Username', m.username)
    .addField('ID', m.id)
    .addField('Discord Tag', m.tag)
    .addField('Avatar URL', m.displayAvatarURL())
    .addField('Created at', m.createdAt)
    .addField('Joined server at', member.joinedAt)
    .addField('Bot?', m.bot)
    .addField('Roles', rls);
  return {
    embeds: [embed('Information about the user ' + m.username + ':', uemb.toString(), m.displayAvatarURL())],
  };
}