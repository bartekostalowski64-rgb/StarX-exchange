const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Events
} = require("discord.js");

module.exports = (client) => {

    const CHANNEL_ID = "1499568863602540645";

    let selectedType = {};
    let selectedFrom = {};

    // =====================
    // CUSTOM EMOJI
    // =====================

    const EMOJI_BLIK = "<:blik:1499784231608389742>";
    const EMOJI_PAYPAL = "<:paypal:1499784258091483236>";
    const EMOJI_CRYPTO = "<:crypto:1499784635201224724>";
    const EMOJI_LTC = "<:ltc:1499784285211726014>";

    const EMOJI_MONEY = "<a:money:1501685438103031920>";
    const EMOJI_BOX = "<:box:1500243849535033577>";
    const EMOJI_ARROW = "<a:Arrow_White:1508094625984811038>";

    // =====================
    // PROWIZJE
    // =====================

    const rates = {

        // BLIK
        "BLIK_PAYPAL": 2,
        "BLIK_CRYPTO": 8,
        "BLIK_LTC": 8,

        // KOD BLIK
        "KODBLIK_PAYPAL": 6,
        "KODBLIK_CRYPTO": 11,
        "KODBLIK_LTC": 11,

        // PAYPAL
        "PAYPAL_BLIK": 9,
        "PAYPAL_CRYPTO": 9,
        "PAYPAL_LTC": 9,

        // CRYPTO
        "CRYPTO_BLIK": 4,
        "CRYPTO_KODBLIK": 4,
        "CRYPTO_PAYPAL": 4,
        "CRYPTO_CRYPTO": 4,
        "CRYPTO_LTC": 4,

        // LTC
        "LTC_BLIK": 4,
        "LTC_KODBLIK": 4,
        "LTC_PAYPAL": 4,
        "LTC_CRYPTO": 4
    };

    // =====================
    // EMOJI FUNCTION
    // =====================

    function emoji(method) {

        if (method === "BLIK") return EMOJI_BLIK;
        if (method === "KODBLIK") return EMOJI_BLIK;
        if (method === "PAYPAL") return EMOJI_PAYPAL;
        if (method === "CRYPTO") return EMOJI_CRYPTO;
        if (method === "LTC") return EMOJI_LTC;

        return "💸";
    }

    function methodName(method) {

        if (method === "KODBLIK") return "KOD BLIK";

        return method;
    }

    // =====================
    // PANEL
    // =====================

    async function sendPanel() {

        const channel = await client.channels.fetch(CHANNEL_ID);

        const embed = new EmbedBuilder()
            .setColor("#1b2dff")
            .setTitle("🌟 StarX Exchange » OBLICZ PROWIZJĘ")
            .setDescription(`
${EMOJI_MONEY} Oblicz ile dostaniesz lub ile musisz wpłacić.

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_BOX} Kliknij menu poniżej.
            `)
            .setFooter({
                text: "© 2026 StarX Exchange x Kalkulator"
            });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("calc_type")
            .setPlaceholder("💸 Wybierz opcję")
            .addOptions([
                {
                    label: "Jaką kwotę otrzymam?",
                    value: "otrzymam"
                },
                {
                    label: "Ile muszę wpłacić aby dostać X?",
                    value: "wplace"
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        console.log("✅ Kalkulator wysłany");
    }

    // =====================
    // READY
    // =====================

    client.on(Events.ClientReady, async () => {
        setTimeout(sendPanel, 3000);
    });

    // =====================
    // INTERACTIONS
    // =====================

    client.on(Events.InteractionCreate, async interaction => {

        // =====================
        // SELECT MENU
        // =====================

        if (interaction.isStringSelectMenu()) {

            // WYBÓR TYPU

            if (interaction.customId === "calc_type") {

                selectedType[interaction.user.id] = interaction.values[0];

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("calc_from")
                    .setPlaceholder("📤 Z jakiej metody?")
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
                            label: "LTC",
                            value: "LTC",
                            emoji: {
                                id: "1499784285211726014",
                                name: "ltc"
                            }
                        },
                        {
                            label: "CRYPTO",
                            value: "CRYPTO",
                            emoji: {
                                id: "1499784635201224724",
                                name: "crypto"
                            }
                        }
                    ]);

                return interaction.reply({
                    content: "📤 Wybierz metodę Z:",
                    components: [
                        new ActionRowBuilder().addComponents(menu)
                    ],
                    flags: 64
                });
            }

            // WYBÓR FROM

            if (interaction.customId === "calc_from") {

                selectedFrom[interaction.user.id] = interaction.values[0];

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("calc_to")
                    .setPlaceholder("📥 Na jaką metodę?")
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
                            label: "LTC",
                            value: "LTC",
                            emoji: {
                                id: "1499784285211726014",
                                name: "ltc"
                            }
                        },
                        {
                            label: "CRYPTO",
                            value: "CRYPTO",
                            emoji: {
                                id: "1499784635201224724",
                                name: "crypto"
                            }
                        }
                    ]);

                return interaction.update({
                    content: "📥 Wybierz metodę NA:",
                    components: [
                        new ActionRowBuilder().addComponents(menu)
                    ]
                });
            }

            // WYBÓR TO

            if (interaction.customId === "calc_to") {

                const modal = new ModalBuilder()
                    .setCustomId(`calc_modal_${interaction.values[0]}`)
                    .setTitle("🌟 StarX Exchange");

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("kwota")
                            .setLabel("Podaj kwotę")
                            .setPlaceholder("Np. 100")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );

                return interaction.showModal(modal);
            }
        }

        // =====================
        // MODAL SUBMIT
        // =====================

        if (interaction.isModalSubmit()) {

            if (!interaction.customId.startsWith("calc_modal_"))
                return;

            const to = interaction.customId.replace("calc_modal_", "");

            const from = selectedFrom[interaction.user.id];
            const type = selectedType[interaction.user.id];

            const key = `${from}_${to}`;

            if (!rates[key]) {

                return interaction.reply({
                    content: "❌ Nie można wymienić tej metody.",
                    flags: 64
                });
            }

            const percent = rates[key];

            const kwota = parseFloat(
                interaction.fields
                    .getTextInputValue("kwota")
                    .replace(",", ".")
            );

            if (isNaN(kwota) || kwota <= 0) {

                return interaction.reply({
                    content: "❌ Podano nieprawidłową kwotę.",
                    flags: 64
                });
            }

            // LICZENIE PROWIZJI
            let prowizja = (kwota * percent) / 100;

            // MINIMALNA PROWIZJA
            if (prowizja < 3) {
                prowizja = 3;
            }

            let wynik = 0;

            if (type === "otrzymam") {

                wynik = kwota - prowizja;

            } else {

                wynik = kwota + prowizja;
            }

            const embed = new EmbedBuilder()
                .setColor("#1b2dff")
                .setTitle("🌟 StarX Exchange » WYNIK")
                .setDescription(`
${emoji(from)} **Z:** ${methodName(from)}

${emoji(to)} **Na:** ${methodName(to)}

💸 **Prowizja:** ${percent}%
${EMOJI_ARROW} **Minimalna prowizja:** 3 PLN

━━━━━━━━━━━━━━━━━━━━━━━

${EMOJI_MONEY} **Wynik:** \`${wynik.toFixed(2)} PLN\`
                `)
                .setFooter({
                    text: "© 2026 StarX Exchange x Kalkulator"
                });

            await interaction.reply({
                embeds: [embed],
                flags: 64
            });
        }
    });
};
