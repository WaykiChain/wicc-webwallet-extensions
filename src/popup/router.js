import VueRouter from 'vue-router'

/**
 * Wallet related page
 */
import Wallet from './wallet/index'
import CreateWallet from './wallet/create/step-password'
import BackupMnemonic from './wallet/create/step-backup-mnemonic'
import ValidateMnemonic from './wallet/create/step-validate-mnemonic'
import ChangePassword from './setting/change-password'   
import AddNet from './setting/add-net'   
import ChangeNet from './setting/change-net'
import About from './setting/about'
import ImportWallet from './wallet/import-wallet'

/**
 * Account related page
 */
import Account from './account/index'
import AccountMain from './account/main'
import Send from './account/send'
import ImportAccount from './account/import-account'
import AddToken from './account/token/add'
import SendToken from './account/token/send'
import TokenMain from './account/token/main'
import WiccRecord from './account/token/wiccRecord'


/**
 * Splash related page
 */
import Splash from './main/splash'

/**
 * Setting Related page
 */
import Setting from './setting/index'

/**
 * Window Related Page
 */
import Window from './window/index'
import LoginWindow from './window/login'
import ContractWindow from './window/contract'
import PublishContractWindow from './window/publish-contract'
import PayWindow from './window/pay'

import MyTestWindow from './window/my'
import VoteWindow from './window/vote'

import CdpCreate from './window/cdpCreate' 
import CdpLiquid from './window/cdpLiquid'
import CdpRedeem from './window/cdpRedeem'
import CdpAdditional from './window/cdpAdditional'
import DexDealView from './window/dexDeal'
import DexCancelDealView from './window/dexCancelDeal'
import assetsPub from './window/assetsPub'
import assetUpadte from './window/assetsUpdate'
import messageSign from './window/messageSign'   
import contract_new from './window/contract_new'
const router = new VueRouter({
  routes: [
    {
      name: 'welcome',
      path: '/',
      component: Splash
    },

    {
      name: 'wallet',
      path: '/wallet',
      component: Wallet,
      children: [{
        name: 'createWallet',
        path: 'create/password',
        component: CreateWallet
      }, {
        name: 'backupWalletMnemonic',
        path: 'create/backup-mnemonic',
        component: BackupMnemonic
      }, {
        name: 'validateWalletMnemonic',
        path: 'create/validate-mnemonic',
        component: ValidateMnemonic,
        props: (route) => {
          return {
            mnemonics: (route.query.mnemonic || '').split(' ')
          }
        }
      }, {
        name: 'importWallet',
        path: 'import',
        component: ImportWallet
      }, {
        name: 'changePassword',
        path: 'change-password',
        component: ChangePassword
      }, {
        name: 'about',
        path: 'about',
        component: About
      }, {
        name: 'changeNet',
        path: 'changeNet',
        component: ChangeNet
      }, {
        name: 'addNet',
        path: 'addNet',
        component: AddNet
      }]
    },

    {
      name: 'account',
      path: '/account',
      component: Account,
      children: [{
        name: 'accountMain',
        path: 'index',
        component: AccountMain
      }, {
        name: 'send',
        path: 'send',
        component: Send
      }, {
        name: 'tokenMain',
        path: 'token/main',
        component: TokenMain
      },
      {
        name: 'WiccRecord',
        path: 'token/WiccRecord',
        component: WiccRecord
      },
       {
        name: 'addToken',
        path: 'token/add',
        component: AddToken
      }, {
        name: 'sendToken',
        path: 'token/send',
        component: SendToken,
        props: (route) => {
          return {
            from: route.query.from,
            network: route.query.network,
            regId: route.query.regId,
            name: route.query.name
          }
        }
      }, {
        name: 'importAccount',
        path: 'import',
        component: ImportAccount
      }, {
        name: 'createAccount',
        path: 'create/backup-mnemonic',
        component: BackupMnemonic
      }, {
        name: 'validateAccountMnemonic',
        path: 'create/validate-mnemonic',
        component: ValidateMnemonic,
        props: (route) => {
          return {
            mnemonics: (route.query.mnemonic || '').split(' ')
          }
        }
      }]
    },

    {
      name: 'setting',
      path: '/setting',
      component: Setting
    },

    {
      name: 'window',
      path: '/window',
      component: Window,

      children: [{
        name: 'loginWindow',
        path: 'login',
        component: LoginWindow
      }, {
        name: 'contractWindow',
        path: 'contract',
        component: ContractWindow
      }, {
        name: 'publishContractWindow',
        path: 'publish-contract',
        component: PublishContractWindow
      }, {
        name: 'payWindow',
        path: 'request-pay',
        component: PayWindow
      }, {
        name: 'voteWindow',
        path: 'request-vote',
        component: VoteWindow
      },{
        name: 'MyTestWindow',
        path: 'request-my',
        component: MyTestWindow
      },
      {
        name: 'CdpCreate',
        path: 'cdp-create',
        component: CdpCreate
      },
      {
        name: 'CdpLiquid',
        path: 'cdp-liquid',
        component: CdpLiquid
      },
      {
        name: 'CdpRedeem',
        path: 'cdp-redeem',
        component: CdpRedeem
      },
      {
        name: 'CdpAdditional',
        path: 'cdp-additional',
        component: CdpAdditional
      },
      {
        name: 'DexDealView',
        path: 'dex-dealView',
        component: DexDealView
      },
      {
        name: 'DexCancelDealView',
        path: 'dex-cancel-dealView',
        component: DexCancelDealView
      },
      {
        name: 'assetsPub',
        path: 'assets-pub',
        component: assetsPub
      },
      {
        name: 'assetsUpadte',
        path: 'assets-update',
        component: assetUpadte
      },
      {
        name: 'messageSign',
        path: 'message-sign',
        component: messageSign
      },
      {
        name: 'contract_new',
        path: 'contract-new',
        component: contract_new
      },
    ]
    }
  ]
})

export default router
