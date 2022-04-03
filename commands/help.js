const { getPrefix } = require("../modules/prefix_handler.js");
const Discord = require("discord.js-light");

const {
    defaultPrefix
} = require('../config.json');

function gen_help(language, client, guildID) {
    return new Promise(async function (resolve, reject) {
        let HelpEmbed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setTitle(language.help_menu.title)
            .setThumbnail('https://cdn.discordapp.com/attachments/698531018826580069/698593969143283802/3.png')
            .setFooter("This bot was made by GameFreak21#1956 and Siddhartt#2194")

        let guildPrefix = await getPrefix(guildID);

        let commands = client.commands.array();
        let newCommands = [];
        for(cmd of commands){
            if(cmd.name == "help")
                newCommands.push(cmd)
        }
        for(cmd of commands){
            if(cmd.name != "help")
                newCommands.push(cmd)
        }
        for (command of newCommands) {
            if (command.help_menu)
                HelpEmbed.addField(`${guildPrefix} ${command.name} ${command.arguments}`, language.help_menu.commands[command.name], true)
        }
        HelpEmbed.addFields(
            { name: "** **", value: "** **" },
            { name: "Support", value: "** **" },
            { name: language.help_menu.support.name, value: language.help_menu.support.value },
            { name: language.help_menu.discord.name, value: language.help_menu.discord.value }
        )
        resolve(HelpEmbed)
    });
}

module.exports = {
    name: 'help',
    help_menu: true,
    args: false,
    arguments: '',
    admin: false,
    execute(message, args, client, lang) {
        gen_help(lang, client, message.guild.id)
            .then(helpembed => message.channel.send(helpembed))
            .catch(console.log)
    },
};