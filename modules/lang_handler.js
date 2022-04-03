const fs = require('fs');
const fetch = require('node-fetch');

const langFolderPath = fs.realpathSync('./modules/languages');

console.log('\x1b[33m%s\x1b[0m', '[DEBUG] Lang handler ready!');

module.exports = {
    getlang(language) {
        language = language.toLowerCase();
        return new Promise(function (resolve, reject) {
            const file = fs.readFileSync(`${langFolderPath}/${language}.json`);
            resolve([JSON.parse(file), language]);
        });
    }, updatelang(language) {
        language = language.toLowerCase();
        fetch(`https://raw.githubusercontent.com/Official-Arctic-Studio/FreeGamesBotLanguage/main/lang/${language}.json`)
            .then(res => res.text())
            .then(text => {
                if (text != "404: Not Found")
                    fs.writeFileSync(`${langFolderPath}/${language}.json`, text)
            }).catch(console.log)
    },
    getavailable() {
        const langFiles = fs.readdirSync(langFolderPath).filter(file => file.endsWith('.json'));
        let languages = []
        for (langFile of langFiles) {
            languages.push(langFile.substring(0, langFile.length - 5))
        }
        return languages
    },
    setlanguageflag(language, flag) {
        const file = fs.readFileSync(`./modules/flags.json`);
        let flags = JSON.parse(file);
        flags[language] = flag;
        fs.writeFileSync('./modules/flags.json', JSON.stringify(flags));
    },
    getlanguageflag(language) {
        language = language.toLowerCase();
        const file = fs.readFileSync(`./modules/flags.json`);
        const flags = JSON.parse(file);
        if (typeof flags[language] != "undefined")
            return flags[language];
        else
            return "🏳️"
    },
};