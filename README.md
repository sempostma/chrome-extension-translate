# chrome-extension-translate

Translate messages in the _locales directory from the default_language to other languages in the _locales directory or locales listed as arguments to the command.

## Installation

Please install as a global dependency or use it via npx or any other way you like.

```bash
npm i -g chrome-extension-translate # do not forget the global (-g) flag
```

## Usage

```bash
Usage: chrome-extension-translate <api_key> [locales...]

Options:
  -V, --version  output the version number
  -h, --help     output usage information
```

## Guide

You can create an api key here: [https://console.cloud.google.com/apis/api/translate.googleapis.com/credentials](https://console.cloud.google.com/apis/api/translate.googleapis.com/credentials)

If you already have a messages.json file in the "en" _locales directory [https://developer.chrome.com/apps/i18n-messages](https://developer.chrome.com/apps/i18n-messages), you can translate it by running: 

Define a "default_locale" in the manifest.json file like this:

```json
{
    ...
    "default_locale": "en",
    ...
}
```

In this example the default locale is english.

```bash
chrome-extension-translate <API_KEY> fr nl fi
```

In this example we want to generate translations for the languages: French, Dutch and Finnish. After running the command 3 new folders (fr, nl and fi folders) will be created in the _locales folder. The next time you run this command you don't need to specify the locales because it looks in _locales folder for translations:

```bash
chrome-extension-translate <API_KEY>
```

This extension only translates messages that do not already exist. For example, if the "helloWorld" message already exists in french, it will not be translated from english. This allows you to easily edit the french translation without it being overwritten each time you run the command. 

You can run this command from any directory containing _locales folder and a manifest.json file with a default_locale entry.

## Example

```bash
chrome-extension-translate "$API_KEY" ar am bg bn ca cs da de el en es et fa fi fil fr gu he hi hr hu id it ja kn ko lt lv ml mr ms nl no pl ro ru sk sl sr sv sw ta te th tr uk vi
```


