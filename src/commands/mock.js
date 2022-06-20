import { User } from 'discord.js';

/**
 * Get a message where the content is randomly capitalised
 * @param {User} author Author of the message
 * @param {string} messageContent Content of the message
 * @returns {string}
 */
export function getMocked(author, messageContent) {
  let mocked = '';
  for (let i = 0; i < messageContent.length; i++) {
    mocked += (Math.random() >= 0.5) ? messageContent[i].toUpperCase() : messageContent[i].toLowerCase();
  }
  return author.toString() + ': ' + mocked;
}