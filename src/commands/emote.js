import { Guild } from 'discord.js';

/**
 * Get a custom emote from a guild by name
 * @param {Guild} guild The guild to find the custom emote in
 * @param {*} emoteName The name of the custom emote
 * @returns {string}
 */
export function getCustomEmote(guild, emoteName) {
  const emote = guild.emojis.cache.find(emoji => emoji.name === emoteName);
  if (typeof emote === 'undefined') {
    return 'Error: Emote not found!';
  } else {
    return emote.toString();
  }
}