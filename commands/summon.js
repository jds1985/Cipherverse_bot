const { SlashCommandBuilder } = require('discord.js');
const ciphers = require('../data/ciphers.json'); // adjust path if needed

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summon')
    .setDescription('Summon a Cipher into the channel')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the Cipher (example: "Error")')
        .setRequired(true)
    ),
    
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const cipher = ciphers[name];

    if (!cipher) {
      await interaction.reply(`❌ No Cipher named "${name}" found.`);
      return;
    }

    await interaction.reply({
      embeds: [{
        title: cipher.name,
        description: `**Rarity:** ${cipher.rarity}`,
        image: { url: cipher.image },
        color: 0x8A2BE2 // Purple accent
      }]
    });
  },
};
