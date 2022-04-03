const db_handler = require("../modules/db_handler");

module.exports = {
    name: 'role',
    help_menu: true,
    args: true,
    arguments: '@role/off',
    admin: true,
    execute(message, args, client, lang) {
        db_handler.select('`servers`', '*', `\`GuildID\`=${message.guild.id}`)
            .then(result => {
                if (result.length == 0)
                    return message.channel.send(lang.commands.not_setup)
                if (message.mentions.roles.size == 0 && !message.mentions.everyone && args[0] != 'off') {
                    return message.channel.send(lang.commands.role.tag_a_role)
                }
                let tagID = null;
                if (message.mentions.roles.first())
                    tagID = message.mentions.roles.first().id;
                db_handler.update('`servers`', `\`RoleID\`=${tagID},\`config_everyone\`=${message.mentions.everyone}`, `\`GuildID\`=${message.guild.id}`)
                    .then(() => {
                        if(tagID == null && !message.mentions.everyone)
                            return message.channel.send(lang.commands.role.stopped)
                        message.channel.send(message.mentions.everyone ? lang.commands.role.everyone : `<@&${tagID}> ` + lang.commands.role.role_success)
                    })
            }).catch(console.log);
    },
};