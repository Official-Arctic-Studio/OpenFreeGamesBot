const Discord = require("discord.js-light");

const db_handler = require("./db_handler");
const lang_handler = require("./lang_handler");
const permissions_handler = require("./permissions_handler");

//PLEASE REFACTOR THIS!
const UplayIcon =
  "https://cdn.discordapp.com/attachments/698531018826580069/736392655923183646/Ubisoft-Logo-Grey.png";
const SteamIcon =
  "https://cdn2.iconfinder.com/data/icons/gaming-platforms-logo-shapes/250/steam_logo-512.png";
const EpicIcon = "https://cdn2.pu.nl/media/sven/epicgameslogo.png";
const HumbleIcon =
  "https://cdn.discordapp.com/attachments/698531018826580069/759530809102565406/unknown.png";
const GOGIcon =
  "https://cdn.discordapp.com/attachments/698531018826580069/793990394525909002/gog-galaxy-1-555623.png";

function generateEmbed(serversRow, gamesRow, lang, _check_config = true) {
  return new Promise(function (resolve, reject) {
    let icon = "";
    let temp = gamesRow.State.toLowerCase();
    if (serversRow == null) _check_config = false;
    if (_check_config) {
      if (temp.includes("weekend") && !serversRow.config_weekend) resolve(null);
    }
    switch (gamesRow.Store) {
      case "Epic":
        icon = EpicIcon;
        if (_check_config) {
          if (!serversRow.config_epic) {
            resolve(null);
          }
        }
        break;
      case "Steam":
        icon = SteamIcon;
        if (_check_config) {
          if (!serversRow.config_steam) {
            resolve(null);
          }
        }
        break;
      case "Uplay":
        icon = UplayIcon;
        if (_check_config) {
          if (!serversRow.config_uplay) {
            resolve(null);
          }
        }
        break;
      case "Humble":
        icon = HumbleIcon;
        if (_check_config) {
          if (!serversRow.config_humble) {
            resolve(null);
          }
        }
        break;
      case "GOG":
        icon = GOGIcon;
        if (_check_config) {
          if (!serversRow.config_gog) {
            resolve(null);
          }
        }
        break;
      default:
        break;
    }

    const FreeGameEmbed = new Discord.MessageEmbed()
      .setColor("#2F3136")
      .setTitle(gamesRow.Name)
      .setImage(gamesRow.Image)
      .setThumbnail(icon)
      .addFields(
        {
          name: lang.free_games_embed_announce.free_until,
          value: "📅 " + gamesRow.TimeLeft,
        },
        { name: lang.free_games_embed_announce.state, value: gamesRow.State },
        {
          name: lang.free_games_embed_announce.support_us.name,
          value: lang.free_games_embed_announce.support_us.value,
        }
      )
      .setFooter(lang.free_games_embed_announce.footer)
      .setURL(gamesRow.Link)
      .setTimestamp();
    resolve(FreeGameEmbed);
  });
}
//

function sleep(timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

//please refactor this pls
module.exports = {
  announce(client) {
    db_handler
      .select(
        "`games`",
        "*",
        "`Name` IN (SELECT `Name` FROM `awaiting_approval` WHERE `approved`=1)"
      )
      .then(async (games) => {
        console.time("Announcements");
        for (language of lang_handler.getavailable()) {
          let amt = 0;
          let lang = await lang_handler.getlang(language);
          let servers = await db_handler.select(
            "`servers`",
            "*",
            `\`language\`="${lang[1]}"`
          );

          if (servers.length == 0) continue;

          console.time(lang[1]);
          console.log(
            "\x1b[36m%s\x1b[0m",
            `[ANNOUNCEMENT] Started announcing in ${servers.length} servers | [Lang] ${lang[1]} | [SHARDID] ${client.shard.ids[0]}`
          );
          for (server of servers) {
            let guildID = server.GuildID;
            let channelID = server.ChannelID;
            let tagID = server.RoleID;
            let guild = client.guilds.cache.find((g) => g.id == guildID);
            if (!guild) continue;
            let channel = guild.channels.cache.find((c) => c.id == channelID);
            if (!channel) continue;
            let insufficient_permissions = false;
            for (game of games) {
              try {
                if (insufficient_permissions == true) continue;
                const FreeGameEmbed = await generateEmbed(
                  server,
                  game,
                  lang[0]
                );
                if (FreeGameEmbed == null) {
                  insufficient_permissions = true;
                  continue;
                }
                let data = await permissions_handler.check_bot_perms(
                  client,
                  channel,
                  [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "EMBED_LINKS",
                    "ATTACH_FILES",
                  ]
                );

                if (!data[0]) {
                  let allowed = await permissions_handler.check_bot_perms(
                    client,
                    channel,
                    ["VIEW_CHANNEL", "SEND_MESSAGES"]
                  );
                  if (allowed[0])
                    await channel.send(
                      `${
                        lang[0].free_games_embed_announce.perms_missing
                      } \n${data[1].join(", ")}`
                    );
                  insufficient_permissions = true;
                  continue;
                } else {
                  await channel.send(FreeGameEmbed);
                }
              } catch (e) {
                console.log(e);
                console.log(
                  "\x1b[31m%s\x1b[0m",
                  `[ANNOUNCEMENT] An error occured announcing game, waiting 1 second!`
                );
                await sleep(1000);
                continue;
              }
            }
            amt++;
            try {
              if (insufficient_permissions) continue;
              if (server.config_everyone) {
                let hasPerms = await permissions_handler.check_bot_perms(
                  client,
                  channel,
                  ["MENTION_EVERYONE"]
                );
                if (hasPerms[0]) await channel.send("@everyone");
              } else if (guild.roles.cache.find((r) => r.id == tagID)) {
                await channel.send(`<@&${tagID}>`);
              }
            } catch (e) {
              console.log(e);
              console.log(
                "\x1b[31m%s\x1b[0m",
                `[ANNOUNCEMENT] An error occured announcing game, waiting 1 second!`
              );
              await sleep(1000);
            }
          }
          console.timeEnd(lang[1]);
          console.log(
            "\x1b[34m%s\x1b[0m",
            `[ANNOUNCEMENT] Announced successfully in ${amt} | [Lang] ${lang[1]} | [SHARDID] ${client.shard.ids[0]}`
          );
        }
        client.queue.sweep((announced) => announced == true);
        let shards = Array.from(client.queue.keys());

        console.timeEnd("Announcements");
        try {
          await client.shard.broadcastEval(`this.finishedAnnouncing(${client.shard.ids[0]})`);
          if (shards.length > 0) {
            await client.shard.broadcastEval(`this.announce(${shards[0]})`);
          } else {
            console.log("\x1b[32m%s\x1b[0m", `[ANNOUNCEMENT] Done announcing!`);
            await client.shard.broadcastEval(`this.reset()`);
            await db_handler.delete("`awaiting_approval`", "`approved`=1");
          }
        } catch (e) {
          console.log(e);
          console.log(
            "\x1b[31m%s\x1b[0m",
            `[ANNOUNCEMENT] An error occured announcing in next shard!`
          );
        }
      })
      .catch(console.log);
  },
  genApprovalMessage(game) {
    return new Promise(function (resolve, reject) {
      lang_handler.getlang("en_us").then(async (lang) => {
        let embed = await generateEmbed(null, game, lang[0]);
        resolve(embed);
      });
    });
  },
};
