exports.randomHex = function() {
	return Math.floor(Math.random() * 16777215).toString(16);
}

exports.randomRot = function() {
  const rots = [0, 90, 180, 270]
  return rots[Math.floor(Math.random() * rots.length)];
}