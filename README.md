# MagicalHourglass

A Discord bot for the BoxOfDevs Discord

## Changelog for version 2

- Complete refactoring
  - Use `node-fetch` instead of `request`
  - Organise code into classes
- GitHub line preview messages are now sent as reply to the message with the link
- Commands:
  - Added slash commands
  - Deprecated prefixed commands
  - `github` command added
    - Sends the same line preview as GitHub links in regular messages
  - `say` command has been removed
  - `ai` command has been removed
  - Some command outputs may have changed slightly
