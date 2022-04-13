const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'updatelang',
    help_menu: false,
    args: true,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        lang_handler.updatelang(args[0])
        message.channel.send(`updated ${args[0]}`)
    },
};