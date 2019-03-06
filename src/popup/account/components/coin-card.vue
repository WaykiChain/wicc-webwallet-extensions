<template>
  <div class="coin-card">
    <div class="coin-name-wrapper">
      <img src="../../static/coin-card-logo-wicc.svg" v-if="name === 'wicc'" />
      <div v-else class="coin-name">{{ name }}</div>
    </div>
    <div class="coin-card-body">
      <span class="coin-value">{{ value | fixed(8) }}</span>
      <button
          v-if="showRegisterButton"
          @click="openRegisterConfirm"
          class="btn-account-active btn-text">{{ $t('common.activeAccount') }}</button>
    </div>
    <div class="coin-card-footer">
      <div class="coin-address">{{ address }}</div>
      <div class="coin-card-btn coin-card-copy">
        <img src="../../static/copy-icon-white.svg" />
      </div>
      <div class="coin-separator"></div>
      <div class="coin-card-btn" @click="openQrCode">
        <img src="../../static/qrcode-icon-white.svg" />
      </div>
    </div>
  </div>
</template>

<script>
  import CopyMixin from '../../components/copy-mixin'
  import { openQrCodeDialog, openRegisterConfirmDialog } from '../dialog'

  export default {
    name: 'coin-card',
    mixins: [CopyMixin],

    props: {
      name: {
        type: String,
        required: true
      },
      address: {
        type: String
      },
      value: {
        required: true
      },
      showRegisterButton: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        registerConfirmVisible: false,
        clipboardSelector: '.coin-card-copy'
      }
    },

    methods: {
      openQrCode () {
        openQrCodeDialog(this.address)
      },

      openRegisterConfirm () {
        openRegisterConfirmDialog(this.address)
      },

      getCopyText () {
        return this.address
      }
    }
  }
</script>

<style lang="scss" scoped>
  .coin-card {
    position: relative;
    background: url('../../static/coin-card-bg.svg') 0 0 no-repeat;
    background-size: 100% 100%;
    width: 344px;
    height: 136px;
    color: #fff;
    padding: 16px;
    box-sizing: border-box;
  }

  .coin-name-wrapper {
    img {
      margin-left: -7px;
    }

    .coin-name {
      font-size: 10px;
      background: #fff;
      color: #4270DA;
      display: inline-block;
      padding: 1px 2px;
      border-radius: 3px;
      font-weight: bold;
      font-style: italic;
    }
  }

  .coin-value {
    font-family: Garamond, Helvetica, Verdana, serif;
    font-size: 38px;
  }

  .coin-card-body {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 40px;
  }

  .btn-account-active {
    color: white;
    text-decoration: underline;
    font-size: 13px;
  }

  .coin-card-footer {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .coin-address {
      cursor: default;
      color: #CBDBFA;
      font-size: 12px;
      flex: 1 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .coin-separator {
      border-left: 1px solid #fff;
      height: 16px;
      margin: 0 4px;
    }

    .coin-card-btn {
      margin-left: 6px;
      margin-right: 6px;
      line-height: 0;
      cursor: pointer;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .coin-card-copy {
      img {
        width: 16px;
        height: 17px;
      }
    }
  }
</style>
