const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Create client with Guilds intent
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands collection
client.commands = new Collection();
const commands = [];

// Load command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Check environment variables
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Missing one of the required environment variables: BOT_TOKEN, CLIENT_ID, or GUILD_ID");
  process.exit(1); // stop app so you know
}

// Register slash commands (guild-specific)
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('🔄 Refreshing guild (/) commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Successfully reloaded guild (/) commands.');
  } catch (error) {
    console.error("❌ Error reloading commands:", error);
  }
})();

// Bot is ready
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
    await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
  }
});

// Login
client.login(BOT_TOKEN);
