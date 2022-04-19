const lang_handler = require("../modules/lang_handler")

module.exports = {
    name: 'setlangflag',
    help_menu: false,
    args: true,
    arguments: '',
    admin: true,
    execute(message, args, client, lang) {
        if(args.length < 2)
            return message.channel.send("fu setlangflag [language] [flagEmoji]")
        lang_handler.setlanguageflag(args[0], args[1])
        message.channel.send(`updated ${args[0]} with flag ${args[1]}`)
    },
};