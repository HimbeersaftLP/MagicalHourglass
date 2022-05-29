import config from '../../config.js';

const fishList = [config.juiceEmote, '🐠', '🐟', '🐡', '🐬', '🐳', '🐋'];

/**
 * Get a message with a random fish emoji
 * @returns {string}
 */
export function getFish() {
  const fish = fishList[Math.floor(Math.random() * fishList.length)];
  return 'You caught a ' + fish + '.';
}