# MagicalHourglass

A Discord bot for the BoxOfDevs Discord

## Changelog for version 2

- Complete refactoring
  - Organise code into seperate classes
  - Use ES modules instead of CommonJS module format
  - Use `node-fetch` instead of `request`
  - Use custom command handler instead of switch/case
  - Use async/await instead of Promises
  - More robust error handling
- Respones are now sent as proper replies
- Bot now responds to DMs
- Commands:
  - Added slash commands
  - Deprecated prefixed commands
  - `github` command added
    - Sends the same line preview as GitHub links in regular messages
    - Improvements: (apply to the old automatic line preview as well)
      - Uses embed for more possible characters
      - Some bugfixes
  - `help` rewrite
    - can now get detailed help for individual commands
    - is now automatically generated from the individual command data
  - `channels` command now displays the new text chat in voice channels
  - `s` command now shows the author
  - `makesofe` command now accepts hexadecimal color codes with or without `#`
  - `eval` command does not delete errors anymore
  - `say` command has been removed
  - `ai` command has been removed
  - All responses regarding wrong usage now look consistent
  - Some command outputs may have changed slightly
- Config changes
  - JavaScript config instead of `config.json` because it's easier to load with ES-modules syntax
  - Configuration values can now be given using environment variables, defaults set in `defaults.js`
    - for the Docker image in `defaults.js.docker`
  - Constants like the reaction alphabet are no longer in the config file
- Updated all dependencies
