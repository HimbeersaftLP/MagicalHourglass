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