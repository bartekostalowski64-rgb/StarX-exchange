const {
  Events,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

module.exports = (client) => {

  const REALIZATOR_ROLE_ID =
    "1500930428993933373";

  const EMOJI = {

    warning:
      "<:warning:1501693444030992395>",

    zap:
      "<:zap:1501697151737139350>",

    lock:
      "<:lock:1501697222901895258>"
  };

  // =====================================
  // CLAIMED
  // =====================================
  const claimedTickets =
    new Map();

  // =====================================
  // INTERACTIONS
  // =====================================
  client.on(
    Events.InteractionCreate,
    async (interaction) => {

      if (
        !interaction.isChatInputCommand()
      ) return;

      // =====================================
      // CHECK TICKET
      // =====================================
      const validTicket =

        interaction.channel.name.startsWith("exchange-") ||

        interaction.channel.name.startsWith("buy-") ||

        interaction.channel.name.startsWith("help-") ||

        interaction.channel.name.startsWith("middleman-") ||

        interaction.channel.name.startsWith("blik-") ||

        interaction.channel.name.startsWith("paypal-") ||

        interaction.channel.name.startsWith("crypto-") ||

        interaction.channel.name.startsWith("ltc-");

      // =====================================
      // /PRZEJMIJ
      // =====================================
      if (
        interaction.commandName ===
        "przejmij"
      ) {

        try {

          // role check
          if (
            !interaction.member.roles.cache.has(
              REALIZATOR_ROLE_ID
            )
          ) {

            return interaction.reply({

              content:
                `${EMOJI.warning} Nie jesteś realizatorem.`,

              ephemeral: true
            });
          }

          // ticket check
          if (!validTicket) {

            return interaction.reply({

              content:
                `${EMOJI.warning} To nie jest ticket.`,

              ephemeral: true
            });
          }

          // already claimed
          if (
            claimedTickets.has(
              interaction.channel.id
            )
          ) {

            return interaction.reply({

              content:
                `${EMOJI.warning} Ticket jest już przejęty.`,

              ephemeral: true
            });
          }

          // =====================================
          // HIDE ROLE
          // =====================================
          await interaction.channel.permissionOverwrites.edit(

            REALIZATOR_ROLE_ID,

            {
              ViewChannel: false
            }
          );

          // =====================================
          // ADD USER ACCESS
          // =====================================
          await interaction.channel.permissionOverwrites.edit(

            interaction.user.id,

            {

              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
              ManageMessages: true
            }
          );

          // save
          claimedTickets.set(

            interaction.channel.id,

            interaction.user.id
          );

          // embed
          const embed =
            new EmbedBuilder()

              .setColor("#57F287")

              .setDescription(
                `${EMOJI.zap} Ticket został przejęty przez ${interaction.user}`
              );

          return interaction.reply({

            embeds: [embed]
          });

        } catch (err) {

          console.log(
            "❌ /przejmij error:",
            err
          );
        }
      }

      // =====================================
      // /ODPRZYJMIJ
      // =====================================
      if (
        interaction.commandName ===
        "odprzyjmij"
      ) {

        try {

          // role check
          if (
            !interaction.member.roles.cache.has(
              REALIZATOR_ROLE_ID
            )
          ) {

            return interaction.reply({

              content:
                `${EMOJI.warning} Nie jesteś realizatorem.`,

              ephemeral: true
            });
          }

          // ticket check
          if (!validTicket) {

            return interaction.reply({

              content:
                `${EMOJI.warning} To nie jest ticket.`,

              ephemeral: true
            });
          }

          // not claimed
          if (
            !claimedTickets.has(
              interaction.channel.id
            )
          ) {

            return interaction.reply({

              content:
                `${EMOJI.warning} Ticket nie jest przejęty.`,

              ephemeral: true
            });
          }

          // =====================================
          // RESTORE ROLE
          // =====================================
          await interaction.channel.permissionOverwrites.edit(

            REALIZATOR_ROLE_ID,

            {

              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
              ManageMessages: true
            }
          );

          // =====================================
          // REMOVE USER OVERWRITE
          // =====================================
          await interaction.channel.permissionOverwrites.delete(

            claimedTickets.get(
              interaction.channel.id
            )

          ).catch(() => {});

          // remove claim
          claimedTickets.delete(
            interaction.channel.id
          );

          // embed
          const embed =
            new EmbedBuilder()

              .setColor("#FEE75C")

              .setDescription(
                `${EMOJI.lock} Ticket został oddany przez ${interaction.user}`
              );

          return interaction.reply({

            embeds: [embed]
          });

        } catch (err) {

          console.log(
            "❌ /odprzyjmij error:",
            err
          );
        }
      }
    }
  );
};
