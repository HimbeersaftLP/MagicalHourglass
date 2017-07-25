const config = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

var imgur = require('imgur');
imgur.setClientId(config.imgurtoken);

var S = require('string');

var request = require('request');

var fish = ['🐠','🐟','🐡','🐬','🐳','🐋'];

var firstrun = 1;

var readyspam = 0;

client.on('ready', () => {
  client.user.setStatus('online');
  console.log('Everything connected!');
  client.user.setGame('-> ,help <-');
  if(readyspam == 0){
    readyspam = 1;
    setTimeout(function(){
      readyspam = 0;
    }, 3000);
  }else{
    console.error("Stopping due to client-ready spam, please restart the bot!");
    process.exit(0);
  }
});

client.on('message', message => {
  if (S(message.content).startsWith(config.prefix)) {

    if (message.author.bot) return;
    if (config.blockedusers.includes(message.author.id)) return;

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
        }
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
    
    else if (cmd == 'whoami') {
      sendAnEmbed(message, whois(message.author, false));
    }
    
    else if (cmd == 'whois') {
      if(message.mentions.members.first() != undefined){
        sendAnEmbed(message, whois(message.mentions.members.first().user));
      }else{
        message.reply('Member not found!\nCommand Usage: ,whois @mentionOfaUser');
      }
    }
    
    else if (cmd == 'eval') {
      if(message.author.id == config.ownerid){
        message.channel.send(eval(args.join(' ')));
      } else {
        message.reply("You ain't doing that!");
      }
    }

    else if (cmd == 'googlepic') {
      if(!args[0]) {
        message.reply('Usage: ,googlepic <search term>');
      } else {
      var oargs = JSON.parse(JSON.stringify(args));
      if(args[args.length-2] == "-r" && !isNaN(args[args.length-1])) {
        args.splice(args.length - 2, 2);
      }
      request.get('https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(args.join(' ')) + '&cx=' + config.google_cse_id + '&searchType=image&fields=items(image%2FcontextLink%2Clink%2Ctitle)%2CsearchInformation&safe=medium&key=' + config.googlekey, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var g = JSON.parse(body);
          if(oargs[oargs.length-2] == "-r" && !isNaN(oargs[oargs.length-1])) {
            var ri = Math.floor(Number(oargs[oargs.length-1]));
            if(ri <=0 || ri > g.items.length){
              ri = 0;
              message.reply('This result index is invalid!');
            } else {
             ri = ri - 1;
            }
          } else { ri = 0; }
          var gres = new Discord.RichEmbed()
            .setColor(Math.floor(Math.random()*16777215))
            .setTitle('#' + (ri + 1).toString() + ' Result: ' + g.items[ri].title)
            .setDescription('Image URL: ' + g.items[ri].link + '\nImage from: ' + g.items[ri].image.contextLink + '\n\nResult ' + (ri + 1).toString() + ' of ' + g.items.length.toString() + ' loaded results.\n,googlepic <search term> -r <number> to see the other results.')
            .setImage(g.items[ri].link);
          message.reply(g.searchInformation.formattedTotalResults + ' results in ' + g.searchInformation.formattedSearchTime + ' seconds:', {embed : gres});
        }else{
          message.reply('An error occured while accessing the Google Custom Search API!');
        }
      });
      }
    }

    else if (cmd == 'poggit') {
      if(!args[0]){
        message.reply('Usage: ,poggit <plugin name>');
      }else{
        request.get('https://poggit.pmmp.io/releases.json?name=' + args[0], function (error, response, body) {
          if (!error && response.statusCode == 200) {
            if(body == '[]'){
              message.reply('Error: Plugin not found!');
            }else{
              var pl = JSON.parse(body)[0];
              var pinfo = new Discord.RichEmbed()
              .setColor(Math.floor(Math.random()*16777215))
              .setTitle(pl.name + ' (' + pl.state_name + '):')
              .setDescription(pl.tagline + '\n\nVersion: ' + pl.version + '\nDownloads: ' + pl.downloads + '\nBuild: '+ pl.build_number + '\nGitHub: https://github.com/' + pl.repo_name + '\nDownload: ' + pl.artifact_url + '\nFor APIs: ' + pl.api[0].from + ' - ' + pl.api[0].to + '\nLicense: ' + pl.license)
              .setThumbnail(pl.icon_url)
              .setTimestamp(new Date(pl.submission_date*1000))
              .setURL(pl.html_url)
              .setFooter('Data from poggit.pmmp.io', 'https://avatars7.githubusercontent.com/u/22367352?v=4&s=50');
              sendAnEmbed(message, pinfo);
            }
          }else{
            message.reply('An error occured while accessing the Poggit API!');
          }
        });
      }
    }

    else if (cmd == 'channels'){
      if(!args[0]){
        message.reply('Usage: ,channels <text|voice>');
      }else{
        var clist = "";
        message.guild.channels.array().forEach(function(e, i, a){
          if(e.type==args[0]){
            clist += " " + e.toString();
          }
        });
        if(clist == "") clist = 'No channels of this type were found';
        message.reply(clist);
      }
    }

    else if (cmd == 'chuck') {
      request.get('https://api.chucknorris.io/jokes/random', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var cn = JSON.parse(body);
          var cj= new Discord.RichEmbed()
            .setColor(Math.floor(Math.random()*16777215))
            .setTitle('Your Chuck Norris fact, fresh from chucknorris.io:')
            .setDescription(cn.value)
            .setThumbnail(cn.icon_url)
            .setURL(cn.url)
            .setFooter('Fact from api.chucknorris.io', 'https://assets.chucknorris.host/img/chucknorris_logo_coloured_small@2x.png');
          sendAnEmbed(message, cj);
        }else{
          message.reply("You can't access the Chuck Norris API, the Chuck Norris API accesses you!");
        }
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
        .addField(',t', 'Talk with Program-O...\nUsage: ,t <Your message>\nExample: ,t How are you?')
        .addField(',whoami', 'Get information about yourself.')
        .addField(',whois', 'Get information about another member.\nUsage: ,whois @mentionOfaUser\nExample: ,whois @HimbeersaftLP#8553')
        .addField(',googlepic', 'Search Google for images.\nUsage: ,googlepic <search term>\nExample: ,googlepic boxofdevs team')
        .addField(',poggit', 'Search for a plugin release on Poggit.\nUsage: ,poggit <plugin name>\nExample: ,poggit DevTools')
        .addField(',channels', 'Shows a list of channels of the provided type.\nUsage: ,channel <text|voice>')
        .addField(',chuck', 'Get a random Chuck Norris fact from api.chucknorris.io.');
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
  client.login(config.discordtoken)
    .then(function(r){
      console.log("Login successful! " + r);
    })
    .catch(function(r){
      console.error("Login not successful! " + r);
    });
  firstrun = 0;
}else{
  console.log("Not logging in again for preventing bot token reset!");
}

function sendAnEmbed(message, embed){
  message.channel.send("", { embed: embed });
}

function whois(m, mtn = true){
  var emb =  new Discord.RichEmbed()
        .setColor(Math.floor(Math.random()*16777215))
        .setTitle('Information about the user ' + m.username + ':')
        .addField('Username', m.username)
        .addField('ID', m.id)
        .addField('Discord Tag', m.tag)
        .addField('Avatar URL', m.displayAvatarURL)
        .addField('Created at', m.createdAt)
        .addField('Bot?', m.bot);
        if(m.presence.game != null){
          emb.addField('Game', m.presence.game.name);
        }else{
          emb.addField('Game', 'None');
        }
        emb.addField('Status', m.presence.status);
        if(m.lastMessage != null && mtn == true){
          emb.addField('Last Message', m.lastMessage.cleanContent);
        }else if(mtn == true){
          emb.addField('Last Message', 'Not found');
        }
        emb.setThumbnail(m.displayAvatarURL);
        return emb;
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
