const config = require('../../config.json');

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-Ball a question',
  usage: '<question>',
  examples: ['Am I great?'],
  execute(message, args) {
    if (!args[0]) {
      return;
    }

    const response = Math.floor(Math.random() * config.eightball.length);
    message.reply(config.eightball[response]);
  },
};
