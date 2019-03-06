<template>
  <div class="main-wrapper">
    <main-header
        @network-change="handleNetworkChange"
        :hide-menu-toggle="true"></main-header>
    <div class="content">
      <div class="page-title">{{ $t('window.contract.title') }}</div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.contract.addressLabel') }}</label>
          <span>{{ address }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.contractRegIdLabel') }}</label>
          <span>{{ destRegId }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.valueLabel') }}</label>
          <span>{{ value }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.contractLabel') }}</label>
          <span>{{ contract }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider type="call-contract" v-model="fees"></fees-slider>
      <div class="button-wrapper">
        <button @click="cancel">{{ $t('window.contract.closeButton') }}</button>
        <button class="btn-primary" @click="confirm">{{ $t('window.contract.confirmButton') }}</button>
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
      this.destRegId = query.destRegId
      this.contract = query.contract
      this.value = parseFloat(query.value) || 0
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
        this.$loading(this.$t('window.contract.confirmLoading'))

        API.callContract(this.network, this.address, this.destRegId, this.value, this.fees, this.contract).then((value) => {
          this.$loading.close()
          this.$toast(this.$t('window.contract.createSuccess'), {
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
          this.$toast(this.$t('window.contract.createFailure') + ' ' + formatError(error), {
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
        destRegId: null,
        contract: null,
        network: null,
        value: 0,
        fees: 0.01
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./common.scss";
</style>