import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../config.js';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import fetch from 'node-fetch';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get the current weather in a specific place from OpenWeatherMap')
    .addStringOption(o =>
      o.setName('place')
        .setDescription('Name of a city or place on earth')
        .setRequired(true)),
  usage: '<city>',
  example: 'London',
}];

/**
 * Get the weather in the given location
 * @param {string} q Location
 * @returns {Promise<MessagePayload|string>}
 */
export async function getWeather(q) {
  try {
    const w = await (await fetch('http://api.openweathermap.org/data/2.5/weather?APPID=' + config.owmId + '&units=metric&q=' + q)).json();
    if (w.cod === '404') {
      return 'Place not found!';
    }
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
  } catch (err) {
    console.error(err);
    return 'An error occured while accessing the OpenWatherMap API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const place = interaction.options.getString('place');
  await interaction.reply(await getWeather(place));
}

/**
 * Execute this command from a message (legacy style)
 * @param {Message} message The message that caused command execution
 * @param {string} cmd Command name
 * @param {string[]} args Command arguments
 * @returns {Promise}
 */
// eslint-disable-next-line no-unused-vars
export async function executeFromMessage(message, cmd, args) {
  if (!args[0]) {
    await replySingleCommandHelp(message, 'weather');
    return;
  }
  await message.reply(await getWeather(args[0]));
}