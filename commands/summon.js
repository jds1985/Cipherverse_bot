const ciphers = require('../data/ciphers.json');

module.exports = {
  name: 'summon',
  description: 'Summon a Cipher into the channel',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'The name of the Cipher (e.g. dreamweaver, error)',
      required: true,
    },
  ],
  execute: async (interaction) => {
    const name = interaction.options.getString('name').toLowerCase();
    const cipher = ciphers[name];

    if (!cipher) {
      await interaction.reply(`❌ No Cipher named **${name}** found.`);
      return;
    }

    await interaction.reply({
      embeds: [{
        title: cipher.name,
        description: `**Rarity:** ${cipher.rarity}\n\n${cipher.lore}\n\n**Abilities:**\n- ${cipher.abilities.join("\n- ")}`,
        image: { url: cipher.image },
        color: 0x8A2BE2 // Purple accent
      }]
    });
  }
};
