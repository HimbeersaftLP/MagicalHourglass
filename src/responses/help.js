import config from '../../config.js';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';

/**
 * Gets the help embed for the bot
 * @returns {MessagePayload}
 */
export function getHelp() {
  return {
    embeds: [new MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle('Help for MagicalHourglass:')
      .setDescription('Invite this bot to your server: https://discordapp.com/oauth2/authorize?client_id=305631536852631552&scope=bot&permissions=1144384577\nCommands:')
      .setThumbnail('https://himbeer.me/images/logo-monochrome.png')
      .addField(`${config.prefix}randomsofe`, 'Generate a random SOFe avatar')
      .addField(`${config.prefix}makesofe`, `Usage: ${config.prefix}makesofe <hexcode> <hexcode for background> [rotation in degrees]\nExample: ${config.prefix}makesofe FFEE00 FFFFFF 90`)
      .addField(`${config.prefix}8ball`, `Uses 8ball.delegator.com  to ask the magic 8-Ball for a question\nExample: ${config.prefix}8ball Am I great?`)
      .addField(`${config.prefix}weather`, `Get the current weather of a specific cifm OpenWeatherMap\nUsage: ${config.prefix}weather <city>\nExample: ${config.prefix}weather London`)
      .addField(`${config.prefix}cat`, 'Get a random cat image from random.cat')
      .addField(`${config.prefix}fish`, 'Go fishing!')
      .addField(`${config.prefix}whoami`, 'Get information about yourself.')
      .addField(`${config.prefix}whois`, `Get information about another member.\nUsage: ${config.prefix}whois @mentionOfaUser\nExample: ${config.prefix}whois @HimbeersaftLP#8553`)
      .addField(`${config.prefix}googlepic`, `Search Google for images.\nUsage: ${config.prefix}googlepic <search term>\nExample: ${config.prefix}googlepic boxofdevs team`)
      .addField(`${config.prefix}poggit`, `Search for a plugin release on Poggit.\nUsage: ${config.prefix}poggit <plugin name>\nExample: ${config.prefix}poggit DevTools`)
      .addField(`${config.prefix}channels`, `Shows a list of channels of the provided type.\nUsage: ${config.prefix}channel <text|voice>`)
      .addField(`${config.prefix}chuck`, 'Get a random Chuck Norris fact from api.chucknorris.io.')
      .addField(`${config.prefix}issue or ${config.prefix}pr`, `Find an issue/pull request on GitHub.\nUsage: ${config.prefix}issue <repo> <number> (on PMMP Discord also ${config.prefix}issue <number> for the PMMP repo)\nExample: ${config.prefix}issue boxofdevs/commandshop 2`)
      .addField(`${config.prefix}poll`, `Make a poll using reactions!\nUsage: ${config.prefix}poll <title|choice1|choice2|choice3|...> [optional: time in seconds]\nExample: What do you prefer?|Potatoes|Trains|Turtles|Juice boxes`)
      .addField(`${config.prefix}info or ${config.prefix}status`, 'Display information and stats about this bot.')
      .addField(`${config.prefix}convert`, `Convert currencies (supports cryptocurrencys)\nUsage: ${config.prefix}convert <amount> <from> <to>\nExample: ${config.prefix}convert 2 btc usd`)
      .addField(`${config.prefix}mock`, `maKeS tHE TeXt loOK lIkE tHiS\nUsage: ${config.prefix}mock <text>\nExample: ${config.prefix}mock How can I make an Email address`)
      .addField(`${config.prefix}clap`, `Add 👏 some 👏 applause 👏 to 👏 your 👏 message.\nUsage: ${config.prefix}clap <text>\nExample: ${config.prefix}clap That is great`)
      .addField(`${config.prefix}xkcd`, `Gets the given or most recent comic from xkcd.com.\nUsage: ${config.prefix}xkcd <id>\nExample: ${config.prefix}xkcd 292\nWhen no ID is provided, the most recent one will be displayed.`)
      .addField(`${config.prefix}emote`, `Send an emote of the server you're on (useful for sending animated emotes without having Discord Nitro)\nUsage: ${config.prefix}emote <name>\nExample: ${config.prefix}emote turtle`)
      .addField(`${config.prefix}s`, `Find and replace text in the last message of the channel your're in.\nUsage: ${config.prefix}s <find>/<replace>\nExample: ${config.prefix}s tst/test`),
    ],
  };
}