const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require("discord.js");

module.exports = (client) => {
    const CHANNEL_ID = "1499568863602540645";

    const selectedType = {};
    const selectedFrom = {};

    const EMOJI_BLIK = "<:blik:1499784231608389742>";
    const EMOJI_PAYPAL = "<:paypal:1499784258091483236>";
    const EMOJI_CRYPTO = "<:crypto:1499784635201224724>";
    const EMOJI_LTC = "<:ltc:1499784285211726014>";
    const EMOJI_PSC = "<:MYPSC:1519440223140970636>";
    const EMOJI_SKRILL = "<:SKRILL:1519440276492521472>";

    const EMOJI_MONEY = "<a:money:1501685438103031920>";
    const EMOJI_BOX = "<:box:1500243849535033577>";
    const EMOJI_ARROW = "<a:Arrow_White:1508094625984811038>";
    const SEPARATOR = "-----------------------";

    const rates = {
        BLIK_PAYPAL: 2,
        BLIK_CRYPTO: 8,
        BLIK_LTC: 8,

        KODBLIK_PAYPAL: 6,
        KODBLIK_CRYPTO: 11,
        KODBLIK_LTC: 11,

        PAYPAL_BLIK: 9,
        PAYPAL_CRYPTO: 9,
        PAYPAL_LTC: 9,

        CRYPTO_BLIK: 4,
        CRYPTO_KODBLIK: 4,
        CRYPTO_PAYPAL: 4,
        CRYPTO_CRYPTO: 4,
        CRYPTO_LTC: 4,

        LTC_BLIK: 4,
        LTC_KODBLIK: 4,
        LTC_PAYPAL: 4,
        LTC_CRYPTO: 4,

        PSC_BLIK: 11,
        PSC_KODBLIK: 11,
        PSC_PAYPAL: 11,
        PSC_CRYPTO: 13,
        PSC_LTC: 13,
        PSC_SKRILL: 11,

        SKRILL_BLIK: 9,
        SKRILL_KODBLIK: 9,
        SKRILL_PAYPAL: 9,
        SKRILL_CRYPTO: 9,
        SKRILL_LTC: 9
    };

    const methods = [
        { label: "BLIK", value: "BLIK", emoji: { id: "1499784231608389742", name: "blik" } },
        { label: "KOD BLIK", value: "KODBLIK", emoji: { id: "1499784231608389742", name: "blik" } },
        { label: "PAYPAL", value: "PAYPAL", emoji: { id: "1499784258091483236", name: "paypal" } },
        { label: "LTC", value: "LTC", emoji: { id: "1499784285211726014", name: "ltc" } },
        { label: "CRYPTO", value: "CRYPTO", emoji: { id: "1499784635201224724", name: "crypto" } },
        { label: "PSC", value: "PSC", emoji: { id: "1519440223140970636", name: "MYPSC" } },
        { label: "SKRILL", value: "SKRILL", emoji: { id: "1519440276492521472", name: "SKRILL" } }
    ];

    function emoji(method) {
        if (method === "BLIK") return EMOJI_BLIK;
        if (method === "KODBLIK") return EMOJI_BLIK;
        if (method === "PAYPAL") return EMOJI_PAYPAL;
        if (method === "CRYPTO") return EMOJI_CRYPTO;
        if (method === "LTC") return EMOJI_LTC;
        if (method === "PSC") return EMOJI_PSC;
        if (method === "SKRILL") return EMOJI_SKRILL;
        return EMOJI_MONEY;
    }

    function methodName(method) {
        if (method === "KODBLIK") return "KOD BLIK";
        return method;
    }

    function methodButtonRows(prefix) {
        const buttons = methods.map(method =>
            new ButtonBuilder()
                .setCustomId(`${prefix}_${method.value}`)
                .setLabel(method.label)
                .setEmoji(method.emoji)
                .setStyle(ButtonStyle.Secondary)
        );

        return [
            new ActionRowBuilder().addComponents(buttons.slice(0, 4)),
            new ActionRowBuilder().addComponents(buttons.slice(4))
        ];
    }

    function createAmountModal(to) {
        return new ModalBuilder()
            .setCustomId(`calc_modal_${to}`)
            .setTitle("StarX Exchange - Kalkulator")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("kwota")
                        .setLabel("Podaj kwote")
                        .setPlaceholder("Np. 100")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
            );
    }

    async function sendPanel() {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("#1b2dff")
            .setTitle("StarX Exchange >> OBLICZ PROWIZJE")
            .setDescription([
                `${EMOJI_MONEY} Oblicz ile dostaniesz lub ile musisz wplacic.`,
                "",
                SEPARATOR,
                "",
                `${EMOJI_ARROW} Minimalna prowizja wynosi: **3 PLN**`,
                "",
                SEPARATOR,
                "",
                `${EMOJI_BOX} Kliknij menu ponizej.`
            ].join("\n"))
            .setFooter({ text: "(c) 2026 StarX Exchange x Kalkulator" });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("calc_type")
            .setPlaceholder("Wybierz opcje")
            .addOptions([
                {
                    label: "Jaka kwote otrzymam?",
                    value: "otrzymam",
                    emoji: { id: "1501685438103031920", name: "money", animated: true }
                },
                {
                    label: "Ile musze wplacic aby dostac X?",
                    value: "wplace",
                    emoji: { id: "1508094625984811038", name: "Arrow_White", animated: true }
                }
            ]);

        await channel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(menu)]
        });

        console.log("Kalkulator wyslany");
    }

    client.on(Events.ClientReady, async () => {
        setTimeout(sendPanel, 3000);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isStringSelectMenu() && interaction.customId === "calc_type") {
            selectedType[interaction.user.id] = interaction.values[0];

            return interaction.reply({
                content: `${EMOJI_ARROW} Wybierz metode Z:`,
                components: methodButtonRows("calc_from_btn"),
                flags: 64
            });
        }

        if (interaction.isButton() && interaction.customId.startsWith("calc_from_btn_")) {
            const from = interaction.customId.replace("calc_from_btn_", "");
            selectedFrom[interaction.user.id] = from;

            return interaction.update({
                content: `${emoji(from)} Wybrano Z: **${methodName(from)}**\n${EMOJI_ARROW} Wybierz metode NA:`,
                components: methodButtonRows("calc_to_btn")
            });
        }

        if (interaction.isButton() && interaction.customId.startsWith("calc_to_btn_")) {
            const to = interaction.customId.replace("calc_to_btn_", "");
            return interaction.showModal(createAmountModal(to));
        }

        if (!interaction.isModalSubmit() || !interaction.customId.startsWith("calc_modal_")) return;

        const to = interaction.customId.replace("calc_modal_", "");
        const from = selectedFrom[interaction.user.id];
        const type = selectedType[interaction.user.id];
        const key = `${from}_${to}`;

        if (!from || !type || !rates[key]) {
            return interaction.reply({
                content: "Nie mozna wymienic tej metody.",
                flags: 64
            });
        }

        const kwota = parseFloat(
            interaction.fields
                .getTextInputValue("kwota")
                .replace(",", ".")
        );

        if (isNaN(kwota) || kwota <= 0) {
            return interaction.reply({
                content: "Podano nieprawidlowa kwote.",
                flags: 64
            });
        }

        const percent = rates[key];
        let prowizja = (kwota * percent) / 100;

        if (prowizja < 3) {
            prowizja = 3;
        }

        const wynik = type === "otrzymam"
            ? kwota - prowizja
            : kwota + prowizja;

        const embed = new EmbedBuilder()
            .setColor("#1b2dff")
            .setTitle("StarX Exchange >> WYNIK")
            .setDescription([
                `${emoji(from)} **Z:** ${methodName(from)}`,
                "",
                `${emoji(to)} **Na:** ${methodName(to)}`,
                "",
                `${EMOJI_MONEY} **Prowizja:** ${percent}%`,
                `${EMOJI_ARROW} **Minimalna prowizja:** 3 PLN`,
                "",
                SEPARATOR,
                "",
                `${EMOJI_MONEY} **Wynik:** \`${wynik.toFixed(2)} PLN\``
            ].join("\n"))
            .setFooter({ text: "(c) 2026 StarX Exchange x Kalkulator" });

        return interaction.reply({
            embeds: [embed],
            flags: 64
        });
    });
};
