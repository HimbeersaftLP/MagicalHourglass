const utils = require('../utils');

module.exports = {
	name: 'randomsofe',
	description: 'Generate a random SOFe avatar',
	execute(message, args) {
    const hex = utils.randomHex();
    const bgHex = utils.randomHex();
    const rot = utils.randomRot();

		message.channel.send({
			files: [{
        attachment: `https://himbeer.me/sofeavatars/sofeavatar.php?hex=${hex}&bghex=${bgHex}&rot=${rot}`,
        name: `sofe_${hex.toUpperCase()}_${bgHex.toUpperCase()}_${rot}.png`
      }]
		})
	}
}