const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(interaction) {
    try {
      await interaction.reply('🏓 Pong!');
    } catch (error) {
      console.error('❌ Error in ping command:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error running this command.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error running this command.', ephemeral: true });
      }
    }
  },
};
