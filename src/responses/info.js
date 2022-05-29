import {
  Client,
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import {
  SubFields,
} from '../extras.js';

/**
 * Get embed with bot info
 * @param {Client} client Discord.JS Client object
 * @returns {MessagePayload}
 */
export function getInfo(client) {
  let seconds = process.uptime();
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hrs = Math.floor(seconds / 3600);
  seconds %= 3600;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const uptime = days + ' Days, ' + hrs + ' Hours, ' + mins + ' Minutes and ' + Math.round(secs) + ' Seconds';
  const stats = new SubFields()
    .addField('Servers', client.guilds.cache.size)
    .addField('Channels', client.channels.cache.size)
    .addField('Cached Users', client.users.cache.size)
    .addField('Uptime', uptime)
    .addField('RAM Usage', Math.round(process.memoryUsage().rss / 10485.76) / 100 + ' MB')
    .toString();
  return {
    embeds: [new MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle('MagicalHourglass Information:')
      .setDescription('MagicalHourglass is an open source Discord bot written in Node.js and originally made for the BoxOfDevs Discord Server.')
      .setThumbnail('https://himbeer.me/images/logo-monochrome.png')
      .addField('GitHub:', 'https://github.com/HimbeersaftLP/MagicalHourglass')
      .addField('Author:', 'HimbeersaftLP#8553')
      .addField('Invite:', '[Click Here](https://discordapp.com/oauth2/authorize?client_id=305631536852631552&scope=bot&permissions=1144384577)')
      .addField('Stats:', stats),
    ],
  };
}