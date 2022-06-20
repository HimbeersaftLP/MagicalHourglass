import config from '../config.js';

import Discord from 'discord.js';
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

import { doEval } from './responses/eval.js';
import { doReboot } from './responses/reboot.js';
import { doStartPoll } from './responses/poll.js';
import { get8BallResponse } from './responses/eightBall.js';
import { getChannels } from './responses/channels.js';
import { getChuckNorrisFact } from './responses/chuckNorris.js';
import { getClapped } from './responses/clap.js';
import { getConversion } from './responses/currencyConvert.js';
import { getCustomEmote } from './responses/emote.js';
import { getFish } from './responses/fish.js';
import { getGitHubLinePreview } from './responses/github.js';
import { getGitIssue } from './responses/gitIssue.js';
import { getGooglePic } from './responses/googlepic.js';
import { getHelp } from './responses/help.js';
import { getInfo } from './responses/info.js';
import { getMocked } from './responses/mock.js';
import { getPoggitPlugin } from './responses/poggit.js';
import { getRandomCat } from './responses/cat.js';
import { getRandomHexColor, getRandomRotation, getSofeEmbed } from './responses/sofe.js';
import { getSubstitute } from './responses/substitute.js';
import { getWeather } from './responses/weather.js';
import { getWhoisEmbed } from './responses/whois.js';
import { getXkcd } from './responses/xkcd.js';

const githubregex = /http(?:s|):\/\/github\.com\/(.*?\/.*?\/)blob\/(.*?\/.*?)#L([0-9]+)-?L?([0-9]+)?/;

let firstrun = 1;

let readyspam = false;

client.on('ready', () => {
  client.user.setStatus('online');
  console.log('Everything connected!');
  client.user.setActivity(`-> ${config.prefix}help <-`);
  if (readyspam === false) {
    readyspam = true;
    setTimeout(function() {
      readyspam = false;
    }, 3000);
  } else {
    console.error('Stopping due to client-ready spam, please restart the bot!');
    process.exit(0);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (config.blockedusers.includes(message.author.id)) return;
  if (!message.guild) return;
  if (message.content.startsWith(config.prefix)) {

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    console.log(`> "${cmd}" by "${message.author.tag}" on "${message.guild.name}"`);

    switch (cmd) {
      case 'randomsofe':
        const sofehex = getRandomHexColor();
        const sofebghex = getRandomHexColor();
        const rot = getRandomRotation();
        message.reply(getSofeEmbed(sofehex, sofebghex, rot));
        break;

      case 'makesofe':
        if (message.content.includes('#')) {
          message.reply('Please don\'t use #\'s or any other symbols for the hex codes in this command!');
        } else if (args[0] && args[1]) {
          message.reply(getSofeEmbed(args[0], args[1], args[2] ?? 0));
        } else {
          message.reply(`Usage: ${config.prefix}makesofe <hexcode> <hexcode for background> [rotation in degrees]\nExample: ${config.prefix}makesofe FFEE00 FFFFFF 90`);
        }
        break;

      case '8ball':
        message.reply(get8BallResponse());
        break;

      case 'weather':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}weather <city>\nExample: ${config.prefix}weather London`);
          return;
        }
        message.reply(await getWeather(args[0]));
        break;

      case 'cat':
        message.reply(await getRandomCat());
        break;

      case 'fish':
        message.reply(getFish());
        break;

      case 'whoami':
        message.reply(getWhoisEmbed(message.member));
        break;

      case 'whois':
        if (typeof message.mentions.members.first() !== 'undefined') {
          message.reply(getWhoisEmbed(message.mentions.members.first()));
        } else {
          message.reply(`Member not found!\nCommand Usage: ${config.prefix}whois @mentionOfaUser`);
        }
        break;

      case 'eval':
        if (!doEval(message.author.id, message, args.join(' '))) {
          message.reply('You ain\'t doing that!');
        }
        break;

      case 'reboot':
        if (!doReboot(message)) {
          message.reply('You ain\'t doing that!');
        }
        break;

      case 'googlepic':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}googlepic <search term>`);
        } else {
          message.channel.sendTyping();
          const oargs = JSON.parse(JSON.stringify(args));
          let ri;
          if (args[args.length - 2] === '-r' && !isNaN(args[args.length - 1])) {
            args.splice(args.length - 2, 2);
            ri = oargs[oargs.length - 1];
          } else {
            ri = 1;
          }
          message.reply(await getGooglePic(args.join(' '), ri));
        }
        break;

      case 'poggit':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}poggit <plugin name>`);
        } else {
          message.channel.sendTyping();
          message.reply(await getPoggitPlugin(args[0]));
        }
        break;

      case 'channels':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}channels <text|voice>`);
        } else {
          message.reply(await getChannels(message.guild, args[0]));
        }
        break;

      case 'chuck':
        message.reply(await getChuckNorrisFact());
        break;

      case 'issue':
      case 'pr':
        let repo;
        let number;
        if ((message.guild.id === '287339519500353537' || message.guild.id === '373199722573201408') && !args[1]) {
          if (!args[0]) {
            message.reply(`Usage: ${config.prefix}issue <number> or ${config.prefix}issue <repo> <number>\nExample: ${config.prefix}issue boxofdevs/commandshop 2`);
            return;
          }
          repo = 'pmmp/pocketmine-mp';
          number = args[0];
        } else {
          if (!args[1]) {
            message.reply(`Usage: ${config.prefix}issue <repo> <number>\nExample: ${config.prefix}issue boxofdevs/commandshop 2`);
            return;
          }
          repo = args[0];
          number = args[1];
        }
        if (isNaN(number)) {
          message.reply(`Usage: ${config.prefix}issue <repo> **<number>**\nExample: ${config.prefix}issue boxofdevs/commandshop **2**`);
        } else {
          message.channel.sendTyping();
          message.reply(await getGitIssue(repo, Math.floor(number)));
        }
        break;

      case 'poll':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}poll <title|choice1|choice2|choice3|...> [optional: time in seconds]\nExample: What do you prefer?|Potatoes|Trains|Turtles|Juice boxes`);
        } else {
          doStartPoll(message, args);
        }
        break;

      case 'info':
      case 'status':
      case 'invite':
        message.reply(getInfo(client));
        break;

      case 'convert':
        if (!args[2] | isNaN(args[0])) {
          message.reply(`Usage: ${config.prefix}convert <amount> <from> <to>\nExample: ${config.prefix}convert 2 btc usd`);
        } else {
          message.reply(getConversion(args[0], args[1], args[2]));
        }
        break;

      case 'mock':
      case '<:mock:412317398050275329>':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}mock <text>\nExample: ${config.prefix}mock How do I open Discord`);
        } else {
          message.channel.send(getMocked(message.author, args.join(' ')));
        }
        break;

      case 'clap':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}clap <text>\nExample: ${config.prefix}clap That is great`);
        } else {
          message.channel.send(getClapped(message.author, args.join(' ')));
        }
        break;

      case 'xkcd':
        if (isNaN(args[0]) && typeof args[0] !== 'undefined') {
          message.reply(`Usage: ${config.prefix}xkcd <id>\nExample: ${config.prefix}xkcd 292\nWhen no ID is provided, the most recent one will be displayed.`);
        } else {
          message.reply(await getXkcd(args[0] ?? null));
        }
        break;

      case 'emote':
        if (!args[0]) {
          message.reply(`Usage: ${config.prefix}emote <name>\nExample: ${config.prefix}emote turtle`);
        } else {
          message.reply(getCustomEmote(message.guild, args[0]));
        }
        break;

      case 's':
        const match = /s (.+)\/(.*)/.exec(message.content.substr(1));
        if (match === null) {
          message.reply(`Usage: ${config.prefix}s <find>/<replace>\nExample: ${config.prefix}s tst/test`);
        } else {
          message.reply(await getSubstitute(message.channel, match[1], match[2]));
        }
        break;

      case 'help':
        message.reply('Sent you a DM!');
        message.author.send(getHelp());
        break;
      default:
        break;
    }

  } else if (githubregex.test(message.content)) {
    const ghMatch = githubregex.exec(message.content);
    message.channel.send(getGitHubLinePreview(ghMatch));
  }
});

if (firstrun === 1) {
  client.login(config.discordtoken)
    .then(function() {
      console.log('Login successful!');
    })
    .catch(function(r) {
      console.error('Login not successful! ' + r);
    });
  firstrun = 0;
} else {
  console.log('Not logging in again for preventing bot token reset!');
}