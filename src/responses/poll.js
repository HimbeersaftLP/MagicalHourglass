import config from '../../config.js';
import {
  Client,
  Message,
  MessageEmbed,
  MessageReaction,
} from 'discord.js';

/**
 * Start a reaction poll
 * @param {Message} message The message that started the poll
 * @param {string[]} args Args of said message
 * @param {Client} client discord.js client object
 */
export async function doStartPoll(message, args) {
  let time;
  if (!isNaN(args[args.length - 1])) {
    time = Math.floor(args[args.length - 1]);
    args.pop();
  } else {
    time = 0;
  }
  const newargs = args.join(' ').split('|');
  if (newargs.length < 3) {
    message.reply('There need to be at least 2 choices and a title!');
  } else if (newargs.length > 21) {
    message.reply('Because of limitation in reaction count on Discord you can\'t have more than 20 choices on a poll, sorry.');
  } else {
    const choices = newargs.splice(1);
    let poll = new MessageEmbed().setTitle('Poll: ' + newargs[0]).setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() }).setTimestamp(new Date());
    const msg = await message.channel.send({
      embeds: [poll.setDescription('Hold on, processing reactions...\n**Don\'t vote yet!**')],
    });
    try {
      const {
        reactions,
        messageReactions,
      } = await reactionPoll(choices.length, msg);
      let polltext = '';
      choices.forEach(function(c, i) {
        polltext += config.reaction_alphabet[i] + ' ' + c + '\n';
      });
      const msg2 = await msg.edit({
        embeds: [poll.setDescription(polltext).setFooter({ text: 'Click one of the reactions to vote!', iconURL: 'https://himbeer.me/images/logo-monochrome.png' })],
      });
      if (time !== 0 && time >= 5 && time <= 3600) {
        const msg3 = await msg2.edit({
          embeds: [poll.addField('Notice:', 'Poll will end in ' + time + ' seconds')],
        });
        setTimeout(function() {
          let result = '**Results:**\n';
          messageReactions.forEach(function(r, i) {
            try {
              result += reactions[i] + ' ' + choices[i] + ': ' + (r.count - 1) + ' votes\n';
            } catch (err) {
              result += 'Error\n';
            }
          });
          poll = poll.setDescription(result).setFooter({ text: 'Poll ended!', iconURL: 'https://himbeer.me/images/logo-monochrome.png' }).setTitle('Poll: ' + newargs[0] + ' (ended)');
          poll.fields = [];
          msg3.edit({
            embeds: [poll],
          });
        }, time * 1000);
      } else if (time !== 0) {
        message.reply('Time must me number between 5 and 3600!');
      }
    } catch (err) {
      let errexplain = '';
      if (err.message === 'Maximum number of reactions reached (20)') {
        errexplain = 'Reason: There were already 20 reactions on that message (can\'t fit more than 20 per message).\nHint: If you are a server owner you can remove the permission to react from other people while the bot is reacting.';
      } else {
        console.log(err);
        errexplain = 'Unknown error, this has been logged and the bot creator will take a look at the issue';
      }
      msg.edit({
        embeds: [poll.setDescription('There was an error while processing reactions:\n' + errexplain).setFooter({ text: 'I\'m sorry :/', iconURL: 'https://himbeer.me/images/logo-monochrome.png' })],
      });
    }
  }
}

/**
 * @typedef {Object} ReactionPollResult
 * @property {string[]} reactions
 * @property {MessageReaction[]} messageReactions
 */

/**
 * Add the reactions needed for the poll to its message
 * @param {number} choices Amount of poll choices
 * @param {Message} message Message to react to
 * @returns {Promise<ReactionPollResult>}
 */
async function reactionPoll(choices, message) {
  const reactions = config.reaction_alphabet.slice(0, choices);
  const messageReactions = [];
  for (let i = 0; i < reactions.length; i++) {
    const messageReaction = await message.react(reactions[i]);
    messageReactions.push(messageReaction);
  }
  return { reactions, messageReactions };
}