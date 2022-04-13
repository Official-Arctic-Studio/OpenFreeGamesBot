const announcement_handler = require("../modules/announcement_handler");
const lang_handler = require("../modules/lang_handler")

const {
    gid_approve,
    cid_approve
} = require("../config.json");
const db_handler = require("../modules/db_handler");
const { MessageActionRow, MessageButton } = require("discord-buttons");

//kleine bugg waar laatste alleen in db komt
module.exports = {
    name: 'getcurrent',
    help_menu: false,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        let guild = client.guilds.cache.find(g => g.id == gid_approve);
        if (!guild) return;
        let channel = guild.channels.cache.find(c => c.id == cid_approve);
        if (!channel) return;
        db_handler.select('`games`', "*", "NOT `Name` IN (SELECT `Name` FROM `announced`)")
            .then(async games => {
                for (game of games) {
                    let embed = await announcement_handler.genApprovalMessage(game)

                    db_handler.insert('`announced`', "(`Name`)", `("${game.Name}")`)
                    db_handler.insert('`awaiting_approval`', "(`Name`)", `("${game.Name}")`)
                    let buttons = new MessageActionRow()

                    let approve_button = new MessageButton()
                        .setEmoji("✅")
                        .setLabel("Approve")
                        .setStyle("green")
                        .setID(`approve_${game.Name}`)

                    let deny_button = new MessageButton()
                        .setEmoji("❌")
                        .setLabel("Deny")
                        .setStyle("red")
                        .setID(`deny_${game.Name}`)

                    buttons.addComponent(approve_button);
                    buttons.addComponent(deny_button);

                    await channel.send("\u007F", { embed: embed, components: buttons });

                }
            })
    },
};