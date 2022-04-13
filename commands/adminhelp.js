const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'adminhelp',
    help_menu: false,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        message.channel.send("commands are: forceannounce | getcurrent | setlangflag | updatelang");
    },
};