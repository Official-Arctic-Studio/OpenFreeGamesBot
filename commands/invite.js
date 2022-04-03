const { MessageButton, MessageActionRow } = require("discord-buttons");
const Discord = require("discord.js-light");

module.exports = {
    name: 'invite',
    help_menu: false,
    args: false,
    arguments: '',
    admin: false,
    execute(message, args, client, lang) {
        let inviteButton = new MessageButton()
            .setLabel("Invite")
            .setStyle("url")
            .setURL("https://discord.com/oauth2/authorize?client_id=698117737175580692&permissions=445504&scope=bot")
        message.channel.send(lang.commands.invite.thanks, inviteButton);
    },
};