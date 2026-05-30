const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  Events,
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

module.exports = (client) => {

  // =========================
  // CONFIG
  // =========================
  const PANEL_CHANNEL_ID = "1509429804770791494";
  const REALIZATOR_ROLE_ID = "1500930428993933373";

  const CATEGORY_UNTAKEN = "1510410325038727311";
  const CATEGORY_TAKEN = "1510410009853431868";

  const EMOJI = {
    arrow: "<a:arrow:1508094625984811038>",
    ticket: "<:ticket:1501697124734206032>",
    warning: "<:warning:1501693444030992395>",
    lock: "<:lock:1501697222901895258>",
    money: "<a:money:1501685438103031920>"
  };

  const EMBED_COLOR = "#1b2dff";

  const exchangeData = new Map();

  // =========================
  // PANEL
  // =========================
  function menu() {
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("ticket_select")
        .setPlaceholder("🎫 Wybierz kategorię")
        .addOptions([
          { label: "Wymiana", value: "exchange" },
          { label: "Zakup", value: "buy" },
          { label: "Pomoc", value: "help" },
          { label: "Middleman", value: "middleman" }
        ])
    );
  }

  client.once(Events.ClientReady, async () => {
    const ch = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);
    if (!ch) return;

    await ch.send({
      embeds: [
        new EmbedBuilder()
          .setColor(EMBED_COLOR)
          .setTitle(`${EMOJI.ticket} Ticket System`)
          .setDescription("Wybierz opcję poniżej")
      ],
      components: [menu()]
    });

    console.log("Ticket system ready");
  });

  // =========================
  // INTERACTIONS
  // =========================
  client.on(Events.InteractionCreate, async (interaction) => {

    // =========================
    // CREATE TICKET
    // =========================
    if (interaction.isStringSelectMenu() && interaction.customId === "ticket_select") {

      const type = interaction.values[0];

      const existing = interaction.guild.channels.cache.find(c =>
        c.topic?.startsWith(interaction.user.id)
      );

      if (existing) {
        return interaction.reply({
          content: `${EMOJI.warning} Masz już ticket`,
          ephemeral: true
        });
      }

      if (type === "exchange") {

        const modal = new ModalBuilder()
          .setCustomId("exchange_modal")
          .setTitle("Wymiana");

        const amount = new TextInputBuilder()
          .setCustomId("amount")
          .setLabel("Kwota")
          .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(amount));

        return interaction.showModal(modal);
      }

      const channel = await interaction.guild.channels.create({
        name: `${type}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        topic: `${interaction.user.id}:${type}`,
        parent: CATEGORY_UNTAKEN,

        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          },
          {
            id: REALIZATOR_ROLE_ID,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }
        ]
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("take_ticket")
          .setLabel("Przejmij")
          .setStyle(ButtonStyle.Success)
      );

      await channel.send({
        content: `<@&${REALIZATOR_ROLE_ID}>`,
        embeds: [
          new EmbedBuilder()
            .setColor(EMBED_COLOR)
            .setTitle("Nowy ticket")
            .setDescription(`${interaction.user}`)
        ],
        components: [row]
      });

      return interaction.reply({
        content: `Ticket: ${channel}`,
        ephemeral: true
      });
    }

    // =========================
    // TAKE TICKET
    // =========================
    if (interaction.isButton() && interaction.customId === "take_ticket") {

      if (!interaction.member.roles.cache.has(REALIZATOR_ROLE_ID)) {
        return interaction.reply({
          content: "Brak permisji",
          ephemeral: true
        });
      }

      const ch = interaction.channel;

      if (ch.parentId === CATEGORY_TAKEN) {
        return interaction.reply({
          content: "Już przejęty",
          ephemeral: true
        });
      }

      await ch.setParent(CATEGORY_TAKEN);

      const user = interaction.user;
      const topic = ch.topic?.split(":")[0];

      if (topic) {
        await ch.permissionOverwrites.edit(REALIZATOR_ROLE_ID, {
          ViewChannel: true,
          SendMessages: true,
          ManageMessages: true
        });
      }

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle("Ticket przejęty")
        .setDescription(`👤 Przejmujący: ${user}`);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("take_ticket")
          .setLabel("Przejmij")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("Zamknij")
          .setStyle(ButtonStyle.Danger)
      );

      await ch.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        content: `Przejęto przez ${user}`,
        allowedMentions: { users: [] }
      });
    }

    // =========================
    // CLOSE + LOCK + REOPEN
    // =========================
    if (interaction.isButton() && interaction.customId === "close_ticket") {

      if (!interaction.member.roles.cache.has(REALIZATOR_ROLE_ID)) {
        return interaction.reply({
          content: `${EMOJI.warning} tylko realizator`,
          ephemeral: true
        });
      }

      const ch = interaction.channel;
      const topic = ch.topic?.split(":")[0];

      if (topic) {
        await ch.permissionOverwrites.edit(topic, {
          ViewChannel: false,
          SendMessages: false,
          ReadMessageHistory: false
        });
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("reopen_ticket")
          .setLabel("Reopen")
          .setStyle(ButtonStyle.Success)
      );

      await ch.send({
        content: "🔒 Ticket zamknięty",
        components: [row]
      });

      return interaction.reply({
        content: "Zamknięto",
        ephemeral: true
      });
    }

    // =========================
    // REOPEN
    // =========================
    if (interaction.isButton() && interaction.customId === "reopen_ticket") {

      const ch = interaction.channel;
      const topic = ch.topic?.split(":")[0];

      if (topic) {
        await ch.permissionOverwrites.edit(topic, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        });
      }

      await ch.setParent(CATEGORY_UNTAKEN);

      return interaction.reply({
        content: "🔓 Ticket ponownie otwarty"
      });
    }

    // =========================
    // EXCHANGE MODAL (MINIMAL)
    // =========================
    if (interaction.isModalSubmit() && interaction.customId === "exchange_modal") {

      const amount = interaction.fields.getTextInputValue("amount");

      const ch = await interaction.guild.channels.create({
        name: `exchange-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: CATEGORY_UNTAKEN,
        topic: `${interaction.user.id}:exchange`
      });

      await ch.send({
        embeds: [
          new EmbedBuilder()
            .setColor(EMBED_COLOR)
            .setTitle("Exchange ticket")
            .setDescription(`Kwota: ${amount}`)
        ]
      });

      return interaction.reply({
        content: `Ticket: ${ch}`,
        ephemeral: true
      });
    }
  });
};
