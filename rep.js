const { EmbedBuilder, Events } = require("discord.js");

module.exports = (client) => {

  // =========================
  // CONFIG
  // =========================
  const CHANNEL_ID = "1500893110048133253"; // kanał rep
  const TARGET_ROLE_ID = "1499572498604363918";

  const LEGIT_CHANNEL_ID = "1499519884860854505";
  const OPINIE_CHANNEL_ID = "1499519935657935049";

  let panelMessage = null;

  // =========================
  // PANEL
  // =========================
  async function sendPanel(channel) {
    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("🌟 StarX Exchange × LEGIT CHECK")
      .setDescription(
`Dziękujemy za wybranie **StarX Exchange**! Twój legitcheck jest dla nas bardzo ważny i pomaga budować zaufanie.

📄 **WZÓR LEGITCHECKA:**
\`\`\`
+rep @seller Purchased [co] [kwota]PLN [metoda]
\`\`\`

📌 **PRZYKŁAD:**
\`\`\`
+rep @jarek.svx Purchased Konto Stake 40PLN [BLIK]
\`\`\`

© 2026 StarX Exchange`
      )
      .setFooter({ text: "StarX Exchange" });

    // usuń stary panel
    if (panelMessage) {
      await panelMessage.delete().catch(() => {});
    }

    panelMessage = await channel.send({ embeds: [embed] });
  }

  // =========================
  // READY
  // =========================
  client.once(Events.ClientReady, async () => {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (!channel) return console.log("❌ Nie znaleziono kanału rep");

      await sendPanel(channel);

      console.log("✅ Rep panel uruchomiony");

    } catch (err) {
      console.log("❌ Rep Ready error:", err);
    }
  });

  // =========================
  // NOWE WIADOMOŚCI
  // =========================
  client.on(Events.MessageCreate, async (message) => {
    try {
      if (message.channel.id !== CHANNEL_ID) return;
      if (message.author.bot) return;

      // NIE usuwamy wiadomości usera
      await sendPanel(message.channel);

    } catch (err) {
      console.log("❌ Rep Message error:", err);
    }
  });

  // =========================
  // RANGA → PING (auto delete)
  // =========================
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    try {

      const hadRole = oldMember.roles.cache.has(TARGET_ROLE_ID);
      const hasRole = newMember.roles.cache.has(TARGET_ROLE_ID);

      if (!hadRole && hasRole) {

        const channel = await newMember.guild.channels.fetch(CHANNEL_ID).catch(() => null);
        if (!channel) return;

        const embed = new EmbedBuilder()
          .setColor("#57F287")
          .setTitle("🎉 StarX Exchange » NOWY LEGIT")
          .setDescription(
`👤 ${newMember}

otrzymał klient ✅

📌 Zostaw opinię:
👉 <#${OPINIE_CHANNEL_ID}>

📨 Dodaj legit check:
👉 <#${LEGIT_CHANNEL_ID}>`
          )
          .setFooter({
            text: "StarX Exchange • System reputacji"
          })
          .setTimestamp();

        const msg = await channel.send({
          content: `${newMember}`, // ping
          embeds: [embed]
        });

        // usuń po 1 sekundzie
        setTimeout(() => {
          msg.delete().catch(() => {});
        }, 1000);
      }

    } catch (err) {
      console.log("❌ Role Ping Error:", err);
    }
  });

};
