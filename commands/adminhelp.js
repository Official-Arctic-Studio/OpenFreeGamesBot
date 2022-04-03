const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'adminhelp',
    help_menu: false,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        if (message.guild.id != "664194615817142302") return;
        message.channel.send("commands are: forceannounce | getcurrent | setlangflag | updatelang");
    },
};