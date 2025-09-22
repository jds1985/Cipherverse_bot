const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Slash command setup
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Refreshing application (/) commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
})();

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong! (via Slash Command)');
  }
});

// Handle prefix commands
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    await message.reply('🏓 Pong! (via Prefix Command)');
  }
});

client.login(process.env.BOT_TOKEN);
