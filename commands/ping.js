module.exports = {
    name: 'ping',
    help_menu: false,
    args: false,
    arguments: '',
    admin: false,
    execute(message, args, client, lang) {
        message.channel.send('Loading data').then((msg) => {
            msg.delete()
            message.channel.send(`🏓 Latency is **${msg.createdTimestamp - message.createdTimestamp}ms.** API Latency is **${Math.round(client.ws.ping)}ms**`);
        }).catch(console.log);
    },
};