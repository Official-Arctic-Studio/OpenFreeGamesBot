const Discord = require("discord.js-light");
const db_handler = require("../modules/db_handler");
const permissions_handler = require("../modules/permissions_handler");

function generateEmbed(lang) {
    let icon = "https://cdn.discordapp.com/attachments/698531018826580069/698593969143283802/3.png";
    let image = "https://cdn.discordapp.com/attachments/698531018826580069/851830532907597915/unknown.png";
    const FreeGameEmbed = new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setTitle("Test announement")
        .setImage(image)
        .setThumbnail(icon)
        .addFields(
            { name: lang.free_games_embed_announce.free_until, value: "📅 -" },
            { name: lang.free_games_embed_announce.state, value: "Test" },
            { name: lang.free_games_embed_announce.support_us.name, value: lang.free_games_embed_announce.support_us.value }
        )
        .setFooter(lang.free_games_embed_announce.footer)
        .setURL("https://www.arcticstudio.info/")
        .setTimestamp()
    return FreeGameEmbed
}

module.exports = {
    name: 'test',
    help_menu: false,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        db_handler.select('`servers`', '*', `\`GuildID\`=${message.guild.id}`)
            .then(servers => {
                if (servers.length == 0)
                    return message.channel.send('setup pls')
                let server = servers[0]
                let guildID = server.GuildID;
                let channelID = server.ChannelID;
                let tagID = server.RoleID;
                let guild = client.guilds.cache.find(g => g.id == guildID);
                if (!guild) return;
                let channel = guild.channels.cache.find(c => c.id == channelID);
                if (!channel) return;
                let insufficient_permissions = false;

                const FreeGameEmbed = generateEmbed(lang)

                permissions_handler.check_bot_perms(client, channel, ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'])
                    .then(data => {
                        if (!data[0]) {
                            permissions_handler.check_bot_perms(client, channel, ['VIEW_CHANNEL', 'SEND_MESSAGES'])
                                .then(allowed => { if (allowed[0]) channel.send(`${lang.free_games_embed_announce.perms_missing} \n${data[1].join(", ")}`) })
                            insufficient_permissions = true;
                            return;
                        } else {
                            channel.send(FreeGameEmbed);
                        }
                    })

                if (server.config_everyone) {
                    permissions_handler.check_bot_perms(client, channel, ['MENTION_EVERYONE'])
                        .then(hasPerms => {
                            if (hasPerms[0])
                                channel.send('@everyone')
                        })
                } else if (guild.roles.cache.find(r => r.id == tagID)) {
                    channel.send(`<@&${tagID}>`);
                }
            }).catch(console.log);
    },
};