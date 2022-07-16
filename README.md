# MagicalHourglass

A Discord bot for the BoxOfDevs Discord

## Changelog for version 2

- Complete refactoring
  - Organise code into seperate classes
  - Use `node-fetch` instead of `request`
  - Use custom command handler instead of switch/case
  - Use async/await instead of Promises
  - More robust error handling
- Respones are now sent as proper replies
- Commands:
  - Added slash commands
  - Deprecated prefixed commands
  - `github` command added
    - Sends the same line preview as GitHub links in regular messages
  - `say` command has been removed
  - `ai` command has been removed
  - Some command outputs may have changed slightly
