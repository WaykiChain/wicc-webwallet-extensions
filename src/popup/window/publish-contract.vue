<template>
  <div class="main-wrapper">
    <main-header
        @network-change="handleNetworkChange"
        :hide-menu-toggle="true"></main-header>
    <div class="content">
      <div class="page-title">{{ $t('window.publishContract.title') }}</div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.publishContract.addressLabel') }}</label>
          <span>{{ address }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.publishContract.scriptDescLabel') }}</label>
          <span>{{ scriptDesc }}</span>
        </div>
        <div class="cell code-cell">
          <label>{{ $t('window.publishContract.scriptLabel') }}</label>
          <span>{{ script }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider v-model="fees" type="publish-contract"></fees-slider>
      <div class="button-wrapper">
        <button @click="cancel">{{ $t('window.publishContract.closeButton') }}</button>
        <button class="btn-primary" @click="confirm">{{ $t('window.publishContract.confirmButton') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import MainHeader from '../account/components/main-header'
  import Main from '../account/main'
  import FeesSlider from '../components/fees-slider'
  import API from '../api'
  import formatError from '../api/format-error'

  export default {
    name: 'contract',

    components: {
      Main,
      MainHeader,
      FeesSlider
    },

    created () {
      const query = this.$router.currentRoute.query
      this.script = query.script
      this.scriptDesc = query.scriptDesc
      this.callbackId = query.callbackId

      API.getState().then((state) => {
        this.network = state.network
        this.address = state.activeAddress
        this.activeAccount = state.activeAccount
      })
    },

    methods: {
      handleNetworkChange (network, header) {
        this.network = network

        header.hideNetwork()

        if (network === 'mainnet') {
          this.address = this.activeAccount.address
        } else {
          this.address = this.activeAccount.testnetAddress
        }
      },

      cancel () {
        window.close()
      },

      confirm () {
        this.$loading(this.$t('window.publishContract.confirmLoading'))

        API.publishContract(this.network, this.address, this.fees, this.script, this.scriptDesc).then((value) => {
          this.$loading.close()
          this.$toast(this.$t('window.publishContract.createSuccess'), {
            type: 'center'
          })

          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, value)
          }

          setTimeout(() => {
            window.close()
          }, 300)
        }, (error) => {
          this.$loading.close()
          this.$toast(this.$t('window.publishContract.createFailure') + ' ' + formatError(error), {
            type: 'center',
            duration: 5000,
            wordWrap: true
          })

          if (this.callbackId) {
            API.callPageCallback(this.callbackId, error, null)
          }

          console.log(error)
        })
      }
    },

    data () {
      return {
        callbackId: null,
        activeAccount: null,
        address: null,
        script: null,
        scriptDesc: null,
        network: null,
        fees: 1.1
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./common.scss";
</style>