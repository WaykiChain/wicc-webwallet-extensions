# WaykiMax

WaykiMax is a browser extension wallet for WaykiChain. It enables you to send and receive WICC and WRC20 tokens. 

The extension feature that allows users to manage their account info, add token, check balance, create/import/export mnemonics, transfer WICC, etc.

More importantly, WaykiMax provides the `WaykiPay` interface to developers. Developers can integrate `WaykiPay` when developing DApp so that they can sign and broadcast WaykiChain transactions.in turn enabling the use of Dapps from within the browser.

## Downloads

**Chrome** – [Download](https://chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce)   
**Firefox** – [Download](https://addons.mozilla.org/en-US/firefox/addon/waykichain/)

## `WaykiPay`
[How to integrate WaykiPay on Web](https://www.wiccdev.org/book/en/DeveloperHelper/webextension.html#waykipay)

[如何在Web页面中集成 WaykiPay](https://www.wiccdev.org/book/zh-hans/DeveloperHelper/webextension.html#waykipay)

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
