const { MessageButton, MessageActionRow } = require("discord-buttons");
const Discord = require("discord.js-light");
const button_handler = require("../modules/button_handler");
const db_handler = require("../modules/db_handler");

module.exports = {
    name: 'config',
    help_menu: true,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        db_handler.select('`servers`', "*", `\`GuildID\`=${message.guild.id}`)
            .then(server => {
                if (server.length == 0)
                    return message.channel.send(lang.commands.not_setup)
                //current prefix: {prefix} to change use {prefix} prefix
                let mainEmbed = new Discord.MessageEmbed()
                    .setTitle(lang.commands.config.title)
                    .setDescription(lang.commands.config.description)
                    .setColor('#2F3136')

                let embed = new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .addField(lang.commands.config.toggle, "** **")

                let embed2 = new Discord.MessageEmbed()
                    .addField(lang.commands.config.language, "** **")
                    .setColor('#2F3136')

                message.channel.send(mainEmbed)
                message.channel.send({ components: button_handler.gen_store_buttons(server), embed: embed })
                message.channel.send({ components: button_handler.gen_lang_buttons(server), embed: embed2 })
            });
    },
};