const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require("discord.js");

module.exports = (client) => {

  // ===============================
  // CONFIG
  // ===============================
  const CHANNEL_ID = "1499812157246669001";
  const ADMIN_ROLE = "1499499185337012377";

  let stock = 4;
  let panelMessageId = null;

  // ===============================
  // EMOJI
  // ===============================
  const EMOJI_STAKE = "<:stake:1500238567564378142>";
  const EMOJI_MONEY = "<a:money:1501685438103031920>";
  const EMOJI_BOX = "<:box:1500243849535033577>";
  const EMOJI_PIN = "<:pin:1501697389050986546>";
  const EMOJI_ZAP = "<:zap:1501697151737139350>";
  const EMOJI_LOCK = "<:lock:1501697222901895258>";

  // ===============================
  // PANEL
  // ===============================
  async function sendPanel() {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (!channel) return;

      // usuń stary panel
      if (panelMessageId) {
        try {
          const oldMsg = await channel.messages.fetch(panelMessageId);
          if (oldMsg) await oldMsg.delete();
        } catch {}
      }

      const embed = new EmbedBuilder()
        .setColor("#2b59ff")
        .setTitle(`${EMOJI_STAKE} StarX Exchange » KONTO STAKE`)
        .setDescription(
`${EMOJI_PIN} Wybierz opcję z menu poniżej.

${EMOJI_ZAP} Natychmiastowa realizacja  
${EMOJI_LOCK} Bezpieczny zakup  
${EMOJI_BOX} Aktualny stock: **${stock} sztuk**`
        )
        .setImage("https://i.imgur.com/IkCEHh1_d.webp?maxwidth=760&fidelity=grand")
        .setFooter({
          text: "© 2026 StarX Exchange x Stake"
        });

      const menu = new StringSelectMenuBuilder()
        .setCustomId("stake_menu")
        .setPlaceholder("📦 Wybierz opcję")
        .addOptions([
          {
            label: "Zobacz cenę",
            value: "price",
            emoji: { id: "1501685438103031920", name: "money" }
          },
          {
            label: "Dostępne sztuki",
            value: "stock",
            emoji: { id: "1500243849535033577", name: "box" }
          }
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      const msg = await channel.send({
        embeds: [embed],
        components: [row]
      });

      panelMessageId = msg.id;

      console.log("✅ Stake panel wysłany");

    } catch (err) {
      console.log("❌ stake panel error:", err);
    }
  }

  // ===============================
  // READY
  // ===============================
  client.once(Events.ClientReady, async () => {
    await sendPanel();
  });

  // ===============================
  // INTERACTIONS
  // ===============================
  client.on(Events.InteractionCreate, async (interaction) => {
    try {

      // ================= MENU
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId !== "stake_menu") return;

        // cena
        if (interaction.values[0] === "price") {
          return interaction.reply({
            content:
`${EMOJI_STAKE} **KONTO STAKE (2 POZIOM WERYFIKACJI)**

🔓 Pełny dostęp (mail + konto)  
🪪 Zweryfikowane dokumentem  
🎯 Gotowe do wpłat i wypłat  

${EMOJI_MONEY} **Cena: 40 zł**`,
            flags: 64
          });
        }

        // stock
        if (interaction.values[0] === "stock") {
          return interaction.reply({
            content: `${EMOJI_BOX} **Dostępne sztuki: ${stock}**`,
            flags: 64
          });
        }
      }

      // ================= SLASH
      if (!interaction.isChatInputCommand()) return;

      const allowed = [
        "stakeadd",
        "stakeremove",
        "stakeset",
        "stakepanel"
      ];

      if (!allowed.includes(interaction.commandName)) return;

      if (!interaction.member.roles.cache.has(ADMIN_ROLE)) {
        return interaction.reply({
          content: "❌ Nie masz permisji.",
          flags: 64
        });
      }

      // ================= COMMANDS

      if (interaction.commandName === "stakeadd") {
        const amount = interaction.options.getInteger("ilosc");

        stock += amount;
        await sendPanel();

        return interaction.reply({
          content: `✅ Dodano ${amount}\n📦 Aktualnie: ${stock}`,
          flags: 64
        });
      }

      if (interaction.commandName === "stakeremove") {
        const amount = interaction.options.getInteger("ilosc");

        stock -= amount;
        if (stock < 0) stock = 0;

        await sendPanel();

        return interaction.reply({
          content: `✅ Usunięto ${amount}\n📦 Aktualnie: ${stock}`,
          flags: 64
        });
      }

      if (interaction.commandName === "stakeset") {
        const amount = interaction.options.getInteger("ilosc");

        stock = amount;
        await sendPanel();

        return interaction.reply({
          content: `✅ Ustawiono stock na ${stock}`,
          flags: 64
        });
      }

      if (interaction.commandName === "stakepanel") {
        await sendPanel();

        return interaction.reply({
          content: "✅ Panel odświeżony.",
          flags: 64
        });
      }

    } catch (err) {
      console.log("❌ stake interaction error:", err);
    }
  });
};
