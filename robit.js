require('dotenv').config({ path: '/run/secrets/.env' })
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

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
        clear(interaction.channelId)
    }
    else if (interaction.commandName === config.commands.runstat.command) {
        await interaction.reply({ content: 'Runnning auto stats!', ephemeral: true })
        statusupdate(interaction.channelId);
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


async function getembed() {
    return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Server Status')
	.setDescription('Not initialised properly')
	.setThumbnail('https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png')
	.setTimestamp()
}

async function statusupdate(channel_id) {
    var statusEmbed = await getembed()
    console.log(channel_id)
    var statusChannel = await client.channels.fetch(channel_id)
    var st_string = await status_string_mcsrv()
    status_embed = statusEmbed.setDescription(st_string)
    var last_msg = await statusChannel.send({ embeds: [status_embed]})

    while (true) {
        console.log("running stat");
        await sleep(400000)
        try {
            st_string = await status_string_mcsrv()
        } catch(err) {
            console.log(err)
        }
        statusEmbed = await getembed()
        status_embed = statusEmbed.setDescription(st_string).setTimestamp()
        last_msg.edit({ embeds: [status_embed]})
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
