<template>
  <div class="main-wrapper">
    <main-header
        @network-change="handleNetworkChange"
        :hide-menu-toggle="true"></main-header>
    <div class="content">
      <div class="page-title">{{ $t('window.transfer.title') }}</div>
      <div class="value-block">
        <div class="value">
          {{ value }}
        </div>
        <div class="desc" v-if="desc">
          {{ desc }}
        </div>
      </div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.transfer.addressLabel') }}</label>
          <span>{{ address }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.transfer.destAddressLabel') }}</label>
          <span>{{ destAddress }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.transfer.valueLabel') }}</label>
          <span>{{ value }} WICC</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider v-model="fees"></fees-slider>
      <div class="button-wrapper">
        <button @click="cancel">{{ $t('window.transfer.closeButton') }}</button>
        <button class="btn-primary" @click="confirm">{{ $t('window.transfer.confirmButton') }}</button>
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
      this.destAddress = query.destAddress
      this.desc = query.desc
      this.callbackId = query.callbackId
      this.value = parseFloat(query.value) || 0

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
        this.$loading(this.$t('window.transfer.confirmLoading'))

        API.send(this.network, this.address, this.destAddress, this.value, this.fees, this.desc).then((value) => {
          this.$loading.close()
          this.$toast(this.$t('window.transfer.createSuccess'), {
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
          this.$toast(this.$t('window.transfer.createFailure') + ' ' + formatError(error), {
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
        destAddress: null,
        desc: null,
        value: 0,
        network: null,
        fees: 0.0001
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./common.scss";

  .value-block {
    padding-bottom: 10px;
    background-color: #f2f5fc;

    .value {
      font-size: 38px;
      color: #3c78ea;
      margin-top: 10px;
      text-align: center;
      background: #fff;
    }

    .desc {
      color: #b4bccc;
      font-size: 15px;
      text-align: center;
      background-color: #fff;
      margin-bottom: 10px;
    }
  }
</style>