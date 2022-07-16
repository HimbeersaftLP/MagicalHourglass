import { CommandInteraction, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import config from '../../config.js';
import {
  Client,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
} from 'discord.js';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Make a poll using reactions')
    .addStringOption(o =>
      o.setName('title')
        .setDescription('Poll title')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('choices')
        .setDescription('Poll choices seperated by the pipe character ("|")')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('runtime')
        .setDescription('How long the poll should be open (in seconds)')
        .setRequired(false)),
  usage: '<title|choice1|choice2|choice3|...> [optional: time in seconds]',
  example: 'What do you prefer?|Potatoes|Trains|Turtles|Juice boxes',
}];

/**
 * Start a reaction poll (internal method)
 * @param {User} author Author of the message
 * @param {TextChannel} channel The channel the poll gets sent to
 * @param {string} title Poll title
 * @param {string[]} choices Poll choices
 * @param {Number} time Poll timeout in seconds, 0 to disable
 * @param {Client} client discord.js client object
 */
async function startPollInternal(author, channel, title, choices, time = 0) {
  let poll = new MessageEmbed().setTitle('Poll: ' + title).setAuthor({ name: author.username, iconURL: author.displayAvatarURL() }).setTimestamp(new Date());
  const msg = await channel.send({
    embeds: [poll.setDescription('Hold on, processing reactions...\n**Don\'t vote yet!**')],
  });
  try {
    const {
      reactions,
      messageReactions,
    } = await reactionPoll(choices.length, msg);
    let polltext = '';
    choices.forEach(function(c, i) {
      polltext += config.reactionAlphabet[i] + ' ' + c + '\n';
    });
    const msg2 = await msg.edit({
      embeds: [poll.setDescription(polltext).setFooter({ text: 'Click one of the reactions to vote!', iconURL: 'https://himbeer.me/images/logo-monochrome.png' })],
    });
    if (time !== 0) {
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
        poll = poll.setDescription(result).setFooter({ text: 'Poll ended!', iconURL: 'https://himbeer.me/images/logo-monochrome.png' }).setTitle('Poll: ' + title + ' (ended)');
        poll.fields = [];
        msg3.edit({
          embeds: [poll],
        });
      }, time * 1000);
    }
  } catch (err) {
    let errexplain = '';
    if (err.message === 'Maximum number of reactions reached (20)') {
      errexplain = 'Reason: There were already 20 reactions on that message (can\'t fit more than 20 per message).\nHint: If you are a server owner you can remove the permission to react from other people while the bot is reacting.';
    } else {
      console.error(err);
      errexplain = 'Unknown error, this has been logged and the bot creator will take a look at the issue';
    }
    msg.edit({
      embeds: [poll.setDescription('There was an error while processing reactions:\n' + errexplain).setFooter({ text: 'I\'m sorry :/', iconURL: 'https://himbeer.me/images/logo-monochrome.png' })],
    });
  }
}

/**
 * Start a reaction poll
 * @param {User} author Author of the message
 * @param {CommandInteraction|Message} interaction The message that started the poll
 * @param {string} title Poll title
 * @param {string[]} choices Poll choices
 * @param {Number} time Poll timeout in seconds, 0 to disable
 * @param {Client} client discord.js client object
 */
export async function doStartPoll(author, interaction, title, choices, time = 0) {
  if (choices.length < 2) {
    await interaction.reply('There need to be at least 2 choices!');
  } else if (choices.length > 20) {
    await interaction.reply('Because of limitation in reaction count on Discord you can\'t have more than 20 choices on a poll, sorry.');
  } else {
    if (time !== 0 && time < 5 && time > 3600) {
      await interaction.reply('Time must me number between 5 and 3600!');
      return;
    }
    startPollInternal(author, interaction.channel, title, choices, time);
    if (typeof interaction.deferReply !== 'undefined') {
      await interaction.deferReply();
      await interaction.deleteReply();
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
  const reactions = config.reactionAlphabet.slice(0, choices);
  const messageReactions = [];
  for (let i = 0; i < reactions.length; i++) {
    const messageReaction = await message.react(reactions[i]);
    messageReactions.push(messageReaction);
  }
  return { reactions, messageReactions };
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const title = interaction.options.getString('title');
  const choices = interaction.options.getString('choices');
  const runtime = interaction.options.getInteger('runtime', false) || 0;

  const pollChoices = choices.split('|');

  await doStartPoll(interaction.user, interaction, title, pollChoices, runtime);
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
    await replySingleCommandHelp(message, 'poll');
  } else {
    let pollTime;
    let argsWithoutTime;
    if (!isNaN(args[args.length - 1])) {
      pollTime = Math.floor(args[args.length - 1]);
      argsWithoutTime = args.slice(0, -1).join(' ').split('|');
    } else {
      pollTime = 0;
      argsWithoutTime = args.join(' ').split('|');
    }
    if (argsWithoutTime.length < 3) {
      await message.reply('There need to be at least 2 choices and a title!');
      return;
    }
    const pollTitle = argsWithoutTime[0];
    const pollChoices = argsWithoutTime.slice(1);
    doStartPoll(message.author, message, pollTitle, pollChoices, pollTime);
  }
}