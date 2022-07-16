import config from '../config.js';

import fs from 'fs';
import url from 'url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message } from 'discord.js';

/**
 * @typedef {Object} CommandInfo
 * @property {SlashCommandBuilder} builder The command's SlashCommandBuilder
 * @property {string?} usage Command usage (for help)
 * @property {string?} example Command example (for help)
 * @property {string[]?} aliases Command aliases (only when executed via prefix instead of slash-command)
 * @property {boolean?} doNotRegister Set to "true" to not register this as a slash-command
 */

/**
 * Execute this command as a slash-command
 * @name ExecuteCommandMethod
 * @function
 * @param {CommandInteraction} interaction The Interaction object
 * @returns {Promise}
 */

/**
 * Execute this command from a message (legacy style)
 * @name ExecuteCommandFromMessageMethod
 * @function
 * @param {Message} message The message that caused command execution
 * @param {string} cmd Command name
 * @param {string[]} args Command arguments
 * @returns {Promise}
 */

/**
 * @typedef {Object} Command
 * @property {CommandInfo[]} data
 * @property {ExecuteCommandMethod} execute
 * @property {ExecuteCommandFromMessageMethod} executeFromMessage
 */

/**
 * Array containing all commands
 * @type {Command[]}
 */
const allCommands = [];

/**
 * Read all commands (from the commands directory) into the allCommands array
 * @returns {Promise<Command[]>} Array of all commands
 */
export async function readAllCommands() {
  if (allCommands.length > 0) {
    throw new Error('This method may only be used once!');
  }

  const commandsDirUrl = new URL('./commands/', import.meta.url);
  const commandsDirPath = url.fileURLToPath(commandsDirUrl);

  const commandFiles = fs.readdirSync(commandsDirPath).filter(file => file.endsWith('.js'));

  for (let i = 0; i < commandFiles.length; i++) {
    const file = commandFiles[i];
    const filePath = commandsDirUrl.href + file;
    const command = await import(filePath);
    allCommands.push(command);
  }

  return allCommands;
}

/**
 * Get the CommandInfo of all commands (from the commands directory)
 * @returns {Promise<CommandInfo[]>} Dictionary of all commands
 */
export async function getAllCommandInfos() {
  const commandInfos = [];

  for (let i = 0; i < allCommands.length; i++) {
    const command = allCommands[i];
    command.data.forEach(data => {
      commandInfos.push(data);
    });
  }

  return commandInfos;
}

/**
 * Get a dictionary of all registered commands (with aliases included in the keys)
 * @returns {Promise<Object.<string, Command>} Dictionary of all commands
 */
export async function getCommandDict() {
  const commandDict = {};

  for (let i = 0; i < allCommands.length; i++) {
    const command = allCommands[i];
    command.data.forEach(data => {
      commandDict[data.builder.name] = command;
      data.aliases?.forEach(alias => {
        commandDict[alias] = command;
      });
    });
  }

  return commandDict;
}

/**
 * Register all commands as slash-commands
 * @param {boolean} log Set to true to print debug log
 * @returns {Promise}
 */
export async function registerAllCommands(log = false) {
  const commandsToRegister = [];
  const allCommandInfos = await getAllCommandInfos();

  allCommandInfos.forEach((data, j) => {
    if (data.doNotRegister) {
      if (log) console.log(`(${j + 1}/${allCommandInfos.length}) ${data.builder.name} skipped`);
    } else {
      commandsToRegister.push(data.builder.toJSON());
      if (log) console.log(`(${j + 1}/${allCommandInfos.length}) ${data.builder.name}`);
      data.aliases?.forEach((alias) => {
        // const aliasSlashCommandData = data.builder;
        // aliasSlashCommandData.setName(alias);
        // commandsToRegister.push(aliasSlashCommandData.toJSON());
        if (log) console.log(`------> alias ${alias}`);
      });
    }
  });

  const registeredCommandListPath = url.fileURLToPath(new URL('../registered_commands.json', import.meta.url));
  const newRegisteredCommandListJson = JSON.stringify(commandsToRegister);
  if (fs.existsSync(registeredCommandListPath)) {
    const oldRegisteredCommandListJson = fs.readFileSync(registeredCommandListPath, { encoding: 'utf-8' });
    if (oldRegisteredCommandListJson === newRegisteredCommandListJson) {
      console.log('Commands are already registered.');
      return;
    }
  }

  console.log(`Registering ${commandsToRegister.length} commands...`);

  const rest = new REST({ version: '9' }).setToken(config.discordToken);
  await rest.put(Routes.applicationCommands(config.discordApplicationId), { body: commandsToRegister });
  console.log('Successfully registered application commands.');

  console.log('--> Registered!');

  fs.writeFileSync(registeredCommandListPath, newRegisteredCommandListJson, { encoding: 'utf-8' });
}

/*
    Inspired by https://github.com/discordjs/guide/blob/5c34e858ac9c59475a5e88315315a15df1ee4400/code-samples/creating-your-bot/command-handling/deploy-commands.js
    which is licensed under the MIT License:

    MIT License

    Copyright (c) 2017 - 2022 Sanctuary

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */