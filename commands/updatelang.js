const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'updatelang',
    help_menu: false,
    args: true,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        if (message.guild.id != "664194615817142302") return;
        lang_handler.updatelang(args[0])
        message.channel.send(`updated ${args[0]}`)
    },
};