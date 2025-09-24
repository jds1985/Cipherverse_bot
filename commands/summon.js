const { SlashCommandBuilder } = require('discord.js');
const ciphers = require('../data/ciphers.json'); // Make sure this file exists!

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summon')
    .setDescription('Summon a Cipher into the channel')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the Cipher (example: raven)')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const name = interaction.options.getString('name');
      const cipher = ciphers[name];

      if (!cipher) {
        await interaction.reply({
          content: `❌ No Cipher named **${name}** was found.`,
          ephemeral: true
        });
        return;
      }

      await interaction.reply({
        embeds: [
          {
            title: cipher.name,
            description: `**Rarity:** ${cipher.rarity}`,
            image: { url: cipher.image },
            color: 0x8A2BE2 // purple accent
          }
        ]
      });
    } catch (error) {
      console.error('❌ Error in summon command:', error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error running this command.',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'There was an error running this command.',
          ephemeral: true
        });
      }
    }
  }
};
