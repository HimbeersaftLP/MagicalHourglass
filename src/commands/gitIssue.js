import fetch from 'node-fetch';
import {
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import removeMarkdown from 'remove-markdown';

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
    const gissue = new MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle(((typeof g.pull_request === 'undefined') ? 'Issue' : 'Pull request') + ' #' + number + ': ' + g.title)
      .addField('Information:', '__Created by__ ' + g.user.login + '\n__State:__ ' + g.state + '\n__Labels:__ ' + ((g.labels !== []) ? ilabels : 'none') + '\n__Comments:__ ' + g.comments + '\n__Locked:__ ' + g.locked + '\n__Reactions:__\n' + g.reactions['+1'] + ' 👍 | ' + g.reactions['-1'] + ' 👎 | ' + g.reactions.laugh + ' 😄 | ' + g.reactions.confused + ' 😕 | ' + g.reactions.heart + ' ❤️ | ' + g.reactions.hooray + ' 🎉')
      .setThumbnail(g.user.avatar_url)
      .setTimestamp(new Date(g.created_at))
      .setURL(g.html_url)
      .setFooter({
        text: 'Data from api.github.com',
        iconURL: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png',
      });
    if (removeMarkdown(g.body).length > 2045) {
      gissue.addField('Notice:', 'The Description has been shortened to fit into an embed');
      gissue.setDescription((removeMarkdown(g.body).substring(0, 2045)) + '...');
    } else {
      gissue.setDescription(removeMarkdown(g.body));
    }
    return {
      embeds: [gissue],
    };
  } else if (res.status === 404) {
    return 'Error: Repo or issue not found.';
  } else if (res.status === 410) {
    return 'Error: The requested issue was deleted.';
  } else {
    return 'An error occured while accessing the GitHub API!';
  }
}