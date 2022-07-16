import config from '../config.js';

import Discord from 'discord.js';
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: [
    'CHANNEL',
  ],
});

import { getGitHubLinePreview, githubRegex } from './commands/github.js';
import { generateHelpEmbed } from './commands/help.js';
import { getCommandDict, readAllCommands, registerAllCommands } from './commandManager.js';

let readySpam = false;
let commandDict;

client.on('ready', () => {
  client.user.setStatus('online');
  console.log('Everything connected!');
  client.user.setActivity(`-> ${config.prefix}help <-`);
  if (readySpam === false) {
    readySpam = true;
    setTimeout(function() {
      readySpam = false;
    }, 3000);
  } else {
    console.error('Stopping due to client-ready spam, please restart the bot!');
    process.exit(0);
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (config.blockedUsers.includes(message.author.id)) return;
  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = commandDict[cmd];

    if (!command) return;

    try {
      if (message.guild) {
        console.log(`>L "${cmd}" by "${message.author.tag}" on "${message.guild.name}"`);
      } else {
        console.log(`>L "${cmd}" by "${message.author.tag}" via DM`);
      }
      await command.executeFromMessage(message, cmd, args);
    } catch (err) {
      console.error(err);
      await message.reply('Error: Command could not be executed due to an unknown problem. Sorry.');
    }
  } else if (githubRegex.test(message.content)) {
    const ghMatch = githubRegex.exec(message.content);
    message.reply({
      content: await getGitHubLinePreview(ghMatch),
      allowedMentions: { repliedUser: false }, // Reply without ping
    });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (config.blockedUsers.includes(interaction.user.id)) return;

  const command = commandDict[interaction.commandName];

  if (!command) return;

  try {
    if (interaction.guild) {
      console.log(`>S "${interaction.commandName}" by "${interaction.user.tag}" on "${interaction.guild.name}"`);
    } else {
      console.log(`>S "${interaction.commandName}" by "${interaction.user.tag}" via DM`);
    }
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply('Error: Command could not be executed due to an unknown problem. Sorry.');
  }
});

async function main() {
  await readAllCommands();
  await registerAllCommands();
  await generateHelpEmbed();

  commandDict = await getCommandDict();

  console.log('Logging in...');
  try {
    await client.login(config.discordToken);
    console.log('--> Login successful!');
  } catch (err) {
    console.error('--> Login not successful!');
    console.error(err);
  }
}

main();