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

  // =========================================
  // CONFIG
  // =========================================
  const PANEL_CHANNEL_ID = "1509429804770791494";
  const REALIZATOR_ROLE_ID = "1500930428993933373";
  const CLIENT_ROLE_ID = "1499572498604363918";
  // Kanał, na którym klient ma wystawić legit checka / dostać ping
  const LEGIT_CHECK_CHANNEL_ID = "1500893110048133253";
  // Kanał z reakcjami / stary kanał legit-check, zostawiony jako fallback do pinga
  const REACTION_LEGIT_CHANNEL_ID = "1499519884860854505";
  const OPINIE_CHANNEL_ID = "1499519935657935049";

  // UZUPEŁNIJ SWOJE DANE PŁATNOŚCI
  const PAYMENT = {
    blik: {
      number: "780 130 528",
      receiver: "Odbiorca kolega",
      title: "oddaje (sam wybierz do adekwatnego do kwoty)"
    }
  };

  // Podmień linki na swoje bannery z obrazków jak na screenach
  const BANNER_TICKET_URL = process.env.BANNER_TICKET_URL || "https://i.imgur.com/QYhsGEm_d.webp?maxwidth=760&fidelity=grand";
  const BANNER_LEGIT_URL = process.env.BANNER_LEGIT_URL || "https://i.imgur.com/QYhsGEm_d.webp?maxwidth=760&fidelity=grand";

  // =========================================
  // COLOR
  // =========================================
  const EMBED_COLOR = "#1b2dff";

  // =========================================
  // TEMP DATA
  // =========================================
  const exchangeData = new Map();
  const claimedTickets = new Map();
  const userStats = new Map();

  function getUserStats(userId) {
    if (!userStats.has(userId)) userStats.set(userId, { exchanges: 8, total: 369 });
    return userStats.get(userId);
  }

  function addUserExchange(userId, amount) {
    const stats = getUserStats(userId);
    stats.exchanges += 1;
    stats.total += Number(amount) || 0;
    userStats.set(userId, stats);
    return stats;
  }

  function formatMoney(value) {
    return `${Number(value || 0).toFixed(2)} PLN`;
  }

  async function giveClientRoleById(guild, userId) {
    if (!guild || !userId) return;
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;
    await member.roles.add(CLIENT_ROLE_ID).catch(() => {});
  }

  function ticketButtons() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("claim_ticket")
        .setEmoji("🔓")
        .setStyle(ButtonStyle.Secondary)
    );
  }

  // =========================================
  // EMOJI
  // =========================================
  const EMOJI = {

    arrow: "<a:arrow:1508094625984811038>",

    list: "<:list:1501693215328440370>",
    admin: "<:admin:1501989271077388500>",
    warning: "<:warning:1501693444030992395>",
    cart: "<:cart:1500243849535033577>",
    zap: "<:zap:1501697151737139350>",
    ticket: "<:ticket:1501697124734206032>",
    clock: "<:clock:1502030015943151868>",
    lock: "<:lock:1501697222901895258>",
    support: "<:support:1500243961124618381>",
    pin: "<:pin:1501697389050986546>",
    money: "<a:money:1501685438103031920>",
    middleman: "<:middleman:1500243884733894716>",

    blik: "<:blik:1499784231608389742>",
    paypal: "<:paypal:1499784258091483236>",
    ltc: "<:ltc:1499784285211726014>",
    crypto: "<:crypto:1499784635201224724>"
  };

  // =========================================
  // PROWIZJE
  // =========================================
  const rates = {

    "BLIK->PAYPAL": 2,
    "BLIK->CRYPTO": 8,
    "BLIK->LTC": 8,

    "KODBLIK->PAYPAL": 6,
    "KODBLIK->CRYPTO": 11,
    "KODBLIK->LTC": 11,

    "PAYPAL->BLIK": 9,
    "PAYPAL->CRYPTO": 9,
    "PAYPAL->LTC": 9,

    "CRYPTO->BLIK": 4,
    "CRYPTO->KODBLIK": 4,
    "CRYPTO->PAYPAL": 4,
    "CRYPTO->LTC": 4,

    "LTC->BLIK": 4,
    "LTC->KODBLIK": 4,
    "LTC->PAYPAL": 4,
    "LTC->CRYPTO": 4
  };

  // =========================================
  // MENU
  // =========================================
  function createMenu() {

    return new ActionRowBuilder().addComponents(

      new StringSelectMenuBuilder()

        .setCustomId("ticket_select")

        .setPlaceholder("🎫 Wybierz kategorię")

        .addOptions([

          {
            label: "Wymiana waluty",
            description: "Wymiana metod płatności",
            value: "exchange",
            emoji: { id: "1500243849535033577" }
          },

          {
            label: "Zakup",
            description: "Kupno produktu/usługi",
            value: "buy",
            emoji: { id: "1500243849535033577" }
          },

          {
            label: "Pomoc",
            description: "Wsparcie administracji",
            value: "help",
            emoji: { id: "1500243961124618381" }
          },

          {
            label: "Middleman",
            description: "Usługa pośrednika",
            value: "middleman",
            emoji: { id: "1500243884733894716" }
          }
        ])
    );
  }

  // =========================================
  // READY
  // =========================================
  client.once(Events.ClientReady, async () => {

    const channel =
      await client.channels.fetch(PANEL_CHANNEL_ID);

    if (!channel) return;

    const embed =
      new EmbedBuilder()

        .setColor(EMBED_COLOR)

        .setTitle(
          `${EMOJI.ticket} 🌟 StarX Exchange » WYMIANA`
        )

        .setDescription([

          `> ${EMOJI.arrow} Wybierz kategorię z menu poniżej`,
          `> ${EMOJI.arrow} Szybka i bezpieczna wymiana`,
          `> ${EMOJI.arrow} Prywatny ticket z realizatorem`,
          `> ${EMOJI.arrow} Automatyczne obliczenie prowizji`

        ].join("\n"))

        .setImage(
          "https://i.imgur.com/QYhsGEm_d.webp?maxwidth=760&fidelity=grand"
        )

        .setFooter({
          text: "© 2026 StarX Exchange"
        });

    await channel.send({
      embeds: [embed],
      components: [createMenu()]
    });

    console.log("✅ Panel ticketów wysłany.");
  });

  // =========================================
  // INTERACTIONS
  // =========================================
  client.on(Events.InteractionCreate, async (interaction) => {

    // =========================
    // MENU
    // =========================
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "ticket_select"
    ) {

      const type = interaction.values[0];

      // =====================================
      // CHECK EXISTING TICKET
      // =====================================
      const existing =
        interaction.guild.channels.cache.find(c =>
          c.topic?.startsWith(interaction.user.id)
        );

      if (existing)
        return interaction.reply({
          content: `${EMOJI.warning} Masz już ticket: ${existing}`,
          ephemeral: true
        });

      // =====================================
      // EXCHANGE
      // =====================================
      if (type === "exchange") {

        const modal =
          new ModalBuilder()
            .setCustomId("exchange_modal")
            .setTitle("Potrzebne informacje");

        const amountInput =
          new TextInputBuilder()
            .setCustomId("exchange_amount")
            .setLabel("JAKA KWOTA")
            .setPlaceholder("Przykład: 100")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(amountInput)
        );

        return interaction.showModal(modal);
      }

      // =====================================
      // CATEGORY NAME
      // =====================================
      let categoryName = "Pomoc";

      if (type === "buy")
        categoryName = "Zakup";

      if (type === "middleman")
        categoryName = "Middleman";

      // =====================================
      // CREATE CHANNEL
      // =====================================
      const channel =
        await interaction.guild.channels.create({

          name:
            `${type}-${interaction.user.username}`.toLowerCase(),

          topic:
            `${interaction.user.id}:${type}`,

          type:
            ChannelType.GuildText,

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
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.AttachFiles
              ]
            },

            {
              id: REALIZATOR_ROLE_ID,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageMessages
              ]
            }
          ]
        });

      // Rola Klient NIE jest nadawana przy utworzeniu ticketa.
      // Dostanie ją dopiero kupujący po wysłaniu wiadomości LC.

      // =====================================
      // BUTTON
      // =====================================
      const row = ticketButtons();

      // =====================================
      // EMBED
      // =====================================
      const embed =
        new EmbedBuilder()

          .setColor(EMBED_COLOR)

          .setTitle(
            `${EMOJI.ticket} 🌟 StarX Exchange × ${categoryName.toUpperCase()}`
          )

          .setDescription([

            `> ${EMOJI.arrow} Użytkownik ${interaction.user} utworzył ticket`,
            `> ${EMOJI.arrow} Kategoria: \`${categoryName}\``,

            ``,

            `> ${EMOJI.arrow} Realizator odpowie najszybciej jak to możliwe`

          ].join("\n"))
          .setImage(BANNER_TICKET_URL)

          .setFooter({
            text: "© 2026 StarX Exchange"
          });

      // =====================================
      // SEND
      // =====================================
      await channel.send({
        content:
          `${interaction.user} <@&${REALIZATOR_ROLE_ID}>`,
        embeds: [embed],
        components: [row]
      });

      return interaction.reply({
        content:
          `${EMOJI.ticket} Ticket został utworzony: ${channel}`,
        ephemeral: true
      });
    }

    // =========================
    // MODAL
    // =========================
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "exchange_modal"
    ) {

      const amount =
        interaction.fields.getTextInputValue("exchange_amount");

      if (isNaN(amount))
        return interaction.reply({
          content: `${EMOJI.warning} Kwota musi być liczbą.`,
          ephemeral: true
        });

      exchangeData.set(interaction.user.id, {
        amount
      });

      const fromMenu =
        new StringSelectMenuBuilder()
          .setCustomId("exchange_from")
          .setPlaceholder("Z CZEGO")
          .addOptions([
            {
              label: "BLIK",
              value: "BLIK",
              emoji: { id: "1499784231608389742" }
            },
            {
              label: "PAYPAL",
              value: "PAYPAL",
              emoji: { id: "1499784258091483236" }
            },
            {
              label: "CRYPTO",
              value: "CRYPTO",
              emoji: { id: "1499784635201224724" }
            },
            {
              label: "LTC",
              value: "LTC",
              emoji: { id: "1499784285211726014" }
            }
          ]);

      const toMenu =
        new StringSelectMenuBuilder()
          .setCustomId("exchange_to")
          .setPlaceholder("NA CO")
          .addOptions([
            {
              label: "BLIK",
              value: "BLIK",
              emoji: { id: "1499784231608389742" }
            },
            {
              label: "PAYPAL",
              value: "PAYPAL",
              emoji: { id: "1499784258091483236" }
            },
            {
              label: "CRYPTO",
              value: "CRYPTO",
              emoji: { id: "1499784635201224724" }
            },
            {
              label: "LTC",
              value: "LTC",
              emoji: { id: "1499784285211726014" }
            }
          ]);

      const createButton =
        new ButtonBuilder()
          .setCustomId("create_exchange_ticket")
          .setLabel("Utwórz ticket")
          .setEmoji("1501697124734206032")
          .setStyle(ButtonStyle.Success);

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor(EMBED_COLOR)

            .setTitle(
              `${EMOJI.money} 🌟 StarX Exchange × WYMIANA WALUTY`
            )

            .setDescription([

              `## JAKA KWOTA`,
              `> ${EMOJI.arrow} **${amount} PLN**`,

              ``,

              `## Z CZEGO`,
              `> ${EMOJI.arrow} Wybierz metodę poniżej`,

              ``,

              `## NA CO`,
              `> ${EMOJI.arrow} Wybierz metodę poniżej`

            ].join("\n"))
        ],

        components: [
          new ActionRowBuilder().addComponents(fromMenu),
          new ActionRowBuilder().addComponents(toMenu),
          new ActionRowBuilder().addComponents(createButton)
        ],

        ephemeral: true
      });
    }

    // =========================
    // FROM
    // =========================
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "exchange_from"
    ) {

      const data =
        exchangeData.get(interaction.user.id);

      if (!data)
        return interaction.deferUpdate();

      data.from = interaction.values[0];

      exchangeData.set(interaction.user.id, data);

      return interaction.deferUpdate();
    }

    // =========================
    // TO
    // =========================
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "exchange_to"
    ) {

      const data =
        exchangeData.get(interaction.user.id);

      if (!data)
        return interaction.deferUpdate();

      data.to = interaction.values[0];

      exchangeData.set(interaction.user.id, data);

      return interaction.deferUpdate();
    }

    // =========================
    // CREATE EXCHANGE
    // =========================
    if (
      interaction.isButton() &&
      interaction.customId === "create_exchange_ticket"
    ) {

      const data =
        exchangeData.get(interaction.user.id);

      if (!data?.from || !data?.to)
        return interaction.reply({
          content:
            `${EMOJI.warning} Wybierz obie metody.`,
          ephemeral: true
        });

      const exchange =
        `${data.from}->${data.to}`;

      const percent =
        rates[exchange] || 4;

      const afterFee =
        (
          Number(data.amount) *
          (1 - percent / 100)
        ).toFixed(2);

      // =====================================
      // CREATE CHANNEL
      // =====================================
      const channel =
        await interaction.guild.channels.create({

          name:
            `${data.from.toLowerCase()}-${data.to.toLowerCase()}-${interaction.user.username}`.toLowerCase(),

          topic:
            `${interaction.user.id}:exchange:${data.amount}`,

          type:
            ChannelType.GuildText,

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
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.AttachFiles
              ]
            },

            {
              id: REALIZATOR_ROLE_ID,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageMessages
              ]
            }
          ]
        });

      // Rola Klient NIE jest nadawana przy utworzeniu ticketa.
      // Dostanie ją dopiero kupujący po wysłaniu wiadomości LC.

      // =====================================
      // BUTTON
      // =====================================
      const row = ticketButtons();

      // =====================================
      // EMBED
      // =====================================
      const embed =
        new EmbedBuilder()

          .setColor(EMBED_COLOR)

          .setTitle(
            `${EMOJI.money} 🌟 StarX Exchange × WYMIANA WALUTY`
          )

          .setDescription([

            `> ${EMOJI.arrow} Użytkownik ${interaction.user} jest **nowym klientem**.`,

            ``,

            `> ${EMOJI.arrow} Kwota wymiany wynosi **${formatMoney(data.amount)}** z metody **${data.from}** na **${data.to}**.`,
            `> ${EMOJI.arrow} Po prowizjach otrzymasz od nas **${formatMoney(afterFee)}**.`

          ].join("\n"))
          .setImage(BANNER_TICKET_URL)

          .setFooter({
            text: "© 2026 StarX Exchange"
          });

      // =====================================
      // SEND
      // =====================================
      await channel.send({
        content:
          `${interaction.user} <@&${REALIZATOR_ROLE_ID}>`,
        embeds: [embed],
        components: [row]
      });

      exchangeData.delete(interaction.user.id);

      return interaction.update({
        content:
          `${EMOJI.ticket} Ticket został utworzony: ${channel}`,
        embeds: [],
        components: []
      });
    }


    // =========================
    // CLAIM BUTTON
    // =========================
    if (interaction.isButton() && interaction.customId === "claim_ticket") {
      if (!interaction.member.roles.cache.has(REALIZATOR_ROLE_ID)) {
        return interaction.reply({ content: `${EMOJI.warning} Nie jesteś realizatorem.`, ephemeral: true });
      }

      if (claimedTickets.has(interaction.channel.id)) {
        return interaction.reply({ content: `${EMOJI.warning} Ticket jest już przejęty.`, ephemeral: true });
      }

      claimedTickets.set(interaction.channel.id, interaction.user.id);

      await interaction.channel.permissionOverwrites.edit(REALIZATOR_ROLE_ID, { ViewChannel: false }).catch(() => {});
      await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
        ManageMessages: true
      }).catch(() => {});

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle("🌟 StarX Exchange × TICKET PRZEJĘTY")
        .setDescription(
          `> ${EMOJI.arrow} Twój ticket został przejęty przez: ${interaction.user}`
        )
        .setFooter({ text: "© 2026 StarX Exchange" });

      return interaction.reply({
        content: `${interaction.channel.topic?.split(":")?.[0] ? `<@${interaction.channel.topic.split(":")[0]}>` : ""}`,
        embeds: [embed]
      });
    }

    if (interaction.isButton() && ["ping_sent", "payment_check", "payment_ping"].includes(interaction.customId)) {
      return interaction.reply({ content: "✅ Akcja zapisana.", ephemeral: true });
    }
    // =========================
    // CLOSE
    // =========================
    if (
      interaction.isButton() &&
      interaction.customId === "close_ticket"
    ) {

      if (
        !interaction.member.roles.cache.has(
          REALIZATOR_ROLE_ID
        )
      ) {

        return interaction.reply({
          content:
            `${EMOJI.warning} Tylko realizator może zamknąć ticket.`,
          ephemeral: true
        });
      }

      const clientId = interaction.channel.topic?.split(":")?.[0];
      const fromTo = interaction.channel.name.split("-").slice(0, 2).join(" to ").toUpperCase();
      const amount = interaction.channel.topic?.split(":")?.[2] || "0.00";
      const legitText = `+rep ${interaction.user} Exchanged ${fromTo} ${formatMoney(amount)}`;

      // Dopiero przy wysłaniu wiadomości LC nadaj rolę Klient osobie kupującej / właścicielowi ticketa.
      if (clientId) {
        await giveClientRoleById(interaction.guild, clientId);
      }

      await interaction.reply({
        content: clientId ? `<@${clientId}>\n${legitText}` : legitText,
        embeds: [new EmbedBuilder()
          .setColor(EMBED_COLOR)
          .setTitle("🌟 StarX Exchange × WYSTAW LEGIT CHECKA")
          .setDescription([
            `> ${EMOJI.arrow} Dziękujemy ${clientId ? `<@${clientId}>` : ""} za **skorzystanie z naszych usług**.`,
            `> ${EMOJI.arrow} Mamy nadzieję, że to **nie ostatni raz**!`,
            ``,
            `> ${EMOJI.arrow} Prosimy, abyś **wystawił legit checka** na kanale <#${LEGIT_CHECK_CHANNEL_ID}>`,
            ``,
            `> ${EMOJI.arrow} **Wzór:**`,
            `\`\`\`text`,
            `${legitText}`,
            `\`\`\``,
            ``,
            `> ${EMOJI.arrow} Po wystawieniu legit checka ticket zostanie **automatycznie zamknięty**.`
          ].join("\n"))
          .setImage(BANNER_LEGIT_URL)
          .setFooter({ text: "© 2026 StarX Exchange" })]
      });



      // Ping na kanale legit-check dla osoby kupującej, żeby od razu widziała wzór.
      try {
        const pingChannel = await interaction.client.channels.fetch(LEGIT_CHECK_CHANNEL_ID).catch(() => null);
        if (pingChannel?.isTextBased()) {
          await pingChannel.send({
            content: clientId ? `<@${clientId}>\n\`\`\`text\n${legitText}\n\`\`\`` : `\`\`\`text\n${legitText}\n\`\`\``
          });
        }

        // Jeżeli używasz osobnego kanału od reakcji/starego legit-checka, bot też zaznaczy tam kupującego.
        if (REACTION_LEGIT_CHANNEL_ID !== LEGIT_CHECK_CHANNEL_ID) {
          const reactionChannel = await interaction.client.channels.fetch(REACTION_LEGIT_CHANNEL_ID).catch(() => null);
          if (reactionChannel?.isTextBased()) {
            await reactionChannel.send({
              content: clientId ? `<@${clientId}>` : "Kupujący"
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.log("LEGIT PING ERROR:", err);
      }

      // Ticket zostaje otwarty dla realizatora.
      // Dostęp klienta zostanie zabrany automatycznie po wysłaniu legit checka na kanale LC.
    }
  });
};
