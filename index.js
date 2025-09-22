const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Load commands from ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '❌ There was an error executing this command.',
      ephemeral: true
    });
  }
});

// Handle simple message-based commands (like !ping)
client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  }
});

client.login(process.env.BOT_TOKEN);
