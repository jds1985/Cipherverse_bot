const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Create client with intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection for commands
client.commands = new Collection();
const commands = [];

// Load all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.data) {
    console.warn(`⚠️ Command in ${file} is missing "data" property. Skipping...`);
    continue;
  }
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Register global slash commands
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('🔄 Refreshing application (/) commands globally...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Successfully reloaded global application (/) commands.');
  } catch (error) {
    console.error('❌ Error reloading commands:', error);
  }
})();

// Bot ready event
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Command interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ No command found for ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ There was an error executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
    }
  }
});

// Log in the bot
client.login(process.env.BOT_TOKEN);
