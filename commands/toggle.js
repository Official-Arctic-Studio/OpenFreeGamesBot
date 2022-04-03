const { getPrefix } = require("../modules/prefix_handler.js");
const db_handler = require("../modules/db_handler");

//OLD COMMAND

module.exports = {
    name: 'toggle',
    help_menu: false,
    args: false,
    arguments: 'steam | epic | uplay | humble | gog | weekend.',
    admin: true,
    async execute(message, args, client, lang) {
        let prefix = await getPrefix(message.guild.id)
        message.reply(`This command is outdated, please use **${prefix} config**`)
        // db_handler.select('`servers`', "*", `\`GuildID\`=${message.guild.id}`)
        //     .then(server => {
        //         //PLEASE REFACTOR THIS!
        //         if (server.length == 0)
        //             return message.channel.send(lang.commands.toggle.not_setup)
        //         let steam = server[0].config_steam;
        //         let epic = server[0].config_epic;
        //         let uplay = server[0].config_uplay;
        //         let humble = server[0].config_humble;
        //         let weekend = server[0].config_weekend;
        //         let gog = server[0].config_gog;

        //         switch (args[0].toLowerCase()) {
        //             case "steam":
        //                 steam ? steam = 0 : steam = 1;
        //                 message.channel.send(steam ? lang.commands.toggle.options.steam.will : lang.commands.toggle.options.steam.wont)
        //                 break;
        //             case "epic":
        //                 epic ? epic = 0 : epic = 1;
        //                 message.channel.send(epic ? lang.commands.toggle.options.epic.will : lang.commands.toggle.options.epic.wont)
        //                 break;
        //             case "uplay":
        //                 uplay ? uplay = 0 : uplay = 1;
        //                 message.channel.send(uplay ? lang.commands.toggle.options.uplay.will : lang.commands.toggle.options.uplay.wont)
        //                 break;
        //             case "humble":
        //                 humble ? humble = 0 : humble = 1;
        //                 message.channel.send(humble ? lang.commands.toggle.options.humble.will : lang.commands.toggle.options.humble.wont)
        //                 break;
        //             case "weekend":
        //                 weekend ? weekend = 0 : weekend = 1;
        //                 message.channel.send(weekend ? lang.commands.toggle.options.weekend.will : lang.commands.toggle.options.weekend.wont)
        //                 break;
        //             case "gog":
        //                 gog ? gog = 0 : gog = 1;
        //                 message.channel.send(gog ? lang.commands.toggle.options.gog.will : lang.commands.toggle.options.gog.wont)
        //                 break;
        //             default:
        //                 message.channel.send(`${lang.commands.toggle.specify_option} **${this.arguments}**`);
        //                 break;
        //         }
        //         db_handler.update('`servers`', `\`config_weekend\`=${weekend},\`config_epic\`=${epic},\`config_steam\`=${steam},\`config_uplay\`=${uplay},\`config_humble\`=${humble},\`config_gog\`=${gog}`, `\`GuildID\`=${message.guild.id}`)
        //     }).catch(console.log)
    },
};