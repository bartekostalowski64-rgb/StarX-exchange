const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require("discord.js");

module.exports = async (client) => {

  const CHANNEL_ID = "1499513009188376767";

  // ==========================
  // CUSTOM EMOJI
  // ==========================
  const EMOJI_BLIK = "<:blik:1499784231608389742>";
  const EMOJI_PAYPAL = "<:paypal:1499784258091483236>";
  const EMOJI_CRYPTO = "<:crypto:1499784635201224724>";
  const EMOJI_LTC = "<:ltc:1499784285211726014>";
  const EMOJI_PSC = "<:MYPSC:1519440223140970636>";
  const EMOJI_SKRILL = "<:SKRILL:1519440276492521472>";

  // ANIMOWANE
  const EMOJI_MONEY = "<a:money:1501685438103031920>";
  const EMOJI_ARROW = "<a:Arrow_White:1508094625984811038>";
  const EMOJI_BOX = "<:box:1500243849535033577>";

  // ==========================
  // PANEL
  // ==========================
  async function sendPanel() {

    try {

      const channel = await client.channels.fetch(CHANNEL_ID);

      if (!channel) {
        return console.log("❌ Nie znaleziono kanału prowizje");
      }

      const embed = new EmbedBuilder()
        .setColor("#1b2dff")
        .setTitle("🌟 StarX Exchange » PROWIZJE")
        .setDescription(
`${EMOJI_MONEY} Wybierz metodę płatności z menu poniżej.

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_BOX} Szybkie i przejrzyste prowizje.`
        )
        .setFooter({
          text: "© 2026 StarX Exchange"
        });

      const menu = new StringSelectMenuBuilder()
        .setCustomId("show_rates")
        .setPlaceholder("💰 Wybierz metodę")
        .addOptions([
          {
            label: "BLIK",
            value: "BLIK",
            emoji: {
              id: "1499784231608389742",
              name: "blik"
            }
          },
          {
            label: "KOD BLIK",
            value: "KODBLIK",
            emoji: {
              id: "1499784231608389742",
              name: "blik"
            }
          },
          {
            label: "PAYPAL",
            value: "PAYPAL",
            emoji: {
              id: "1499784258091483236",
              name: "paypal"
            }
          },
          {
            label: "CRYPTO",
            value: "CRYPTO",
            emoji: {
              id: "1499784635201224724",
              name: "crypto"
            }
          },
          {
            label: "LTC",
            value: "LTC",
            emoji: {
              id: "1499784285211726014",
              name: "ltc"
            }
          },
          {
            label: "PSC",
            value: "PSC",
            emoji: {
              id: "1519440223140970636",
              name: "MYPSC"
            }
          },
          {
            label: "SKRILL",
            value: "SKRILL",
            emoji: {
              id: "1519440276492521472",
              name: "SKRILL"
            }
          }
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      await channel.send({
        embeds: [embed],
        components: [row]
      });

      console.log("✅ Panel prowizji wysłany");

    } catch (error) {
      console.log("❌ Błąd panelu:", error);
    }
  }

  // ==========================
  // READY
  // ==========================
  if (client.isReady()) {
    sendPanel();
  } else {
    client.once(Events.ClientReady, sendPanel);
  }

  // ==========================
  // MENU
  // ==========================
  client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== "show_rates") return;

    const type = interaction.values[0];
    let desc = "";

    // ==========================
    // BLIK
    // ==========================
    if (type === "BLIK") {

      desc = `
• ${EMOJI_BLIK} **BLIK ➜** ${EMOJI_PAYPAL} **PAYPAL** — Prowizja wynosi: **2%**
• ${EMOJI_BLIK} **BLIK ➜** ${EMOJI_CRYPTO} **CRYPTO** — Prowizja wynosi: **8%**
• ${EMOJI_BLIK} **BLIK ➜** ${EMOJI_LTC} **LTC** — Prowizja wynosi: **8%**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // KOD BLIK
    // ==========================
    if (type === "KODBLIK") {

      desc = `
• ${EMOJI_BLIK} **KOD BLIK ➜** ${EMOJI_PAYPAL} **PAYPAL** — Prowizja wynosi: **6%**
• ${EMOJI_BLIK} **KOD BLIK ➜** ${EMOJI_CRYPTO} **CRYPTO** — Prowizja wynosi: **11%**
• ${EMOJI_BLIK} **KOD BLIK ➜** ${EMOJI_LTC} **LTC** — Prowizja wynosi: **11%**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // PAYPAL
    // ==========================
    if (type === "PAYPAL") {

      desc = `
• ${EMOJI_PAYPAL} **PAYPAL ➜** ${EMOJI_BLIK} **BLIK** — Prowizja wynosi: **9%**
• ${EMOJI_PAYPAL} **PAYPAL ➜** ${EMOJI_CRYPTO} **CRYPTO** — Prowizja wynosi: **9%**
• ${EMOJI_PAYPAL} **PAYPAL ➜** ${EMOJI_LTC} **LTC** — Prowizja wynosi: **9%**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // CRYPTO
    // ==========================
    if (type === "CRYPTO") {

      desc = `
• ${EMOJI_CRYPTO} **CRYPTO ➜** ${EMOJI_BLIK} **BLIK** — Prowizja wynosi: **4%**
• ${EMOJI_CRYPTO} **CRYPTO ➜** ${EMOJI_BLIK} **KOD BLIK** — Prowizja wynosi: **4%**
• ${EMOJI_CRYPTO} **CRYPTO ➜** ${EMOJI_PAYPAL} **PAYPAL** — Prowizja wynosi: **4%**
• ${EMOJI_CRYPTO} **CRYPTO ➜** ${EMOJI_CRYPTO} **CRYPTO** — Prowizja wynosi: **4%**
• ${EMOJI_CRYPTO} **CRYPTO ➜** ${EMOJI_LTC} **LTC** — Prowizja wynosi: **4%**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // PSC
    // ==========================
    if (type === "PSC") {

      desc = `
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_BLIK} **BLIK** â€” Prowizja wynosi: **11%**
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_BLIK} **KOD BLIK** â€” Prowizja wynosi: **11%**
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_PAYPAL} **PAYPAL** â€” Prowizja wynosi: **11%**
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_CRYPTO} **CRYPTO** â€” Prowizja wynosi: **13%**
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_LTC} **LTC** â€” Prowizja wynosi: **13%**
â€˘ ${EMOJI_PSC} **PSC âžś** ${EMOJI_SKRILL} **SKRILL** â€” Prowizja wynosi: **11%**

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // SKRILL
    // ==========================
    if (type === "SKRILL") {

      desc = `
â€˘ ${EMOJI_SKRILL} **SKRILL âžś** ${EMOJI_BLIK} **BLIK** â€” Prowizja wynosi: **9%**
â€˘ ${EMOJI_SKRILL} **SKRILL âžś** ${EMOJI_BLIK} **KOD BLIK** â€” Prowizja wynosi: **9%**
â€˘ ${EMOJI_SKRILL} **SKRILL âžś** ${EMOJI_PAYPAL} **PAYPAL** â€” Prowizja wynosi: **9%**
â€˘ ${EMOJI_SKRILL} **SKRILL âžś** ${EMOJI_CRYPTO} **CRYPTO** â€” Prowizja wynosi: **9%**
â€˘ ${EMOJI_SKRILL} **SKRILL âžś** ${EMOJI_LTC} **LTC** â€” Prowizja wynosi: **9%**

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    if (type === "PSC") {
      desc = `
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_BLIK} **BLIK** \u2014 Prowizja wynosi: **11%**
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_BLIK} **KOD BLIK** \u2014 Prowizja wynosi: **11%**
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_PAYPAL} **PAYPAL** \u2014 Prowizja wynosi: **11%**
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_CRYPTO} **CRYPTO** \u2014 Prowizja wynosi: **13%**
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_LTC} **LTC** \u2014 Prowizja wynosi: **13%**
\u2022 ${EMOJI_PSC} **PSC \u279c** ${EMOJI_SKRILL} **SKRILL** \u2014 Prowizja wynosi: **11%**

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    if (type === "SKRILL") {
      desc = `
\u2022 ${EMOJI_SKRILL} **SKRILL \u279c** ${EMOJI_BLIK} **BLIK** \u2014 Prowizja wynosi: **9%**
\u2022 ${EMOJI_SKRILL} **SKRILL \u279c** ${EMOJI_BLIK} **KOD BLIK** \u2014 Prowizja wynosi: **9%**
\u2022 ${EMOJI_SKRILL} **SKRILL \u279c** ${EMOJI_PAYPAL} **PAYPAL** \u2014 Prowizja wynosi: **9%**
\u2022 ${EMOJI_SKRILL} **SKRILL \u279c** ${EMOJI_CRYPTO} **CRYPTO** \u2014 Prowizja wynosi: **9%**
\u2022 ${EMOJI_SKRILL} **SKRILL \u279c** ${EMOJI_LTC} **LTC** \u2014 Prowizja wynosi: **9%**

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    // ==========================
    // LTC
    // ==========================
    if (type === "LTC") {

      desc = `
• ${EMOJI_LTC} **LTC ➜** ${EMOJI_BLIK} **BLIK** — Prowizja wynosi: **4%**
• ${EMOJI_LTC} **LTC ➜** ${EMOJI_BLIK} **KOD BLIK** — Prowizja wynosi: **4%**
• ${EMOJI_LTC} **LTC ➜** ${EMOJI_PAYPAL} **PAYPAL** — Prowizja wynosi: **4%**
• ${EMOJI_LTC} **LTC ➜** ${EMOJI_CRYPTO} **CRYPTO** — Prowizja wynosi: **4%**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**
`;
    }

    const embed = new EmbedBuilder()
      .setColor("#1b2dff")
      .setTitle(`🌟 StarX Exchange » ${type}`)
      .setDescription(desc)
      .setFooter({
        text: "© 2026 StarX Exchange"
      });

    await interaction.reply({
      embeds: [embed],
      flags: 64
    });

  });

};
