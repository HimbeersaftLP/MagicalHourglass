module.exports = {
	name: 'makesofe',
	description: 'Generate a random SOFe avatar',
	usage: '[hexcode] [hexcode for background] [rotation in degrees]',
	examples: ['FFEE00 FFFFFF 90'],
	execute(message, args) {
		const hex = args[0] || '63d957';
		const bgHex = args[1] || 'eeeeee';
		const rot = args[2] || 0;

		message.channel.send({
			files: [{
				// Replace # with nothing so SOFe doesn't get confused
				attachment: `https://himbeer.me/sofeavatars/sofeavatar.php?hex=${hex.replace('#', '')}&bghex=${bgHex.replace('#', '')}&rot=${rot}`,
				name: `sofe_${hex.replace('#', '').toUpperCase()}_${bgHex.replace('#', '').toUpperCase()}_${rot}.png`
			}]
		})
	}
}

