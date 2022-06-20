import { TextChannel } from 'discord.js';

/**
 * Get the content of the previous message in a channel with text replaced in it
 * @param {TextChannel} channel Channel to get the previous message from
 * @param {string} find Find this string
 * @param {string} replace Replace with this string
 */
export async function getSubstitute(channel, find, replace) {
  const messages = await channel.messages.fetch({ limit: 2 });
  const m = messages.last();
  return m.content.replace(find, replace);
}