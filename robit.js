const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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
            command: "help",
            reply: "Here are my commands:"
        },
        status: {
            command: "status",
            messages: {
                error: "Error getting the MC 1.19 server status...",
                offline: "*The MC 1.19 server is currently offline*",
                online: "The MC 1.19 server is **online**  -  ",
                players: "**{online}** people are playing!",
                noPlayers: "Nobody is playing"
            }

        },
        ip: {
            command: "ip",
            reply: "The ip for the server: 83.252.125.119:25565"
        },
        rules: {
            command: "rules",
            reply: "**Server Rules:**\n-----------------------------------------------------\n1. Be nice\n----------------------------------------------------"
        },
        staff: {
            command: "staff",
            reply: "**Server Staff - Ask us questions!**\n----------------------------------------------------\n@Wilson#0420\n---------------------------------------------------"
        },
        howjoin: {
            command: "howjoin",
            reply: "**How to join:**\n--------------------------------------\nif you've never played minecraft **Java Edition** before, you'll need that and java: https://www.java.com/en/download/\nThe IP is 81.229.8.57:25565\n--------------------------------------"
        },
        clear: {
            command: "clear",
            secret: true
        },
        runstat: {
            command: "runstat",
            secret: true
        },
        whobest: {
            command: "whoisthebest",
            reply: "You are! <3"
        }
    },
    server: {
        ip: "83.252.125.119", //ip for server
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


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    for (var key in config.commands) {
        if (config.commands.hasOwnProperty(key)) {
            if (interaction.commandName === config.commands[key].command) {
                if (config.commands[key].hasOwnProperty("reply")) {
                    await interaction.reply(
                        config.commands[key].reply
                      );
                }
            }
        }
    }
    if (interaction.commandName === config.commands.status.command) {
        reply_status(interaction)
    }
    else if (interaction.commandName === config.commands.clear.command) {
        clear(interaction.channel)
    }
    else if (interaction.commandName === config.commands.runstat.command) {
        statusupdate(interaction.channel);
    }
  });

// IMPORTANT: You need to run "npm install request" (without quotes) in your terminal before executing this script

async function reply_status(interaction) {
    status_str = await status_string_mcsrv()
    interaction.reply(status_str)
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

async function clear(channel) {
    const fetched = await channel.messages.fetch({limit: 99});
    channel.bulkDelete(fetched);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.login(process.env.TOKEN)
