const Discord = require("discord.js-light");

const db_handler = require("../modules/db_handler");

function generateEmbed(language) {
    return new Promise(function (resolve, reject) {
        db_handler.select('`games`')
            .then(games => {
                let freeGamesEmbed = new Discord.MessageEmbed()
                    .setColor('#2F3136')
                    .setTitle(language.free_games_embed_get.title)
                    .setTimestamp()
                    .setFooter("Free Games Bot", "https://cdn.discordapp.com/attachments/698531018826580069/698593969143283802/3.png")

                //PLEASE REFACTOR THIS!!
                let epic = "";
                let steam = "";
                let uplay = "";
                let humble = "";
                let gog = "";
                for (game of games) {
                    switch (game.Store) {
                        case "Epic":
                            epic += `[${game.Name}](${game.Link}) | ${game.TimeLeft} | ${game.State}\n`;
                            break;
                        case "Steam":
                            steam += `[${game.Name}](${game.Link}) | ${game.TimeLeft} | ${game.State}\n`;
                            break;
                        case "Uplay":
                            uplay += `[${game.Name}](${game.Link}) | ${game.TimeLeft} | ${game.State}\n`;
                            break;
                        case "Humble":
                            humble += `[${game.Name}](${game.Link}) | ${game.TimeLeft} | ${game.State}\n`;
                            break;
                        case "GOG":
                            gog += `[${game.Name}](${game.Link}) | ${game.TimeLeft} | ${game.State}\n`;
                            break;
                        default:
                            break;
                    }
                }
                if (epic != "")
                    freeGamesEmbed.addField("Epic Games", epic);
                if (steam != "")
                    freeGamesEmbed.addField("Steam", steam);
                if (uplay != "")
                    freeGamesEmbed.addField("Uplay", uplay);
                if (humble != "")
                    freeGamesEmbed.addField("Humble", humble);
                if (gog != "")
                    freeGamesEmbed.addField("GOG", gog);
                if (games.length > 0)
                    resolve(freeGamesEmbed)
                else
                    resolve(language.free_games_embed_get.no_games);
            }).catch(reject)
    });
}

module.exports = {
    name: 'get',
    help_menu: true,
    args: false,
    arguments: '',
    admin: false,
    execute(message, args, client, lang) {
        generateEmbed(lang)
            .then(embed => message.channel.send(embed))
            .catch(console.log)
    },
};