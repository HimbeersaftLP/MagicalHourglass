const Discord = require('discord.js');

(function() {

  module.exports.embed = function(title = false, description = false, thumbnail = 'https://himbeer.me/images/logo-monochrome.png', color = false) {
    var embed = new Discord.RichEmbed();
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (color) embed.setColor(color)
    else embed.setColor(Math.floor(Math.random() * 16777215));
    return embed;
  }

  module.exports.UnrealEmbed = class UnrealEmbed {

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

    setDesc(description) {
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

  module.exports.SubFields = class SubFields {
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
}());
