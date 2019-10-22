const config = require('../../config.json');

module.exports = {
  name: 'fish',
  description: 'Go fishing!',
  execute(message, args) {
    const fish = [
      {
        emoji: '🐠',
        name: 'tropical fish',
      },
      {
        emoji: '🐟',
        name: 'fish',
      },
      {
        emoji: '🐡',
        name: 'blowfish',
      },
      {
        emoji: '🐬',
        name: 'dolphin',
      },
      {
        emoji: '🐳',
        name: 'spouting whale',
      },
      {
        emoji: '🐋',
        name: 'whale',
      },
    ];
    const caughtFish = fish[Math.floor(Math.random() * fish.length)];
    message.reply(`You caught a **${caughtFish.name}**!`);
    message.channel.send(caughtFish.emoji);
  },
};
