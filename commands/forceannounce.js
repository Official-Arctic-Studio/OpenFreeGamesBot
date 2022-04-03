const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'forceannounce',
    help_menu: false,
    args: false,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        if (message.guild.id != "664194615817142302") return;
        client.shard.broadcastEval(`this.announce(0)`).then(() => {
            message.channel.send("force announcing in all servers!")
        }).catch(console.log);
        client.shard.broadcastEval(`this.announce(1)`).catch(console.log);
        client.shard.broadcastEval(`this.announce(2)`).catch(console.log);
    },
};