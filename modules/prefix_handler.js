const db_handler = require("./db_handler");

module.exports = {
    setPrefix(prefix, guildID) {
        db_handler.update('`prefix`', `\`prefix\`="${prefix}"`, `\`GuildID\`="${guildID}"`)
    },
    getPrefix(guildID) {
        return new Promise(function (resolve, reject) {
            db_handler.select('`prefix`', "`prefix`", `\`GuildID\`="${guildID}"`)
                .then(data => {
                    if (data.length == 0) {
                        resolve("FG")
                    } else {
                        resolve(data[0].prefix);
                    }
                })
        })
    },
};