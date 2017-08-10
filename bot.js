const config = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

var imgur = require('imgur');
imgur.setClientId(config.imgurtoken);

var S = require('string');
const removeMd = require('remove-markdown');

var request = require('request');

var apiai = require('apiai');
var ai = apiai(config.apiai_token);

const util = require('util')

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
      getweather(args[0], message);
    }
    
    else if (cmd == 'cat') {
      getcat(message);
    }
    
    else if (cmd == 'fish') {
      var cfish = fish[Math.floor(Math.random() * fish.length)];
      message.reply('You caught a ' + cfish + '.');
      message.react(cfish);
    }
    
    else if (cmd == 't') {
      message.channel.startTyping();
      request.get('http://api.program-o.com/v2/chatbot/?bot_id=6&format=json&say=' + encodeURIComponent(args.join(' ')) + '&convo_id=' + gsessionid(message), function (error, response, body) {
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
      sendAnEmbed(message, whois(message.member, false));
    }
    
    else if (cmd == 'whois') {
      if(message.mentions.members.first() != undefined){
        sendAnEmbed(message, whois(message.mentions.members.first()));
      }else{
        message.reply('Member not found!\nCommand Usage: ,whois @mentionOfaUser');
      }
    }
    
    else if (cmd == 'eval') {
      if(message.author.id == config.ownerid){
        try {
          var evaled = eval(args.join(' '));
          if (evaled !== null && typeof evaled === 'object') {
            var mtd = message.channel.send(sendLong("\`\`\`\n" + util.inspect(evaled).replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + "\n\`\`\`", 1992, 2000));
          }else if(typeof evaled === "undefined"){
            var mtd = message.channel.send("\`\`\`\n" + undefined + "\n\`\`\`");
          }else{
            var mtd = message.channel.send(sendLong("\`\`\`\n" + evaled.toString().replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + "\n\`\`\`", 1992, 2000));
          }
          mtd.then(function(msg){
            if(typeof evaled !== 'undefined'){
              if(typeof evaled.then == 'function') {
                msg.delete(10000);
              }
            }
          });
        } catch (err) {
          if (err !== null && typeof err === 'object') {
            err = util.inspect(err);
          }
          message.channel.send(":x: Error!\n\`\`\`\n" + err.replace(config.discordtoken, '<TOKEN HAS BEEN HIDDEN>') + "\n\`\`\`").then(function(msg){
            msg.delete(10000);
          });
        }
      } else {
        message.reply("You ain't doing that!");
      }
    }

    else if (cmd == 'reboot') {
      if(message.author.id == config.ownerid){
        message.reply('Restarting!').then(function(){
          console.log('Restarted by ' + message.author.username);
          process.exit(0);
        });
        message.reply('Restarting!');
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
          var ri = oargs[oargs.length-1];
        } else {
          ri = 1;
        }
        googlepic(args.join(' '), message, ri);
      }
    }

    else if (cmd == 'poggit') {
      if(!args[0]){
        message.reply('Usage: ,poggit <plugin name>');
      }else{
        searchpoggit(args[0], message);
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
      getchuck(message);
    }

    else if (cmd == 'ai') {
      var air = ai.textRequest(args.join(' '), {
        sessionId: gsessionid(message, "member")
      });

      air.on('response', function(r) {
        message.reply(r.result.fulfillment.speech);
        if(!r.result.actionIncomplete){
          switch(r.result.action){
            case "web.search":
              switch(r.result.parameters.engine){
                case "Google Images":
                  googlepic(r.result.parameters.q, message);
                  break;
                case "Poggit":
                  searchpoggit(r.result.parameters.q, message);
                  break;
                default:
                  break;
              }
              break;
            case "weather":
              getweather(r.result.parameters['geo-city'], message);
              break;
            case "give":
              switch(r.result.parameters.item){
                case "random SOFe":
                  var sofehex = Math.floor(Math.random()*16777215).toString(16);
                  var sofebghex = Math.floor(Math.random()*16777215).toString(16);
                  var rot = getrandrot();
                  makesofe(message, sofehex, sofebghex, rot);
                  break;
                case "Chuck Norris fact":
                  getchuck(message);
                  break;
                case "cat":
                  getcat(message);
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
        }
      });
       
      air.on('error', function(e) {
        console.log(e);
        message.reply("An error occured while accessing the api.ai API!");
      });
       
      air.end();
    }

    else if (cmd == 'issue') {
      var repo; var number;
      if(message.guild.id == '287339519500353537' && !args[1]){
        if(!args[0]){
          message.reply('Usage: ,issue <number> or ,issue <repo> <number>\nExample: ,issue boxofdevs/commandshop 2');
          return;
        }
        repo = 'pmmp/pocketmine-mp';
        number = args[0];
      }else{
        if(!args[1]){
          message.reply('Usage: ,issue <repo> <number>\nExample: ,issue boxofdevs/commandshop 2');
          return;
        }
        repo = args[0];
        number = args[1];
      }
      if(isNaN(number)){
        message.reply('Usage: ,issue <repo> **<number>**\nExample: ,issue boxofdevs/commandshop **2**');
      }else{
        gitIssue(repo, Math.floor(number), message);
      }
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
        .addField(',weather', 'Get the current weather of a specific cifm OpenWeatherMap\nUsage: ,weather <city>\nExample: ,weather London')
        .addField(',cat', 'Get a random cat image from random.cat')
        .addField(',fish', 'Go fishing!')
        .addField(',t', 'Talk with Program-O...\nUsage: ,t <Your message>\nExample: ,t How are you?')
        .addField(',whoami', 'Get information about yourself.')
        .addField(',whois', 'Get information about another member.\nUsage: ,whois @mentionOfaUser\nExample: ,whois @HimbeersaftLP#8553')
        .addField(',googlepic', 'Search Google for images.\nUsage: ,googlepic <search term>\nExample: ,googlepic boxofdevs team')
        .addField(',poggit', 'Search for a plugin release on Poggit.\nUsage: ,poggit <plugin name>\nExample: ,poggit DevTools')
        .addField(',channels', 'Shows a list of channels of the provided type.\nUsage: ,channel <text|voice>')
        .addField(',chuck', 'Get a random Chuck Norris fact from api.chucknorris.io.')
        .addField(',ai', 'Let the AI execute commands, just try it!')
        .addField(',issue', 'Find an issue on GitHub.\nUsage: ,issue <repo> <number> (on PMMP Discord also ,issue <number> for the PMMP repo)\nExample: ,issue boxofdevs/commandshop 2');
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

function sendLong(text, max = 2000, limintext = max){
  if(text.length > max){
    return 'Message is too long to send (' + text.length + ' of ' + limintext + ' chars)';
  }else{
    return text;
  }
}

var alphabet = 'abcdefghijklmnopqrstuvwxyz';
function reactionPoll(choices, message) {
  var i = 0;
  var fr = 0;
  while (i < choices) {
    if (i === 0) {
      fr = message.react(alphabet[i]);
    } else {
      fr = fr.then(function() {
        message.react(alphabet[i]);
      });
    }
    i += 1;
  }
}

function gsessionid(message, type = "full"){
  var date = new Date();
  if(type == "full"){
    return message.author.id + '-' + message.channel.id + '-' + date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
  }else if(type == "member"){
    return message.member.id + '-' + date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
  }
}

function getweather(q, message){
  request.get('http://api.openweathermap.org/data/2.5/weather?APPID=' + config.owmid + '&units=metric&q=' + q, function (error, response, body) {
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
    }else{
      message.reply('City not found or an error occured while accessing the OpenWatherMap API!');
    }
  });
}

function getcat(message){
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

function googlepic(q, message, r = 1){
  request.get('https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(q) + '&cx=' + config.google_cse_id + '&searchType=image&fields=items(image%2FcontextLink%2Clink%2Ctitle)%2CsearchInformation&safe=medium&key=' + config.googlekey, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var g = JSON.parse(body);
      var ri = Math.floor(Number(r));
      if(ri <=0 || ri > g.items.length){
        ri = 0;
        message.reply('This result index is invalid!');
      } else {
        ri = ri - 1;
      }
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

function searchpoggit(plugin, message){
  request.get('https://poggit.pmmp.io/releases.json?name=' + plugin, function (error, response, body) {
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

function getchuck(message){
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

function gitIssue(repo, number, message){
  request.get({
    url: 'https://api.github.com/repos/' + repo + '/issues/' + encodeURIComponent(number),
    headers: {
      'User-Agent': 'MagicalHourglass',
      'Accept': 'application/vnd.github.squirrel-girl-preview'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var g = JSON.parse(body);
      var ilabels = "";
      g.labels.forEach(function(label, i){
        ilabels += label.name + ((i !== g.labels.length-1) ? ', ' : "");
      });
      var gissue = new Discord.RichEmbed()
        .setColor(Math.floor(Math.random()*16777215))
        .setTitle(((typeof g.pull_request == "undefined") ? 'Issue' : 'Pull request') + ' #' + number + ': ' + g.title)
        .addField('Information:', '__Created by__ ' + g.user.login + '\n__State:__ ' + g.state + '\n__Labels:__ ' + ((g.labels !== []) ? ilabels : 'none') + '\n__Comments:__ ' + g.comments + '\n__Locked:__ ' + g.locked + '\n__Reactions:__\n' + g.reactions['+1'] + ' 👍 | ' + g.reactions['-1'] + ' 👎 | ' + g.reactions.laugh + ' 😄 | ' + g.reactions.confused + ' 😕 | ' + g.reactions.heart + ' ❤️ | ' + g.reactions.hooray + ' 🎉')
        .setThumbnail(g.user.avatar_url)
        .setTimestamp(new Date(g.created_at))
        .setURL(g.html_url)
        .setFooter('Data from api.github.com', 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png');
      if(removeMd(g.body).length > 2045){
        gissue.addField('Notice:', 'The Description has been shortened to fit into an embed');
        gissue.setDescription((removeMd(g.body).substring(0, 2045)) + '...');
      }else{
        gissue.setDescription(removeMd(g.body));
      }
      sendAnEmbed(message, gissue);
    }else{
      message.reply('An error occured while accessing the GitHub API' + ((JSON.parse(body).message === "Not Found") ? ': Repo or issue not found!' : '!'));
    }
  });
}

function whois(member, mtn = true){
  var m = member.user;
  var rls = "";
  member.roles.array().forEach(function(r) {
    rls += r.name + ', ';
  });
message.channel.send(rls);
  var emb =  new Discord.RichEmbed()
        .setColor(Math.floor(Math.random()*16777215))
        .setTitle('Information about the user ' + m.username + ':')
        .addField('Username', m.username)
        .addField('ID', m.id)
        .addField('Discord Tag', m.tag)
        .addField('Avatar URL', m.displayAvatarURL)
        .addField('Created at', m.createdAt)
        .addField('Bot?', m.bot)
        .addField('Roles', rls);
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
