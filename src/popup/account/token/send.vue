<template>
  <div class="content-wrapper">
    <nav-bar :title="$t('account.sendToken.title')"></nav-bar>
    <div class="content-body">
      <div class="from-title">{{ $t('account.sendToken.fromLabel') }}</div>
      <div class="from-address">{{ activeAddress }}</div>

      <wallet-input
          v-model="destAddr"
          :label="$t('account.sendToken.destLabel')"
          :placeholder="$t('account.sendToken.destPlaceHolder')">
      </wallet-input>

      <wallet-input
          v-model="amount"
          type="number"
          :postfix="name"
          :label="$t('account.sendToken.valueLabel')"
          :placeholder="$t('account.sendToken.valuePlaceHolder')">
      </wallet-input>

      <wallet-input
          v-model="desc"
          :label="$t('account.sendToken.descLabel')">
      </wallet-input>
      <fees-slider type="call-contract" v-model="fees"></fees-slider>
    </div>

    <div class="content-footer">
      <button
          :disabled="!valid"
          class="display-block btn-primary"
          @click="confirmSend">{{ $t('account.sendToken.confirmButton') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content-wrapper {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .content-body {
    flex: 1 0 0;
    padding: 0 16px 16px;
  }

  .content-footer {
    padding: 0 16px;
  }

  .from-title, .from-address {
    color: #717680;
    font-size: 15px;
    padding: 2px;
  }

  .from-address {
    margin-bottom: 12px;
  }
</style>

<script type="text/jsx">
  import WalletInput from '../../components/input'
  import NavBar from '../../components/nav-bar'
  import FeesSlider from '../../components/fees-slider'
  import API from '../../api'
  import formatError from '../../api/format-error'
  import StateWatcher from '../state-watcher'

  export default {
    name: 'send-token',

    mixins: [StateWatcher],

    components: {
      WalletInput,
      FeesSlider,
      NavBar
    },

    props: {
      regId: {
        type: String,
        required: true
      },
      name: {
        type: String
      }
    },

    computed: {
      valid() {
        return this.destAddr && this.amount
      }
    },

    methods: {
      confirmSend() {
        if (!this.validateAddress(this.destAddr)) return

        if (this.value < 0.0001) {
          this.$toast(this.$t('errors.amountLessThanLimit'), {
            type: 'center'
          })

          return
        }

        this.$loading(this.$t('account.sendToken.confirmLoading'))
        // sendToken (network, address, name, regId, destAddress, amount, fees, desc)
        API.sendToken(this.network || 'testnet', this.activeAddress, this.name, this.regId, this.destAddr, parseFloat(this.amount), this.fees, this.desc)
          .then(() => {
            this.$toast(this.$t('account.sendToken.sendSuccess'), {
              type: 'center'
            })
            this.$loading.close()

            window.history.go(-1)
          }, (error) => {
            this.$toast(this.$t('account.sendToken.sendFailure') + ' ' + formatError(error), {
              type: 'center',
              duration: 5000,
              wordWrap: true
            })
            this.$loading.close()
          })
      }
    },

    data() {
      return {
        destAddr: null,
        amount: null,
        desc: null,
        fees: 0.01
      }
    }
  }
</script>
