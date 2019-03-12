<template>
  <div class="wallet-main-header">
    <div class="dropdown-wrapper menu-wrapper" v-click-outside="hideMenu">
      <div class="dropdown-toggle" @click="toggleMenu" v-if="!hideMenuToggle">
        <img src="../../static/main-header-icon.svg" alt="click show menu"/>
      </div>
      <div class="dropdown" v-show="showMenu">
        <div class="dropdown-header">
          <span class="logout-btn" @click="logout">{{ $t('account.header.logout') }}</span>
        </div>
        <ul class="account-list">
          <li v-for="(account,index) in visibleAccounts" 
            :key='index'
            class="account-item"
            @click="setActiveAccount(account)"
            :class="{
              active: activeAccount.id === account.id
            }">
            <span class="account-item-icon"></span>
            {{ $t('common.accountLabel') }} {{ account.index + 1 }}
          </li>
        </ul>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="viewMnemonic">{{ $t('account.header.viewMnemonic') }}</div>
        <div class="menu-item" @click="viewPrivateKey">{{ $t('account.header.exportPrivateKey') }}</div>
        <div class="menu-item" @click="gotoCreateAccount">{{ $t('account.header.createAccount') }}</div>
        <div class="menu-item" @click="gotoImportAccount">{{ $t('account.header.importAccount') }}</div>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="gotoAbout">{{ $t('account.header.about') }}</div>
        <div class="menu-item" @click="gotoSetting">{{ $t('account.header.setting') }}</div>
        <div class="menu-separator"></div>
        <div class="social-icon-container">
          <a class="wechat-link" href="JavaScript: void(0)">
            <img class="social-icon" src="../../static/wechat.svg" />
            <img class="wechat-img" src="https://wiccdev.org/images/index/wechat_kf.png"/>
          </a>
          <a href="https://t.me/wiccofficial" target="_blank">
            <img class="social-icon" src="../../static/telegram.svg" />
          </a>
          <a href="https://twitter.com/wayki_chain" target="_blank">
            <img class="social-icon" src="../../static/twitter.svg" />
          </a>
        </div>
      </div>
    </div>
    <div class="dropdown-wrapper network-wrapper" v-click-outside="hideNetwork">
      <div class="dropdown-toggle" @click="toggleNetwork">
        <div class="dropdown-toggle-label">{{ getNetworkText(network) }}</div>
        <div class="dropdown-toggle-indicator"></div>
      </div>
      <div class="dropdown" v-show="showNetwork">
        <div class="dropdown-header">{{ $t('account.header.network') }}</div>
        <div class="menu-separator"></div>

        <ul class="network-list">
          <li>{{ $t('account.header.defaultNetwork') }}</li>
          <li class="menu-item network-item"
              @click="setNetwork('mainnet')"
              :class="{
              active: network === 'mainnet'
            }">
            <span class="network-item-icon"></span>
            {{ getNetworkText('mainnet') }}
          </li>
          <li class="menu-item network-item"
              @click="setNetwork('testnet')"
              :class="{
              active: network === 'testnet'
            }">
            <span class="network-item-icon"></span>
            {{ getNetworkText('testnet') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside'
  import API from '../../api/index'
  import eventBus from '../bus'
  import { openMnemonicDialog, openPkDialog, openConfirmPassword } from '../dialog/'
  import StateWatcher from '../state-watcher'

  export default {
    name: 'main-header',

    mixins: [StateWatcher],

    directives: {
      ClickOutside
    },

    props: {
      hideMenuToggle: {
        type: Boolean,
        default: false
      }
    },

    created () {
      this.refreshState()

      this.eventBus.$on('header:state:refresh', this.refreshState)
    },

    destroyed () {
      this.eventBus.$off('header:state:refresh', this.refreshState)
    },

    data () {
      return {
        showNetwork: false,
        showMenu: false,
        forceLogin: false
      }
    },

    computed: {
      visibleAccounts () {
        const { network, accounts } = this
        return accounts.filter((account) => {
          return !(account.type === 'privateKey' && account.network !== network)
        })
      }
    },

    methods: {
      hideMenu () {
        this.showMenu = false
      },

      toggleMenu () {
        this.showMenu = !this.showMenu
      },

      hideNetwork () {
        this.showNetwork = false
      },

      toggleNetwork () {
        this.showNetwork = !this.showNetwork
      },

      getNetworkText (network) {
        if (network === 'mainnet') {
          return this.$t('account.header.mainnet')
        } else {
          return this.$t('account.header.testnet')
        }
      },

      setNetwork (network) {
        API.setNetwork(network).then(({ network, account }) => {
          this.network = network
          this.$emit('network-change', network, this)
          eventBus.$emit('network-change', network)
          if (account) {
            this.activeAccount = account
            eventBus.$emit('active-account-change', account)
          }
        })
        this.hideNetwork()
      },

      setActiveAccount (account) {
        API.setActiveAccount(account.id).then(({ network }) => {
          this.activeAccount = account
          eventBus.$emit('active-account-change', account)
          if (network) {
            this.network = network
            this.$emit('network-change', network, this)
            eventBus.$emit('network-change', network)
          }
        })
        this.hideMenu()
      },

      logout () {
        API.logout().then(() => {
          this.$router.push({
            name: 'welcome'
          })
        })
      },

      gotoSetting () {
        this.$router.push({
          name: 'setting'
        })
      },

      gotoImportAccount () {
        this.$router.push({
          name: 'importAccount'
        })

        this.hideMenu()
      },

      gotoCreateAccount () {
        this.$router.push({
          name: 'createAccount'
        })

        this.hideMenu()
      },

      gotoAbout () {
        this.$router.push({
          name: 'setting',
          query: {
            tab: 'about'
          }
        })

        this.hideMenu()
      },

      viewMnemonic () {
        openConfirmPassword().then(() => {
          openMnemonicDialog(this.network, this.activeAddress)
        })
        this.hideMenu()
      },

      viewPrivateKey () {
        openConfirmPassword().then(() => {
          openPkDialog(this.network, this.activeAddress)
        })
        this.hideMenu()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wallet-main-header {
    background: #F2F5FC;
    height: 64px;
    border-bottom: 1px solid #D6D6D6;
    z-index: 1;
  }

  .dropdown-wrapper {
    position: relative;
    display: inline-block;
  }

  .dropdown {
    position: absolute;
    z-index: 999;
    left: 0;
    top: 55px;
    background: #464A53;
    opacity: 0.95;
    width: 300px;
    max-height: 500px;
    overflow: auto;
    border-radius: 2px;
    box-shadow: 0 3px 10px rgba(180, 188, 204, 0.8);
    color: #B4BCCC;
  }

  .dropdown-toggle {
    position: relative;
    cursor: pointer;

    > img {
      width: 42px;
      height: 38px;
      margin-top: 4px;
    }

    > img:hover {
      opacity: 0.8;
    }
  }

  .menu-wrapper {
    float: right;
    margin-top: 8px;
    margin-right: 8px;

    .dropdown {
      left: auto;
      top: 56px;
      right: -8px;
    }
  }

  .network-wrapper {
    margin-right: 66px;
    display: block;

    .dropdown-toggle {
      box-sizing: border-box;
      margin-left: 10px;
      margin-top: 10px;
      /*width: 283px;*/
      height: 44px;
      border: 1px solid #C6CEDE;
      border-radius: 22px;
      background: #fff;
    }

    .dropdown-toggle-label {
      margin-left: 24px;
      line-height: 42px;
    }

    .dropdown-toggle-indicator {
      position: absolute;
      top: 18px;
      right: 18px;
      background: url('../../static/dropdown-indicator.png');
      background-size: 12px 7px;
      width: 12px;
      height: 7px;
    }
  }

  .network-list {
    margin: 12px;
    list-style: none;

    li {
      margin: 0;
    }
  }

  .dropdown-header {
    color: #fff;
    font-size: 15px;
    margin: 16px;
    text-align: center;
    overflow: hidden;

    .logout-btn {
      float: right;
      cursor: pointer;
    }
  }

  .menu-separator {
    width: 100%;
    height: 0;
    border-bottom: 1px solid #5B5F67;
  }

  .menu-item {
    cursor: pointer;
    margin: 16px;

    &:hover {
      color: #fff;
    }
  }

  .network-list {
    .network-item {
      margin: 16px 0;

      &.active .network-item-icon {
        border-color: #5379DB;

        &:after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #5379DB;
          left: 2px;
          top: 2px;
        }
      }
    }

    .network-item-icon {
      position: relative;
      top: 3px;
      display: inline-block;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 1px solid #B4BCCC;
      border-radius: 50%;
    }
  }

  .social-icon-container {
    height: 36px;
    margin: 16px;

    .social-icon {
      width: 36px;
      height: 36px;
      margin-right: 30px;
    }

    .wechat-link {
      display: inline-block;
      position: relative;

      .wechat-img {
        display: none;
        width: 120px;
        height: 120px;
      }

      &:hover .wechat-img {
        display: inline-block;
        position: absolute;
        top: -128px;
        left: 0;
      }
    }
  }

  .account-list {
    list-style: none;
    margin: 0;

    .account-item {
      padding: 8px;
      cursor: pointer;
      line-height: 30px;
      margin: 0;
    }

    .account-item.active {
      background-color: rgba(255, 255, 255, 0.08);
    }

    .account-item-icon {
      float: left;
      display: inline-block;
      box-sizing: border-box;
      width: 32px;
      height: 32px;
      margin-right: 4px;
      background: url('../../static/account-list-icon.png') no-repeat;
      background-size: 32px 28.5px;
    }
  }
</style>