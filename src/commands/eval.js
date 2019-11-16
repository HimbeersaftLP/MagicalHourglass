const util = require('util');

const config = require('../../config.json');
const utils = require('../utils');

module.exports = {
  name: 'eval',
  description: 'Evaluate JavaScript code',
  usage: '<code>',
  examples: ['console.log(\'Hello, world!\');'],
  ownerOnly: true,
  async execute(message, args) {
    if (message.author.id !== config.ownerid) {
      return message.reply('You ain\'t doing that!');
    }

    const client = message.client; 

    try {
      const execStart = process.hrtime();
      const evaled = eval(args.join(' '));
      const execEnd = process.hrtime(execStart);

      const time = `*Executed in ${(execEnd[0] * 1000 + execEnd[1] / 1000000)}ms*\n`

      if (typeof evaled === 'object') {
        message.channel.send(await utils.sendLong(time + '```\n' + utils.hideToken(util.inspect(evaled)) + '\n```'))
      } else if (typeof evaled === 'undefined') {
        message.channel.send(time + '```\n' + typeof undefined + '\n```');
      } else if (evaled === null) {
        message.channel.send(time + '```\n' + null + '\n```');
      } else {
        message.channel.send(await utils.sendLong(time + '```\n' + utils.hideToken(evaled.toString()) + '\n```'))
      }
    } catch (err) {
      if (typeof err === 'object') {
        err = util.inspect(err)
      }

      message.channel.send(await utils.sendLong(':x: Error\n```\n' + utils.hideToken(err) + '\n```'))
   }
  },
};
