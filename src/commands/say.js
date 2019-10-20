module.exports = {
	name: 'say',
	description: 'Let me say something for you...',
	usage: '<message>',
	examples: ['Hi'],
	execute(message, args) {
		if (!args[0]) {
			return
		}
		
		message.delete();

		if (message.mentions.everyone) {
			return message.reply('You can\'t mention everyone!')
		}

		message.channel.send(args.join(' '));
	}
}

