import { CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import { nLength } from '../extras.js';
import { replySingleCommandHelp } from './help.js';

export const githubRegex = /http(?:s|):\/\/github\.com\/(.*?\/.*?\/)blob\/(.*?\/.*?)#L([0-9]+)-?L?([0-9]+)?/;
const fileEndRegex = /.*\.([a-zA-Z0-9]*)/;

export const data = [{
  builder: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Preview the specified line of code on github')
    .addStringOption(o =>
      o.setName('url')
        .setDescription('GitHub link')
        .setRequired(true)),
  usage: '<url>',
  example: 'https://github.com/HimbeersaftLP/MagicalHourglass/blob/master/src/bot.js#L3',
}];

/**
 * Get the message previewing lines for a file on GitHub
 * @param {RegExpExecArray} match The result of gitHubRegex.exec()
 * @returns {Promise<string>}
 */
export async function getGitHubLinePreview(match) {
  // TODO: Maybe use embed for more allowed characters
  // TODO: Display repo name and branch because the slash command doesn't show the URL
  // TODO: When sending the start of a file, a negative number will be displayed
  // Match -> 1: repo; 2: file; 3: line-from; 4: line-to
  if (match === null) {
    return 'Error: Invalid URL format detected! Make sure you are linking to a specific line of code on GitHub.';
  }
  const res = await fetch('https://raw.githubusercontent.com/' + match[1] + match[2]);
  if (res.status === 404) {
    return 'Error: GitHub file not found!';
  }
  if (res.status !== 200) {
    return 'An error occured while accessing the GitHub API!';
  }
  const body = await res.text();
  const lines = body.split('\n');
  if (typeof lines[match[3] - 1] === 'undefined') return;
  match[3] = Number(match[3]);
  let from;
  let to;
  if (typeof match[4] === 'undefined') {
    match[4] = match[3];
    from = match[3] - 5;
    to = match[3] + 5;
  } else {
    match[4] = Number(match[4]);
    if (typeof lines[match[4] - 1] === 'undefined' || match[3] >= match[4]) return;
    from = match[3];
    to = match[4];
    const diff = match[4] - match[3];
    if (diff < 11) {
      const space = Math.round((11 - diff) / 2);
      from = match[3] - space;
      to = match[4] + space;
    }
    if (diff > 40) {
      from = match[3];
      to = match[3] + 40;
    }
  }
  let lang = fileEndRegex.exec(match[2]) ? fileEndRegex.exec(match[2])[1] : '';
  if (lang === 'kt') lang = 'kotlin'; // Workaround for Kotlin syntax highlighting
  if (lang === 'svg') lang = 'xml'; // Workaround for svg syntax highlighting
  const cleanFileName = match[2].replace(/\?.+/, ''); // Remove HTTP GET Query Parameters
  let codemsg = `Showing lines ${from} - ${to} of \`${cleanFileName}\`\n` + '```' + lang + '\n';
  for (let i = from; i <= to; i++) {
    if (typeof lines[i - 1] !== 'undefined') {
      codemsg += `${((i >= match[3] && i <= match[4]) ? '>' : ' ')}${(nLength(i) < nLength(to) ? ' ' : '')}${i} ${lines[i - 1]}\n`;
    }
  }
  return codemsg + '```';
}

/**
 * Execute this command as a slash-command
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */
export async function execute(interaction) {
  const url = interaction.options.getString('url');
  await interaction.reply(await getGitHubLinePreview(githubRegex.exec(url)));
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
    await replySingleCommandHelp(message, 'github');
  } else {
    await message.reply(await getGitHubLinePreview(githubRegex.exec(args[0])));
  }
}