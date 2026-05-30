const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require('discord.js');

module.exports = (client) => {

  const PANEL_CHANNEL_ID = "1499519935657935049";
  const OPINIE_CHANNEL_ID = "1499519935657935049";

  let panelMessage = null;

  // =====================
  // GWIAZDKI
  // =====================
  function stars(num) {
    return "⭐".repeat(num);
  }

  // =====================
  // PANEL
  // =====================
  async function sendPanel() {
    try {
      const channel = await client.channels.fetch(PANEL_CHANNEL_ID);
      if (!channel) return console.log("❌ Nie znaleziono kanału opinii.");

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('🌟 StarX Exchange » WYSTAW OPINIĘ')
        .setDescription(
`» Wystawiając nam opinię pokazujesz innym, co zadowoliło Cię u nas.

» Będziemy mega wdzięczni za wystawienie nam opinii.

» Opinię napiszesz klikając przycisk poniżej.`
        )
        .setFooter({ text: '© 2026 StarX Exchange x Wystaw Opinię' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('wystaw_opinie')
          .setLabel('Kliknij, aby wystawić opinię!')
          .setEmoji('💙')
          .setStyle(ButtonStyle.Primary)
      );

      panelMessage = await channel.send({
        embeds: [embed],
        components: [row]
      });

      console.log("✅ Panel opinii wysłany.");

    } catch (err) {
      console.log("❌ Błąd panelu:", err);
    }
  }

  // =====================
  // READY
  // =====================
  client.on(Events.ClientReady, async () => {
    setTimeout(async () => {
      await sendPanel();
    }, 3000);
  });

  // =====================
  // INTERACTION
  // =====================
  client.on(Events.InteractionCreate, async interaction => {

    // BUTTON
    if (interaction.isButton()) {
      if (interaction.customId === "wystaw_opinie") {

        const modal = new ModalBuilder()
          .setCustomId('opinia_modal')
          .setTitle('Wystaw opinię');

        modal.addComponents(

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('tresc')
              .setLabel('Treść opinii')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('poprawic')
              .setLabel('Co można byłoby poprawić?')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('czas')
              .setLabel('Czas realizacji 1-5')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),

          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('przebieg')
              .setLabel('Przebieg transakcji 1-5')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )

        );

        return interaction.showModal(modal);
      }
    }

    // MODAL
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "opinia_modal") {

        const tresc = interaction.fields.getTextInputValue('tresc');

        let poprawic = "Nic";
        try {
          poprawic = interaction.fields.getTextInputValue('poprawic') || "Nic";
        } catch {}

        const czas = Math.max(
          1,
          Math.min(5, parseInt(interaction.fields.getTextInputValue('czas')) || 1)
        );

        const przebieg = Math.max(
          1,
          Math.min(5, parseInt(interaction.fields.getTextInputValue('przebieg')) || 1)
        );

        const laczna = Math.round((czas + przebieg) / 2);

        const channel = await client.channels.fetch(OPINIE_CHANNEL_ID);

        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('🌟 StarX Exchange » OPINIA')
          .setDescription(
`👤 **Twórca opinii:** ${interaction.user}

📝 **Treść:** ${tresc}

🛠️ **Co można poprawić:** ${poprawic}

🕒 **Czas realizacji:** ${stars(czas)}

💸 **Przebieg transakcji:** ${stars(przebieg)}

🏆 **Łączna opinia:** ${stars(laczna)}`
          )
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: '© 2026 StarX Exchange x Opinie Klientów' });

        await channel.send({
          embeds: [embed]
        });

        // usuń stary panel
        if (panelMessage) {
          await panelMessage.delete().catch(() => {});
        }

        // nowy panel
        await sendPanel();

        await interaction.reply({
          content: "✅ Dziękujemy za opinię!",
          ephemeral: true
        });
      }
    }

  });

};