const lang_handler = require("../modules/lang_handler");
const { getPrefix } = require("../modules/prefix_handler");

//OLD 
module.exports = {
    name: 'setlang',
    help_menu: false,
    args: false,
    arguments: 'language',
    admin: true,
    async execute(message, args, client, lang) {
        let prefix = await getPrefix(message.guild.id)
        message.reply(`This command is outdated, please use **${prefix} config**`)
    },
};