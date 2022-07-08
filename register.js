require('dotenv').config({ path: '/run/secrets/.env' })
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const commands = [
    {
        name: "help",
        description: "See the list of commands",
    },
    {
        name: "status",
        description: "Return the current status of the server",
    },
    {
        name: "ip",
        description: "Show the IP of the server",
    },
    {
        name: "rules",
        description: "Show the rules of the server",
    },
    {
        name: "staff",
        description: "Show the staff members of the server",
    },
    {
        name: "howjoin",
        description: "Show the help for how to join the server",
    },
    {
        name: "clear",
        description: "Clear the channel",
    },
    {
        name: "runstat",
        description: "Run the status updater",
    },
    {
        name: "wilson",
        description: "Who is wilson?",
    },
    {
        name: "whoisthebest",
        description: "Who is the best",
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.APP_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();