const request = require('request-promise');

const config = require('../config.json');

exports.randomHex = function() {
  return Math.floor(Math.random() * 16777215).toString(16);
};

exports.randomRot = function() {
  const rots = [0, 90, 180, 270];
  return rots[Math.floor(Math.random() * rots.length)];
};

exports.generateSessionId = function(message, type = 'full') {
  const date = new Date();

  if (type == 'full') {
  	return `${message.author.id}-${message.channel.id}-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  } else if (type == 'member') {
    return `${message.member.id}-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  }
}

exports.sendLong = async function(text) {
	const max = 2000;

	if (text.length > max) {
		try {
			const url = await request.post({
				url: 'http://ix.io/',
				form: {
				  	'f:1': text
				}
			})

			return url
		} catch (err) {
			console.error(err)
			return `Message is too long to send. (${text.length}/${max} chars)`
		}
	}

	return text
}

exports.hideToken = function(text) {
	return text.replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>')
}