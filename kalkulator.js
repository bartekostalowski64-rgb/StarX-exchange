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
