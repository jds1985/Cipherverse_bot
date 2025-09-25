const { SlashCommandBuilder } = require('discord.js');
const ciphers = require('../data/ciphers.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summon')
    .setDescription('Summon a Cipher into the channel')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the Cipher (e.g. dreamweaver, error)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name').toLowerCase();
    const cipher = ciphers[name];

    if (!cipher) {
      await interaction.reply(`❌ No Cipher named **${name}** was found.`);
      return;
    }

    await interaction.reply({
      embeds: [
        {
          title: cipher.name,
          description: `**Rarity:** ${cipher.rarity}\n\n**Lore:** ${cipher.lore}\n\n**Abilities:** ${cipher.abilities.join(', ')}`,
          image: { url: cipher.image },
          color: 0x8A2BE2, // Purple accent
        },
      ],
    });
  },
};
