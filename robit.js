const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })

    client.user.setActivity("Minecraft")
})

// Server status code
const request = require("request-promise");
const config = {
    commands: {
        help: {
            command: ".help",
            reply: "Here are my commands:"
        },
        status: {
            command: ".status",
            messages: {
                error: "Error getting the MC 1.17 server status...",
                offline: "*The MC 1.17 server is currently offline*",
                online: "The MC 1.17 server is **online**  -  ",
                players: "**{online}** people are playing!",
                noPlayers: "Nobody is playing"
            }

        },
        ip: {
            command: ".ip",
            reply: "The ip for the server: 81.229.8.57:25565"
        },
        rules: {
            command: ".rules",
            reply: "**Server Rules:**\n-----------------------------------------------------\n1. Be nice\n2. \n3. Don't steal in general\n----------------------------------------------------"
        },
        staff: {
            command: ".staff",
            reply: "**Server Staff - Ask us questions!**\n----------------------------------------------------\n@Wilson#0420\n---------------------------------------------------"
        },
        howjoin: {
            command: ".howjoin",
            reply: "**How to join:**\n--------------------------------------\nif you've never played minecraft **Java Edition** before, you'll need that and java: https://www.java.com/en/download/\nThe IP is 81.229.8.57:25565\n--------------------------------------"
        },
        clear: {
            command: ".clear",
            secret: true
        },
        runstat: {
            command: ".runstat",
            secret: true
        },
        wilson: {
            command: ".wilson",
            secret: true
        },
        whobest: {
            command: ".who is the best",
        }
    },
    server: {
        ip: "81.229.8.57", //ip for server
        port: 25565 //port
    }
};

for (key in config.commands) {
    command = config.commands[key];
    if (command.hasOwnProperty("secret") && command["secret"]) {
        continue;
    }
    config.commands.help.reply = config.commands.help.reply.concat("\n", command.command);
}

// IMPORTANT: You need to run "npm install request" (without quotes) in your terminal before executing this script

client.on('message', message => {
    if (message.author == client.user) {
        return
    }
    for (var key in config.commands) {
        if (config.commands.hasOwnProperty(key)) {
            if (message.content === config.commands[key].command) {
                if (config.commands[key].hasOwnProperty("reply")) {
                    message.reply(config.commands[key].reply);
                }
                if (config.commands[key].hasOwnProperty("react")) {
                    message.react(config.commands[key].react);
                }
            }
        }
    }
    if (message.content === config.commands.status.command) {
        reply_status(message)
    }
    else if (message.content === config.commands.clear.command) {
        clear(message.channel)
    }
    else if (message.content === config.commands.runstat.command) {
        statusupdate(message.channel);
    }
    else if (message.content === config.commands.whobest.command) {
        react_wholesome(message)
    }
    else if (message.content === config.commands.wilson.command) {
        react_wilson(message)
    }
});
// Credit to The MG#8238 on Discord for improvements to this script

async function reply_status(message) {
    status = await status_string_mcsrv()
    message.reply(status)
}

async function status_string_mcsrv() {
    let url = 'https://api.mcsrvstat.us/2/' + config.server.ip + ':' + config.server.port;
    result = await request(url)
    if(result.error) {
        console.error(result.error);
        return config.commands.status.messages.error;
    }
    result = JSON.parse(result)
    var status = config.commands.status.messages.offline;
    if (result.online) {
        status = config.commands.status.messages.online;
        result.players.online != 0 ? status += config.commands.status.messages.players : status += config.commands.status.messages.noPlayers;
        status = status.replace("{online}", result.players.online);
    }
    return status;
}

async function statusupdate(channel) {
    const statusEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Server Status')
	.setDescription('Not initialised properly')
	.setThumbnail('https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png')
	.setTimestamp()
    var statusChannel = channel // Replace with known channel ID
    var st_string = await status_string_mcsrv()
    status = statusEmbed.setDescription(st_string)
    var last_msg = await statusChannel.send(status)
    while (true) {
        console.log("running stat");
        await sleep(400000)
        try {
            st_string = await status_string_mcsrv()
        } catch(err) {
            console.log(err)
        }
        status = statusEmbed.setDescription(st_string).setTimestamp()
        last_msg.edit(status)
    }
}

async function react_wholesome(message) {
    try {
		await message.react("🇾");
		await message.react("🇴");
		await message.react("🇺");
        await message.react("💖");
        await message.react("🇦");
		await message.react("🇷");
		await message.react("🇪");
	} catch (error) {
		console.error('One of the emojis failed to react.');
        console.log(error)
	}
}

async function react_wilson(message) {
    try {
		await message.react("🇼");
		await message.react("🇮");
		await message.react("🇱");
        await message.react("🇸");
		await message.react("🇴");
		await message.react("🇳");
	} catch (error) {
		console.error('One of the emojis failed to react.');
        console.log(error)
	}
}

async function clear(channel) {
    const fetched = await channel.messages.fetch({limit: 99});
    channel.bulkDelete(fetched);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

bot_secret_token = ""

client.login(bot_secret_token)
