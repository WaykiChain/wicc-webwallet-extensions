<template>
  <main-layout ref="mainLayout">
    <token-list
        slot="drawer"
        @active-token-change="handleActiveTokenChange"
        :active-reg-id="regId"
        :active-account="activeAccount"
        :active-address="activeAddress"
        :network="network"
        :tokens="tokens">
    </token-list>

    <coin-card
        v-if="activeTokenInfo"
        style="margin: 16px;"
        :show-register-button="false"
        :name="name"
        :address="activeAddress"
        :value="activeTokenInfo.FreeValues">
    </coin-card>

    <template slot="body">
      <trans-history
          :transactions="transactions"
          :show-empty-block="!loading"></trans-history>
    </template>

    <template slot="footer">
      <button class="btn-primary display-block" @click="gotoSendToken"> 转账 </button>
    </template>
  </main-layout>
</template>

<style scoped lang="scss">
</style>

<script type="text/jsx">
  import API from '../../api'
  import { DrawerLayout } from 'vue-drawer-layout'
  import TokenList from '../components/token-list'
  import CoinCard from '../components/coin-card'
  import TransHistory from '../components/trans-history'
  import StateWatcher from '../state-watcher'
  import MainLayout from '../components/main-layout'

  export default {
    mixins: [StateWatcher],

    components: {
      DrawerLayout,
      TokenList,
      CoinCard,
      TransHistory,
      MainLayout
    },

    created () {
      const query = this.$router.currentRoute.query
      this.regId = query.regId
      this.name = query.name
    },

    watch: {
      activeAddress () {
        this.fetchTokenInfo()
      },

      '$route.query.regId' (val) {
        this.regId = val
        this.fetchTokenInfo()
      },

      '$route.query.name' (val) {
        this.name = val
      }
    },

    methods: {
      handleActiveTokenChange (token) {
        if (!token) {
          this.$router.push({
            name: 'accountMain'
          })
        } else {
          this.$router.push({
            name: 'tokenMain',
            query: {
              name: token.name,
              regId: token.regId
            }
          })

          this.$refs.mainLayout.toggleDrawer()
        }
      },

      fetchTokenInfo () {
        this.loading = true
        this.$loading(this.$t('common.loading'))

        API.getTokenInfo(this.network, this.activeAddress, this.regId).then((value) => {
          // console.log('token info:', value)
          const tokenInfo = value.result
          if (tokenInfo && tokenInfo.FreeValues) {
            tokenInfo.FreeValues = tokenInfo.FreeValues * Math.pow(10, -8)
          }
          this.activeTokenInfo = tokenInfo
          this.$loading.close()

          this.loading = false
        }, () => {
          this.$loading.close()

          this.loading = false
        })

        API.getTokenTransHistory(this.network, this.activeAddress, this.regId).then((value) => {
          // console.log('token trans:', value)
          this.transactions = value
        })
      },

      gotoSendToken () {
        this.$router.push({
          name: 'sendToken',
          query: {
            from: this.activeAddress,
            network: this.network,
            name: this.name,
            regId: this.regId
          }
        })
      },
    },

    data () {
      return {
        loading: false,
        regId: null,
        name: null,

        transactions: null,
        activeTokenInfo: null
      }
    }
  }
</script>
