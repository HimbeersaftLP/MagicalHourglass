import config from '../../config.js';

/**
 * Get a random Magic 8-Ball response
 * @returns {string}
 */
export function get8BallResponse() {
  const rnd = Math.floor(Math.random() * config.eightball.length);
  return config.eightball[rnd];
}