const { MessageButton, MessageActionRow } = require("discord-buttons");
const db_handler = require("./db_handler");
const lang_handler = require("./lang_handler");

const Discord = require("discord.js");

const stores = [
    "steam",
    "epic",
    "uplay",
    "humble",
    "gog",
    "weekend"
]

function gen_lang_buttons(server) {
    let lang_buttons = [];
    lang_buttons.push(new MessageActionRow());
    let languages = lang_handler.getavailable();
    let current_index = 0;
    let iter = 0;
    for (language of languages) {
        let button = new MessageButton()
            .setID(`lang_${language}`)
            .setLabel(language.toUpperCase())
            .setEmoji(lang_handler.getlanguageflag(language))
            .setStyle((language == server[0].language.toLowerCase()) ? "green" : "red")
        if (iter == 3) {
            iter = 0;
            current_index++;
            lang_buttons.push(new MessageActionRow());
        }
        lang_buttons[current_index].addComponent(button);
        iter++;
    }

    return lang_buttons;
}

function gen_store_buttons(server) {
    let store_buttons1 = new MessageActionRow();
    let store_buttons2 = new MessageActionRow();

    for (store in stores) {
        let button = new MessageButton()
            .setID(`toggle_${stores[store]}`)
            .setLabel(stores[store])
            .setStyle(server[0][`config_${stores[store]}`] ? "green" : "red")
        if (store < 3) {
            store_buttons1.addComponent(button);
        } else {
            store_buttons2.addComponent(button);
        }
    }

    return [store_buttons1, store_buttons2]
}

module.exports = {
    clicked(button) {
        button.clicker.fetch().then(() => {
            button.reply.defer()
            if (button.id.startsWith("toggle_") && button.clicker.member.hasPermission("ADMINISTRATOR")) {
                let store = button.id.substr(7);
                db_handler.select('`servers`', `\`config_${store}\``, `\`GuildID\`=${button.message.guild.id}`).then(config => {
                    if (config.length == 0) return;
                    let set_toggle = (config[0][`config_${store}`])
                    set_toggle = set_toggle ? 0 : 1;
                    db_handler.update('`servers`', `\`config_${store}\`=${set_toggle}`, `\`GuildID\`=${button.message.guild.id}`)
                    db_handler.select('`servers`', "*", `\`GuildID\`=${button.message.guild.id}`)
                        .then(server => {
                            if (server.length == 0) return;
                            lang_handler.getlang(server[0].language)
                                .then(lang => {
                                    let embed = new Discord.MessageEmbed()
                                        .setColor('#2F3136')
                                        .addField(lang[0].commands.config.toggle, "** **")

                                    button.message.edit({
                                        components: gen_store_buttons(server),
                                        embed: embed
                                    })
                                })

                        });
                })
            }
            else if (button.id.startsWith("lang_") && button.clicker.member.hasPermission("ADMINISTRATOR")) {
                db_handler.update('`servers`', `\`language\`="${button.id.substr(5)}"`, `\`GuildID\`=${button.message.guild.id}`)
                db_handler.select('`servers`', "*", `\`GuildID\`=${button.message.guild.id}`)
                    .then(server => {
                        if (server.length == 0) return;
                        lang_handler.getlang(server[0].language)
                            .then(lang => {
                                let embed2 = new Discord.MessageEmbed()
                                    .addField(lang[0].commands.config.language, "** **")
                                    .setColor('#2F3136')

                                button.message.edit({
                                    components: gen_lang_buttons(server),
                                    embed: embed2
                                })
                            })

                    });
            }
            else if (button.id.startsWith("approve_") && button.clicker.member.hasPermission("ADMINISTRATOR")) {
                let gameName = button.id.substr(8)
                db_handler.update('`awaiting_approval`', '`approved`=1', `\`Name\`="${gameName}"`)
                button.message.delete();
            }
            else if (button.id.startsWith("deny_") && button.clicker.member.hasPermission("ADMINISTRATOR")) {
                let gameName = button.id.substr(5)
                db_handler.delete('`awaiting_approval`', `\`Name\`="${gameName}"`)
                button.message.delete();
            }
        }).catch(console.log)
    },
    gen_store_buttons(server) {
        return gen_store_buttons(server)
    },
    gen_lang_buttons(server) {
        return gen_lang_buttons(server)
    },
};
