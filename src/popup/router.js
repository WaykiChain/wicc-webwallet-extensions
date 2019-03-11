import VueRouter from 'vue-router'

/**
 * Wallet related page
 */
import Wallet from './wallet/index'
import CreateWallet from './wallet/create/step-password'
import BackupMnemonic from './wallet/create/step-backup-mnemonic'
import ValidateMnemonic from './wallet/create/step-validate-mnemonic'
import ChangePassword from './setting/change-password'
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
import VoteWindow from './window/vote'

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
      }, {
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
      }]
    }
  ]
})

export default router
