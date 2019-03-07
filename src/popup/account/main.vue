<template>
  <main-layout>
    <token-list
        slot="drawer"
        @active-token-change="handleActiveTokenChange"
        :active-reg-id="null"
        :active-account="activeAccount"
        :active-address="activeAddress"
        :network="network"
        :tokens="tokens">
    </token-list>

    <coin-card
        v-if="activeAccountInfo"
        style="margin: 16px;"
        :show-register-button="!activeAccountInfo.regID"
        name="wicc"
        :address="activeAddress"
        :value="activeAccountInfo.balanceText">
    </coin-card>

    <template slot="body">
      <trans-history
          :transactions="transactions"
          :show-empty-block="!loading"></trans-history>
    </template>

    <template class="footer" slot="footer">
      <button class="btn-primary" @click="gotoSend">{{ $t('account.main.sendButton') }}</button>
      <button @click="handleReceiveClick">{{ $t('account.main.receiveButton') }}</button>
    </template>
  </main-layout>
</template>

<style scoped lang="scss">
  .button-wrapper {
    > button {
      flex: 1 0 0;
    }

    > button:first-child {
      margin-right: 10px;
    }
  }
</style>

<script type="text/jsx">
  import API from '../api'
  import { DrawerLayout } from 'vue-drawer-layout'
  import TokenList from './components/token-list'
  import CoinCard from './components/coin-card'
  import TransHistory from './components/trans-history'
  import { openQrCodeDialog } from './dialog'
  import StateWatcher from './state-watcher'
  import MainLayout from './components/main-layout'

  export default {
    mixins: [StateWatcher],

    components: {
      MainLayout,
      DrawerLayout,
      TokenList,
      CoinCard,
      TransHistory
    },

    created () {
      this.eventBus.$on('account:transactions:refresh', this.refresh)

      this.timer = setInterval(() => {
        this.refresh(true)
      }, 15 * 1000)
    },

    destroyed () {
      this.eventBus.$off('account:transactions:refresh', this.refresh)
      clearInterval(this.timer)
    },

    watch: {
      activeAddress () {
        this.refresh()
      }
    },

    methods: {
      handleActiveTokenChange (token) {
        if (token) {
          this.$router.push({
            name: 'tokenMain',
            query: {
              name: token.name,
              regId: token.regId
            }
          })
        }
      },

      refresh (silence = false) {
        const activeAddress = this.activeAddress

        if (!silence) {
          this.$loading(this.$t('common.loading'))
        }

        API.getAccountInfo(this.network, activeAddress).then((info) => {
          if (info && info.regID) {
            info.regID = ('' + info.regID).trim()
          }
          this.activeAccountInfo = info

          if (info.address === null) {
            info.address = activeAddress
            info.balance = 0
          }
          info.balanceText = info.balance ? info.balance * Math.pow(10, -8) : info.balance

          this.$loading.close()

          this.loading = false
        }, () => {
          this.$loading.close()

          this.loading = false
        })

        return API.getTransHistory(this.network, this.activeAddress).then((value) => {
          this.transactions = value
          return value
        })
      },

      gotoSend () {
        this.$router.push({
          name: 'send',
          query: {
            balance: this.activeAccountInfo ? this.activeAccountInfo.balanceText : null
          }
        })
      },

      toggleDrawer() {
        this.$refs.drawerLayout.toggle()
      },

      handleReceiveClick () {
        openQrCodeDialog(this.activeAddress)
      }
    },

    data () {
      return {
        loading: false,

        activeAccountInfo: null,
        transactions: null
      }
    }
  }
</script>
