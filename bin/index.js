#!/usr/bin/env node

var program = require('commander');
const fs = require('fs');
const trash = require('trash');
const path = require('path');
const googleTranslateFactory = require('google-translate');
const package = require('../package.json');

program
    .name('chrome-extension-translate')
    .version(package.version)
    .arguments('<api_key> [locales...]')
    .action(async function (apiKey, extraLocales) {
        extraLocales = extraLocales || [];
        const dir = process.cwd();
        let manifest;

        try {
            manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json').toString()));
        } catch (err) {
            console.error('Malformed manifest.json file.');
            process.exit(1);
        }

        const defaultLocale = manifest.default_locale;

        if (defaultLocale === undefined) {
            console.error('You have to specify "default_locale" in your manifest.json file.');
            exit(1);
        }

        const defaultLocaleMessages = JSON.parse(fs.readFileSync(
            path.join(dir, '_locales', defaultLocale, 'messages.json')).toString());

        const locales = fs.readdirSync(path.join(dir, '_locales'))
            .map(dir => path.basename(dir))
            .concat(extraLocales)
            .filter(x => x !== defaultLocale);

        const googleTranslate = googleTranslateFactory(apiKey);

        const translations = new Array(locales.length);
        for (let i = 0; i < translations.length; i++) {
            const locale = locales[i];
            translations[i] = {};
            
            if (fs.existsSync(path.join(dir, '_locales', locale, 'messages.json'))) {
                const messages =  JSON.parse(fs.readFileSync(path.join(dir, '_locales', locale, 'messages.json')));
                Object.keys(messages).forEach(key => {
                    translations[i][key] = { message: messages[key].message };
                });
            }
            const keys = Object.keys(defaultLocaleMessages).filter(key => !translations[i][key]);
            if (keys.length > 0) {
                (await translate(keys.map(x =>
                defaultLocaleMessages[x].message), defaultLocale, locales[i]
                )).forEach((message, j) => {
                    translations[i][keys[j]] = { message };
                });
            }
        }

        const messagesFiles = locales.map(locale => path.join(dir, '_locales', locale, 'messages.json'));

        await trash(messagesFiles);

        for (let i = 0; i < messagesFiles.length; i++) {
            if ( !fs.existsSync(path.dirname(messagesFiles[i]))) {
                fs.mkdirSync(path.dirname(messagesFiles[i]));
            }
            fs.writeFileSync(messagesFiles[i], JSON.stringify(translations[i], null, 4));
        }

        console.log('Done! The old messages.json files have been moved to the trash.');

        function translate(strings, source, target) {
            return new Promise((resolve, reject) => {
                googleTranslate.translate(strings, source, target, function (err, translations) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    resolve(translations.map(x => x.translatedText));
                });
            });
        }
    });

program.parse(process.argv);

