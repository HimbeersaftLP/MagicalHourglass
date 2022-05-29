import { User } from 'discord.js';

/**
 * Get a message where the content has its spaces replaces with clap emojis
 * @param {User} author Author of the message
 * @param {string} messageContent Content of the message
 * @returns {string}
 */
export function getClapped(author, messageContent) {
  return author.toString() + ': ' + messageContent.split(' ').join(' 👏 ');
}