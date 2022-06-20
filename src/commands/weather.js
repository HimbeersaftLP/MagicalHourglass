import config from '../../config.js';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import fetch from 'node-fetch';

/**
 * Get the weather in the given location
 * @param {string} q Location
 * @returns {Promise<MessagePayload|string>}
 */
export async function getWeather(q) {
  try {
    const w = await (await fetch('http://api.openweathermap.org/data/2.5/weather?APPID=' + config.owmId + '&units=metric&q=' + q)).json();
    const fahrenheit = (w.main.temp * 9 / 5 + 32).toFixed(2);
    const mph = (w.wind.speed * 2.23693629205).toFixed(1);
    return {
      embeds: [new MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777215))
        .setTitle('Weather for ' + w.name + ', ' + w.sys.country + ':')
        .setDescription(w.weather[0].main)
        .setThumbnail('http://openweathermap.org/img/w/' + w.weather[0].icon + '.png')
        .addField('Weather description', w.weather[0].description)
        .addField('Temperature', w.main.temp + ' °C / ' + fahrenheit + ' °F')
        .addField('Wind speed', w.wind.speed + ' meter/sec / ' + mph + ' mph')
        .addField('Pressure', w.main.pressure + ' hPa')
        .addField('Humidity', w.main.humidity + ' %')
        .addField('Cloudiness', w.clouds.all + ' %')
        .setFooter({
          text: 'Data from OpenWeatherMap',
          iconURL: 'https://upload.wikimedia.org/wikipedia/commons/1/15/OpenWeatherMap_logo.png',
        }),
      ],
    };
  } catch (e) {
    console.error(e);
    return 'City not found or an error occured while accessing the OpenWatherMap API!';
  }
}