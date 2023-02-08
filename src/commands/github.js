import { CommandInteraction, Message, EmbedBuilder, MessagePayload } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';
import { nLength } from '../extras.js';
import { replySingleCommandHelp } from './help.js';

export const githubRegex = /http(?:s|):\/\/github\.com\/(.*?\/.*?)\/blob\/(.*?\/.*?)#L([0-9]+)(?:C([0-9]+))?(?:-L([0-9]+))?(?:C([0-9]+))?/;
const fileExtensionRegex = /.*\.([a-zA-Z0-9]*)/;

const GROUP_REPO = 1;
const GROUP_FILE = 2;
const GROUP_L_FROM = 3;
const GROUP_C_FROM = 4;
const GROUP_L_TO = 5;
const GROUP_C_TO = 6;

const MAX_DISCORD_MESSAGE_LENGTH = 2000;

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
 * @returns {Promise<MessagePayload|string>}
 */
export async function getGitHubLinePreview(match) {
  // Match -> 1: repo; 2: file; 3: line-from; 4: line-to
  if (match === null) {
    return 'Error: Invalid URL format detected! Make sure you are linking to a specific line of code on GitHub.';
  }

  const repo = match[GROUP_REPO];
  const fileName = match[GROUP_FILE].replace(/\?.+/, ''); // Remove HTTP GET Query Parameters

  const res = await fetch(`https://raw.githubusercontent.com/${repo}/${fileName}`);
  if (res.status === 404) {
    return 'Error: GitHub file not found!';
  }
  if (res.status !== 200) {
    return 'Error: Could not fetch the file from GitHub!';
  }

  const body = await res.text();
  const lines = body.split('\n');

  let from, to;
  let selectedTo;
  const selectedFrom = Number(match[GROUP_L_FROM]);
  if (typeof lines[selectedFrom - 1] === 'undefined') {
    return 'Error: The selection start line does not exist in this file!';
  }
  if (typeof match[GROUP_L_TO] === 'undefined') { // No end line given (#Ln)
    selectedTo = selectedFrom;
    from = selectedFrom - 5;
    to = selectedFrom + 5;
  } else { // End line given (#Ln-n)
    selectedTo = Number(match[GROUP_L_TO]);
    if (typeof lines[selectedTo - 1] === 'undefined') {
      return 'Error: The selection end line does not exist in this file!';
    }
    if (selectedFrom > selectedTo) {
      return 'Error: Selection start line is after selection end line.';
    }
    from = selectedFrom;
    to = selectedTo;
    const diff = selectedTo - selectedFrom;
    if (diff < 11) { // If less than 11 lines are selected, display context up to twelve lines
      const space = Math.round((11 - diff) / 2);
      from = selectedFrom - space;
      to = selectedTo + space;
    }
    if (diff > 40) { // If more than 40 lines are selected, only display the top 40 lines
      from = selectedFrom;
      to = selectedFrom + 40;
    }
  }

  // Parse selected column
  let selectedColFrom = null, selectedColTo = null;
  if (typeof match[GROUP_C_FROM] !== 'undefined') {
    selectedColFrom = Number(match[GROUP_C_FROM]);
    if (lines[selectedFrom - 1].length < (selectedColFrom - 1)) {
      return 'Error: The selection start column does not exist in the corresponding line!';
    }
    if (typeof match[GROUP_C_TO] !== 'undefined') {
      selectedColTo = Number(match[GROUP_C_TO]);
      if (selectedColFrom > selectedColTo) {
        return 'Error: Selection start column is after selection end column.';
      }
      if (lines[selectedTo - 1].length < (selectedColTo - 1)) {
        return 'Error: The selection end column does not exist in the corresponding line!';
      }
    } else if (selectedFrom !== selectedTo) {
      return 'Error: No end column selected in a multi-line selection!';
    }
  }

  // Prevent trying to show lines that do not exist in the file
  from = Math.max(from, 1);
  to = Math.min(to, lines.length);

  // Determine programming language from file extension
  let lang = fileExtensionRegex.exec(fileName)?.[1] || '';
  if (lang === 'kt') lang = 'kotlin'; // Workaround for Kotlin syntax highlighting
  if (lang === 'svg') lang = 'xml'; // Workaround for svg syntax highlighting

  // Put lines into code block
  let codeContent = '```' + lang + '\n'; // Put language at start of code block for Discord syntax highlighting
  for (let i = from; i <= to; i++) {

    const withinSelectedRows = i >= selectedFrom && i <= selectedTo;

    // Display > character in front of selected lines:
    codeContent += `${(withinSelectedRows ? '>' : ' ')}${(nLength(i) < nLength(to) ? ' ' : '')}${i} ${lines[i - 1]}\n`;

    // Mark selected columns with a ^ character below:
    if (withinSelectedRows && selectedColFrom !== null) { // Within selected rows and columns are selected
      codeContent += ' '.repeat(nLength(to) + 2); // Pad to include the spacing and line numbers
      if (i === selectedFrom) { // Pad to the start column in the line where the selection starts
        codeContent += ' '.repeat(selectedColFrom - 1);
      }
      codeContent += '^';
      if (selectedColTo !== null) {
        if (i === selectedTo) { // Only mark until we reach the end column in the line where the selection ends
          if (selectedFrom === selectedTo) { // When one line is selected: Mark columns in the line
            codeContent += '^'.repeat(selectedColTo - selectedColFrom - 1);
          } else { // When more lines are selected: Mark columns in the last line until the selection is reached
            codeContent += '^'.repeat(selectedColTo - 2);
          }
        } else if (i === selectedFrom) { // When more lines are selected: Mark columns in the first line until end of line
          codeContent += '^'.repeat(lines[i - 1].length - selectedColFrom);
        } else { // All other lines in the selection are completely marked
          codeContent += '^'.repeat(lines[i - 1].length - 1);
        }
      }
      codeContent += '\n';
    }

  }
  codeContent += '```';

  const previewTitle = `Showing lines ${from} - ${to} of \`${fileName}\``;

  const textMessage = previewTitle + '\n' + codeContent;

  if (textMessage.length <= MAX_DISCORD_MESSAGE_LENGTH) {
    return { content: textMessage };
  } else {
    const embed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setFooter({
        text: `GitHub repository: ${repo}`,
      });

    embed.setTitle(previewTitle);
    embed.setDescription(codeContent);
    if (selectedFrom === selectedTo) { // No end line given (#Ln)
      embed.setURL(`https://github.com/${repo}/blob/${fileName}#L${selectedFrom}`);
    } else {
      embed.setURL(`https://github.com/${repo}/blob/${fileName}#L${selectedFrom}-L${selectedTo}`);
    }

    return { embeds: [ embed ] };
  }
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