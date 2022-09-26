import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import {
  EmbedBuilder,
  MessagePayload,
} from 'discord.js';
import removeMarkdown from 'remove-markdown';
import { replySingleCommandHelp } from './help.js';

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Find an issue/pull request on GitHub')
    .addStringOption(o =>
      o.setName('repo')
        .setDescription('Repository name in the format user/repo')
        .setRequired(true))
    .addIntegerOption(o =>
      o.setName('number')
        .setDescription('Issue or Pull Request number')
        .setRequired(true)),
  usage: '<repo> <number> (on PMMP Discord also ${config.prefix}issue <number> for the PMMP repo)',
  example: 'boxofdevs/commandshop 2',
  aliases: ['pr'],
}];

/**
 * Get an Embed describing a GitHub issue or pull request
 * @param {string} repo Repository name
 * @param {number} number Issue Number
 * @returns {Promise<MessagePayload|string>}
 */
export async function getGitIssue(repo, number) {
  const res = await fetch(
    'https://api.github.com/repos/' + repo + '/issues/' + encodeURIComponent(number), {
      headers: {
        'User-Agent': 'MagicalHourglass',
        'Accept': 'application/vnd.github.squirrel-girl-preview',
      },
    });

  if (res.status === 200) {
    const g = await res.json();
    let ilabels = '';
    g.labels.forEach(function(label, i) {
      ilabels += label.name + ((i !== g.labels.length - 1) ? ', ' : '');
    });
    const embed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle(((typeof g.pull_request === 'undefined') ? 'Issue' : 'Pull request') + ' #' + number + ': ' + g.title)
      .setAuthor({ name: repo })
      .addFields([{
        name: 'Information:',
        value: '__Created by__ ' + g.user.login +
        '\n__State:__ ' + g.state +
        '\n__Labels:__ ' + ((g.labels !== []) ? ilabels : 'none') +
        '\n__Comments:__ ' + g.comments +
        '\n__Locked:__ ' + g.locked +
        '\n__Reactions:__\n' + g.reactions['+1'] + ' 👍 | ' + g.reactions['-1'] + ' 👎 | ' + g.reactions.laugh + ' 😄 | ' + g.reactions.confused + ' 😕 | ' + g.reactions.heart + ' ❤️ | ' + g.reactions.hooray + ' 🎉',
      }])
      .setThumbnail(g.user.avatar_url)
      .setTimestamp(new Date(g.created_at))
      .setURL(g.html_url)
      .setFooter({
        text: 'Data from api.github.com',
        iconURL: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png',
      });
    if (removeMarkdown(g.body).length > 2045) {
      embed.addField([{
        name: 'Notice:',
        value: 'The Description has been shortened to fit into an embed',
      }]);
      embed.setDescription((removeMarkdown(g.body).substring(0, 2045)) + '...');
    } else {
      embed.setDescription(removeMarkdown(g.body));
    }
    return {
      embeds: [embed],
    };
  } else if (res.status === 404) {
    return 'Error: Repo or issue not found.';
  } else if (res.status === 410) {
    return 'Error: The requested issue was deleted.';
  } else {
    return 'An error occured while accessing the GitHub API!';
  }
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const repo = interaction.options.getString('repo');
  const number = interaction.options.getInteger('number');
  await interaction.reply(await getGitIssue(repo, number));
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
  let repo;
  let number;
  if ((message.guild?.id === '287339519500353537' || message.guild?.id === '373199722573201408') && !args[1]) {
    if (!args[0]) {
      await replySingleCommandHelp(message, 'issue');
      return;
    }
    repo = 'pmmp/pocketmine-mp';
    number = args[0];
  } else {
    if (!args[1]) {
      await replySingleCommandHelp(message, 'issue');
      return;
    }
    repo = args[0];
    number = args[1];
  }
  if (isNaN(number)) {
    await replySingleCommandHelp(message, 'issue', 'Invalid number provided!');
  } else {
    message.channel.sendTyping();
    await message.reply(await getGitIssue(repo, Math.floor(number)));
  }
}