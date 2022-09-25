import defaults from '../defaults.js';

export default {
  'prefix': process.env.PREFIX || defaults.prefix,

  'discordToken': process.env.DISCORDTOKEN || defaults.discordToken,
  'discordApplicationId': process.env.DISCORDAPPLICATIONID || defaults.discordApplicationId,
  'owmId': process.env.OWMID || defaults.owmId,
  'googleKey': process.env.GOOGLEKEY || defaults.googleKey,
  'googleCseId': process.env.GOOGLECSEID || defaults.googleCseId,

  'juiceEmote': process.env.JUICEEMOTE || defaults.juiceEmote,
  'ownerId': process.env.OWNERID || defaults.ownerId,

  'blockedUsers': process.env.BLOCKEDUSERS?.split(',') || defaults.blockedUsers,
};
