const { setPrefix } = require("../modules/prefix_handler.js");
const db_handler = require("../modules/db_handler");

module.exports = {
    name: 'setprefix',
    help_menu: false,
    args: true,
    arguments: 'prefix',
    admin: true,
    execute(message, args, client, lang) {
        setPrefix(args[0], message.guild.id);
        message.channel.send(`${lang.commands.setprefix.changed} ${args[0]}`)
    },
};