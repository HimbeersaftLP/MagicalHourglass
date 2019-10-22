const request = require('request-promise');
const utils = require('../utils');
const extras = require('../extras');

module.exports = {
  name: 'whois',
  description: 'Get information about another member',
  usage: '<member>',
  examples: ['<@139733914523664384>'],
  async execute(message, args) {
    const member = message.mentions.members.first();

    if (!member) {
      message.reply('Member not found!');
      return;
    }

    const user = member.user;
    const roles = message.member.roles.map(role => role.name).join(', ');

    const unrealEmbed = new extras.UnrealEmbed()
      .addField('Username', user.username)
      .addField('ID', user.id)
      .addField('Tag', user.tag)
      .addField('Avatar URL', user.displayAvatarURL)
      .addField('Created At', user.createdAt)
      .addField('Bot', user.bot)
      .addField('Roles', roles)
      .addField('Status', user.presence.status);

    if (user.presence.game) {
      unrealEmbed.addField('Game', user.presence.game.name);
    }

    const embed = extras.embed(user.username, unrealEmbed.toString(), user.displayAvatarURL);

    message.channel.send({ embed });
  },
};
