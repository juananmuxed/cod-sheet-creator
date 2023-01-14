
# ⚔️ CoS Sheet Creator 
 
 ⌨️ with ❤︎ by <a href="https://muxed.dev">MuXeD</a>

 
[![License](https://img.shields.io/github/license/juananmuxed/cod-sheet-creator?label=License)](LICENSE) [![Discord](https://img.shields.io/discord/324463341819133953?color=purple&label=Discord&logo=discord)](https://discord.gg/88rzwfU)

### GitHub Status

![Release](https://img.shields.io/github/v/release/juananmuxed/cod-sheet-creator?include_prereleases&label=Release&logo=github) 
![GitHub issues by-label](https://img.shields.io/github/issues/juananmuxed/cod-sheet-creator/bug?label=Bugs%20Opened&logo=github) 
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/juananmuxed/cod-sheet-creator?label=Activity&logo=github)

### Demo deploy status

[![Deploy status](https://img.shields.io/github/workflow/status/juananmuxed/cod-sheet-creator/Deploy/develop?label=Develop%20status)](https://teamcoo.muxed.es)
[![Website](https://img.shields.io/website?down_color=red&down_message=Offline&label=Website&up_color=green&up_message=Online&url=https://cos.muxed.es)](https://cos.muxed.es) 

## 🎱 Introduction

> *If your enemy is secure at all points, be prepared for him. If he is in superior strength, evade him. If your opponent is temperamental, seek to irritate him. Pretend to be weak, that he may grow arrogant. If he is taking his ease, give him no rest. If his forces are united, separate them. If sovereign and subject are in accord, put division between them. Attack him where he is unprepared, appear where you are not expected .* <br> - Sun tzu, The Art of War

This is a simple  **NOT OFICIAL** tool to build your lists for game [Clash of Spears](https://www.fightinghedgehog.com/).

For any question about game use **Books** or contact the creators:
- [Clash of Spears](https://www.fightinghedgehog.com/)
- [The warhammer spot](http://www.thewargamespot.com/clash-of-spears/)
- [CoS FB](https://www.facebook.com/CLASHofSpears/)

## ☕️ Buy Me a Coffee

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U21M2BE)

## 🐛 Report a bug

Please follow one of this links to report a bug:
- [Github issues](https://github.com/juananmuxed/cod-sheet-creator/issues)
- [Discord](https://discord.gg/88rzwfU)

## 💻 Development

To fix bugs or simply check code.

Requirements:

- Node 12 at least

Clone the repo

```bash
git clone https://github.com/juananmuxed/cod-sheet-creator.git
```

Access to the folder

```bash
cd cod-sheet-creator
```

Run NPM to install dependencies and run dev enviorement

```bash
cd npm i
cd npm run dev
```

And you can access to the application via web browswer in http://localhost:5173

## 🗺️ Languages

For now the web is translated to this languages:
- 🇪🇸 Spanish

To colaborate, clone the src/locales/translate/es and translate all strings in the JSON files. Then add it to src\locales\messages.ts flow 

```ts
import es from "./translate/es/index";
import fr from "./translate/fr/index"; // here

export interface IKeyObject {
  [key: string]: IKeyObject;
}

const defaultLocale = "es";
const locale = getLS("lang") || defaultLocale;

const messages: IKeyObject = {};

messages.es = es as any;
messages.fr = fr as any; // here

export { messages, defaultLocale, locale };
```

## 🏗 Built with

- [Vue](https://vuejs.org/)

## 📌 Versions

Used [SemVer](http://semver.org/) for versions. For all available version, see [tags](https://github.com/juananmuxed/cod-sheet-creator/tags).

And here the [Changelog](CHANGELOG.md)

## 🍰 Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our [CODE OF CONDUCT](CODE_OF_CONDUCT.md), and the process for submitting pull requests.

## 📄 License

This project is under license (MIT) - see [LICENSE.md](LICENSE.md) for details.

<!-- [ ]: deploy in server  -->