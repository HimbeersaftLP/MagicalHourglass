const request = require('request-promise');
const utils = require('../utils');

module.exports = {
  name: 't',
  description: 'Talk with Program-O...',
  usage: '<message>',
  examples: ['How are you?'],
  async execute(message, args) {
    message.channel.startTyping();

    request
      .get(`https://program-o.com/v3/chat.php?bot_id=6&format=json&say=${encodeURIComponent(args.join(' '))}&convo_id=${utils.generateSessionId(message)}`)
      .then(body => {
        const json = JSON.parse(body);
        
        message.reply(json.conversation.say.bot);
      })
      .catch(() => {
        message.reply('An error occured while accessing the Program-O API!');
      })
      .finally(() => {
        message.channel.stopTyping();
      })
  },
};
