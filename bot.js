const Discord = require("discord.js-light");
const fs = require("fs");

Discord.version = "12.0.0";

const perm_handler = require("./modules/permissions_handler.js");
const db_handler = require("./modules/db_handler.js");
const lang_handler = require("./modules/lang_handler.js");

const client = new Discord.Client({
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: false,
  cachePresences: false,
});

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.queue = new Discord.Collection();
client.doneQueue = new Discord.Collection();

const DiscButton = require("discord-buttons")(client);
const prefix = require("./modules/prefix_handler.js");

const { defaultPrefix, token } = require("./config.json");

const button_handler = require("./modules/button_handler.js");
const announcement_handler = require("./modules/announcement_handler.js");

const DBL = require("dblapi.js");

const dbl = new DBL(
  "KEY",
  client
);

dbl.on("posted", () => {
  console.log("\x1b[33m%s\x1b[0m", "[DEBUG/DBL] Posted to DBL!");
});

client.once("ready", () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    `[ONLINE] Bot online! | [ShardID] ${client.shard.ids[0]}`
  );
  client.user.setActivity("Free Games");
  for (let shard = 0; shard < client.shard.count; shard++) {
    client.queue.set(shard, false);
    client.doneQueue.set(shard, false);
  }
  setInterval(async () => {
    try {
      dbl.postStats(
        client.guilds.cache.size,
        client.shard.ids[0],
        client.shard.count
      );
    } catch {
      console.log("Dbl Down!");
    }
  }, 600000);
});

client.login(token);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("clickButton", (button) => {
  button_handler.clicked(button);
});

client.on("message", async (message) => {
  if (!message.guild) return;

  let guildPrefix = await prefix.getPrefix(message.guild.id);

  if (
    !message.content.toLowerCase().startsWith(guildPrefix.toLowerCase()) ||
    message.author.bot
  )
    return;
  const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  perm_handler
    .check_bot_perms(client, message.channel, [
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
    ])
    .then((data) => {
      if (!data[0]) {
        perm_handler
          .check_bot_perms(client, message.channel, [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
          ])
          .then((allowed) => {
            if (allowed[0])
              message.channel.send(
                `Missing permissions! \n${data[1].join(", ")}`
              );
          });
        return;
      } else {
        db_handler
          .select("`servers`", "`language`", `\`GuildID\`=${message.guild.id}`)
          .then((language) => {
            let lang = "en_us";
            if (language.length != 0) lang = language[0].language;
            lang_handler.getlang(lang).then((lang) => {
              if (command.admin && !perm_handler.admin(message))
                return message.channel.send(
                  lang[0].commands.insufficient_permissions
                );
              if (command.args && args.length == 0)
                return message.channel.send(
                  `Could not execute command, use **${guildPrefix} help** for help`
                );
              try {
                command.execute(message, args, client, lang[0]);
              } catch (error) {
                console.error(error);
                message.reply(
                  "There was an error executing this command! \nPlease contact the bots developers."
                );
              }
            });
          });
      }
    })
    .catch(console.log);
});

client.announce = (shardID) => {
  client.queue.set(shardID, true);
  if (shardID == client.shard.ids[0]) {
    announcement_handler.announce(client);
  }
};

client.finishedAnnouncing = (shardID) => {
  client.doneQueue.set(shardID, true);
};

client.reset = () => {
  client.doneQueue.sweep((announced) => announced == true);
  let shards = Array.from(client.doneQueue.keys());
  if (shards.length == 0) {
    for (let shard = 0; shard < client.shard.count; shard++) {
      client.queue.set(shard, false);
      client.doneQueue.set(shard, false);
    }
  }
};
