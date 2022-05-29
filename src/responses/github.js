import fetch from 'node-fetch';
import { nLength } from '../extras.js';

const fileEndRegex = /.*\.([a-zA-Z0-9]*)/;

/**
 * Get the message previewing lines for a file on GitHub
 * @param {RegExpExecArray} match The result of gitHubRegex.exec()
 * @returns {Promise<string>}
 */
export async function getGitHubLinePreview(match) {
  // Match -> 1: repo; 2: file; 3: line-from; 4: line-to
  const body = await (await fetch('https://raw.githubusercontent.com/' + match[1] + match[2])).text();
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