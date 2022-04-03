const { getPrefix } = require("../modules/prefix_handler.js");
const db_handler = require("../modules/db_handler");

module.exports = {
    name: 'setup',
    help_menu: true,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        db_handler.select('`servers`', '*', `\`GuildID\`=${message.guild.id}`)
            .then(result => {
                if (result.length != 0)
                    db_handler.update('`servers`', `\`ChannelID\`=${message.channel.id}`, `\`GuildID\`=${message.guild.id}`)
                        .then(message.channel.send(lang.commands.setup.updated));
                else
                    db_handler.insert('`servers`', '(`GuildID`,`ChannelID`)', `(${message.guild.id},${message.channel.id})`)
                        .then(async () => {
                            let prefix = await getPrefix(message.guild.id)
                            message.channel.send(`${lang.commands.setup.success1} **${prefix} test** ${lang.commands.setup.success2}`)
                        });
            }).catch(console.log);
    },
};