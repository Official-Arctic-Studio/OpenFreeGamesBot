const db_handler = require("../modules/db_handler");

module.exports = {
    name: 'stop',
    help_menu: true,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        db_handler.delete('`servers`', `\`GuildID\`=${message.guild.id}`)
            .then(message.channel.send(lang.commands.stop.success));
    },
};