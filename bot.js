const config = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

var imgur = require('imgur');
imgur.setClientId(config.imgurtoken);

var S = require('string');

var request = require('request');

var fish = ['🐠','🐟','🐡','🐬','🐳','🐋'];

var firstrun = 1;

client.on('ready', () => {
  client.user.setStatus('online');
  console.log('Everything connected!');
  client.user.setGame('-> ,help <-');
});

client.on('message', message => {
  if (S(message.content).startsWith(config.prefix)) {

    if (message.author.bot) return;

    var cmd = message.content.split(" ")[0];
    cmd = S(cmd).chompLeft(config.prefix).s;
    
    if (config.blocked.includes(cmd)) return;

    console.log('Command ' + cmd + ' has been recieved from ' + message.author.username);

    if(message.guild.id == config.mainguild){
      var juice = message.guild.emojis.get(config.juiceid);
      if(!fish.includes(juice)){
        fish.push(juice);
      }
      message.react(juice);
    }

    var args = message.content.split(" ").slice(1);

    if (cmd == 'randomsofe') {
      var sofehex = Math.floor(Math.random()*16777215).toString(16);
      var sofebghex = Math.floor(Math.random()*16777215).toString(16);
      var rot = getrandrot();
      makesofe(message, sofehex, sofebghex, rot);
    }

    else if (cmd == 'makesofe') {
      if (S(message.content).contains('#')) {
        message.reply("Please don't use #'s or any other symbols for the hex codes in this command!");
      }
      else if (args[0] && args[1] && !args[2]){
        var fhex = args[0];
        var bhex = args[1];
        makesofe(message, fhex, bhex);
      }else if (args[0] && args[1] && args[2]){
        var fhex = args[0];
        var bhex = args[1];
        var rot = args[2];
        makesofe(message, fhex, bhex, rot);
      }

      else{
        message.reply("Usage: ,makesofe <hexcode> <hexcode for background> [rotation in degrees]\nExample: ,makesofe FFEE00 FFFFFF 90");
      }
    }

    else if (cmd == 'say') {
      message.delete();
      message.channel.send(args.join(' '));
    }

    else if (cmd == '8ball') {
      request.get('https://8ball.delegator.com/magic/JSON/' + args.join(' '), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var eball = JSON.parse(body);
          message.reply(eball.magic.answer + '\nType: ' + eball.magic.type);
        }else{
          message.reply('An error occured while accessing the 8ball API!');
        }
        });
    }

    else if (cmd == 'weather') {
      if(!args[0]){
        message.reply('Usage: ,weather <city>\nExample: ,weather London');
        return;
      }
      message.reply('Getting weather from OpenWeatherMap...')
        .then(function(message){
          var todelete = message;
          request.get('http://api.openweathermap.org/data/2.5/weather?APPID=' + config.owmid + '&units=metric&q=' + args[0], function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var w = JSON.parse(body);
              var fahrenheit = (w.main.temp * 9/5 + 32).toFixed(2);
              var mph = (w.wind.speed * 2.23693629205).toFixed(1);
              var wth = new Discord.RichEmbed()
                  .setColor(Math.floor(Math.random()*16777215))
                  .setTitle('Weather for ' + w.name + ', ' + w.sys.country + ':')
                  .setDescription(w.weather[0].main)
                  .setThumbnail('http://openweathermap.org/img/w/' + w.weather[0].icon + ".png")
                  .addField('Weather description', w.weather[0].description)
                  .addField('Temperature', w.main.temp + ' °C / ' + fahrenheit + ' °F')
                  .addField('Wind speed', w.wind.speed + ' meter/sec / ' + mph + ' mph')
                  .addField('Pressure', w.main.pressure + ' hPa')
                  .addField('Humidity', w.main.humidity + ' %')
                  .addField('Cloudiness', w.clouds.all + ' %')
                  .setFooter('Data from OpenWeatherMap', 'https://upload.wikimedia.org/wikipedia/commons/1/15/OpenWeatherMap_logo.png')
              sendAnEmbed(message, wth);
              todelete.delete();
            }else{
              message.reply('An error occured while accessing the OpenWatherMap API!');
              todelete.delete();
            }
          });
        });
    }
    
    else if (cmd == 'cat') {
      request.get('http://random.cat/meow', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var c = JSON.parse(body);
          var cat = new Discord.RichEmbed()
            .setColor(Math.floor(Math.random()*16777215))
            .setTitle("Here's your random cat:")
            .setDescription('Link: [Click Here](' + c.file + ')')
            .setThumbnail(c.file)
            .setFooter('Randomly generated cat link by random.cat');
          sendAnEmbed(message, cat);
        }else{
          message.reply('An error occured while accessing the random.cat API!');
        }
      });
    }
    
    else if (cmd == 'fish') {
      var cfish = fish[Math.floor(Math.random() * fish.length)];
      message.reply('You caught a ' + cfish + '.');
      message.react(cfish);
    }
    
    else if (cmd == 't') {
      message.channel.startTyping();
      request.get('http://api.program-o.com/v2/chatbot/?bot_id=6&format=json&say=' + args.join(' '), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var b = JSON.parse(body);
          message.reply(b.botsay);
        }else{
          message.reply('An error occured while accessing the Program-O API!');
        }
        message.channel.stopTyping();
      });
    }

    else if (cmd == 'help') {
      message.reply('Sent you a DM!');
      var help = new Discord.RichEmbed()
        .setColor(Math.floor(Math.random()*16777215))
        .setTitle('Help for MagicalHourglass:')
        .setDescription('Commands:')
        .setThumbnail('https://himbeer.me/images/logo-monochrome.png')
        .addField(',randomsofe', 'Generate a random SOFe avatar')
        .addField(',makesofe', 'Usage: ,makesofe <hexcode> <hexcode for background> [rotation in degrees]\nExample: ,makesofe FFEE00 FFFFFF 90')
        .addField(',say', 'Let me say something for you...\nExample: ,say Hi')
        .addField(',8ball', 'Uses 8ball.delegator.com  to ask the magic 8-Ball for a question\nExample: ,8ball Am I great?')
        .addField(',weather', 'Get the current weather of a specific city from OpenWeatherMap\nUsage: ,weather <city>\nExample: ,weather London')
        .addField(',cat', 'Get a random cat image from random.cat')
        .addField(',fish', 'Go fishing!')
        .addField(',t', 'Talk with Program-O...\nUsage: ,t <Your message>\nExample: ,t How are you?');
      message.author.send("", { embed: help });
    }

    else{
      if(message.guild.id == config.mainguild){
        message.react('❌');
      }
    }
    
    fish = ['🐠','🐟','🐡','🐬','🐳','🐋'];

  }
});

if(firstrun == 1){
  client.login(config.discordtoken);
  firstrun = 0;
}else{
  console.log("Not logging in again for preventing bot token reset!"); // TODO: Fix the actual problem
}

function sendAnEmbed(message, embed){
  message.channel.send("", { embed: embed });
}

function getrandrot() {
    $rand = Math.floor((Math.random() * 4) + 1);
    if ($rand == 1) {
        return 0;
    } else if ($rand == 2) {
        return 90;
    } else if ($rand == 3) {
        return 180;
    } else if ($rand == 4) {
        return 270;
    }
}

function makesofe(message, hex, bghex, rot = 0){
  var sofe = 'https://himbeer.me/sofeavatars/sofeavatar.php?hex=' + hex + '&bghex=' + bghex + '&rot=' + rot;
  imgur.uploadUrl(sofe)
    .then(function (json) {
      var soflink = json.data.link;
      console.log('Imgur link: ' + soflink);
      var sofembed = new Discord.RichEmbed()
        .setColor(parseInt(hex, 16))
        .setTitle('Your SOFe avatar has been generated!')
        .setDescription(sofe)
        .setThumbnail(soflink);
      message.channel.sendEmbed(sofembed);
    })
    .catch(function (err) {
      console.error('Imgur upload error: ' + err.message);
      message.reply("Couldn't upload image to imgur, here's a direct link: " + sofe);
    });
}
