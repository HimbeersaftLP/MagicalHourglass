const Discord = require('discord.js');
const request = require('request-promise');
const config = require('../../config.json');

module.exports = {
  name: 'weather',
  description: 'Get the weather of a specific city',
  usage: '<city>',
  examples: ['London'],
  async execute(message, args) {
    if (!args[0]) {
      return;
    }

    request
      .get(`http://api.openweathermap.org/data/2.5/weather?APPID=${config.owmid}&units=metric&q=${args.join(' ')}`)
      .then(body => {
        const json = JSON.parse(body);
        const fahrenheit = ((json.main.temp * 9) / 5 + 32).toFixed(2);
        const mph = (json.wind.speed * 2.23693629205).toFixed(1);

        const embed = new Discord.RichEmbed()
          .setColor(Math.floor(Math.random() * 16777215))
          .setTitle(`Weather for ${json.name}, ${json.sys.country}:`)
          .setDescription(json.weather[0].main)
          .setThumbnail(`https://openweathermap.org/img/w/${json.weather[0].icon}.png`)
          .addField('Weather description', json.weather[0].description)
          .addField('Temperature', `${json.main.temp} °C / ${fahrenheit} °F`)
          .addField('Wind speed', `${json.wind.speed} meter/sec / ${mph} mph`)
          .addField('Pressure', `${json.main.pressure} hPa`)
          .addField('Humidity', `${json.main.humidity}%`)
          .addField('Cloudiness', `${json.clouds.all}%`)
          .setFooter(
            'Data from OpenWeatherMap',
            'https://upload.wikimedia.org/wikipedia/commons/1/15/OpenWeatherMap_logo.png'
          );

        message.channel.send({ embed });
      })
      .catch(err => {
        if (err.statusCode == 404) {
          message.reply('City not found');
        } else {
          message.reply('An error occured while accessing the OpenWeatherMap API!');
        }
      });
  },
};
