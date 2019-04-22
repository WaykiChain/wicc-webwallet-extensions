# WaykiMax

WaykiMax is a browser extension wallet for WaykiChain. 

It allows users to manage their account info, add `WRC20` token, check balance, create/import/export mnemonics, transfer WICC and `WRC20` token, etc.

More importantly, WaykiMax provides the [WiccWallet](https://www.wiccdev.org/book/en/DeveloperHelper/webextension.html#wiccwallet) interface to developers. Developers can integrate `WiccWallet` when developing DAPP so that they can sign and broadcast WaykiChain transactions. In turn enabling the use of DAPP from within the browser.

## Downloads

**Chrome** – [Download](https://chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce)   
**Firefox** – [Download](https://addons.mozilla.org/en-US/firefox/addon/waykichain/)

## `WiccWallet`
[How to integrate WiccWallet on Web](https://www.wiccdev.org/book/en/DeveloperHelper/webextension.html#wiccwallet)

[如何在Web页面中集成 WiccWallet](hhttps://www.wiccdev.org/book/zh-hans/DeveloperHelper/webextension.html#wiccwallet)

## Build

Because package wcer limit, need to use the Node.js v8.X for development.

Recommended to use (NVM) (https://github.com/creationix/nvm) to switch Node.js version.

After installing Nvm, execute in project root directory:

```
nvm use
```

After the switch is completed, install the required package:
```
npm install
```

After the installation is completed, execute the following commands to develop:

```bash
npm run dev
```

Execute in the root directory in terminal:

```
npm run build
```

# License
MIT
