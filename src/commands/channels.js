import { Guild } from 'discord.js';

/**
 * Get the channels of a specific type of a guild
 * @param {Guild} guild The guild in question
 * @param {*} channelType The type of channel to get
 * @returns {string}
 */
export async function getChannels(guild, channelType) {
  const channels = await guild.channels.fetch();
  const clist = channels.filter(c => {
    if (c.isText() && channelType === 'text') return true;
    if (c.isVoice() && channelType === 'voice') return true;
    return false;
  }).map(c => {
    return c.name;
  }).join(', ');
  if (clist === '') {
    return 'No channels of this type were found';
  }
  return clist;
}