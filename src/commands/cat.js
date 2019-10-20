const request = require('request-promise');

module.exports = {
  name: 'cat',
  description: 'Get a random cat image',
  async execute(message, args) {
    request
      .get(`http://aws.random.cat/meow`)
      .then(body => {
        const json = JSON.parse(body);
        
        message.channel.send({
          files: [json.file],
        });
      })
      .catch(() => {
        message.reply('An error occured while accessing the random.cat API!');
      });
  },
};
