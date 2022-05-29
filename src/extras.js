import Discord, { MessagePayload } from 'discord.js';

/**
 * @description Calculates the length of a number
 * @param {Number} number Number to get the length of
 * @returns {Number} Length of the number
*/
export function nLength(number) {
  if (typeof number === 'undefined') return 0;
  return Math.ceil(Math.log(number + 1) / Math.LN10);
}

export function embed(title = false, description = false, thumbnail = 'https://himbeer.me/images/logo-monochrome.png', color = false) {
  const msgEmbed = new Discord.MessageEmbed();
  if (title) msgEmbed.setTitle(title);
  if (description) msgEmbed.setDescription(description);
  if (thumbnail) msgEmbed.setThumbnail(thumbnail);
  if (color) msgEmbed.setColor(color);
  else msgEmbed.setColor(Math.floor(Math.random() * 16777215));
  return msgEmbed;
}

export class UnrealEmbed {

  constructor(title = false, description = false, rows = false, dots = '•', maxlength = 2048) { // 2048 to fit into a normal embed's description
    this.title = title;
    this.desc = description;
    this.rows = rows;
    this.dots = dots;
    this.maxlength = maxlength;
  }

  toString() {
    return (this.title ? `**${this.title}**` : '') + (this.desc ? `\n${this.desc}` : '') + (this.rows ? this.rows.map(row => `\n${this.dots} __${row[0]}:__ ${row[1]}`).join('') : '');
  }

  checkLength() {
    if (this.toString().length > this.maxlength) {
      throw new RangeError('This SmallEmbed must not be longer than ${this.maxlength} chars!');
    } else {
      return this;
    }
  }

  setTitle(title) {
    this.title = title;
    return this.checkLength();
  }

  setDescription(description) {
    this.desc = description;
    return this.checkLength();
  }

  addField(name, value) {
    if (!this.rows) this.rows = [];
    this.rows.push([name, value]);
    return this.checkLength();
  }

  setDots(dots) {
    this.dots = dots;
    return this.checkLength();
  }

}

export class SubFields {
  constructor(data = [], dots = '•') { // Example: new extras.SubFields()
    this.data = data;
    this.dots = dots;
  }

  toString() {
    return this.data.map(d => `\n${this.dots} __${d[0]}:__ ${d[1]}`).join('');
  }

  addField(name, value) {
    this.data.push([name, value]);
    return this;
  }
}
