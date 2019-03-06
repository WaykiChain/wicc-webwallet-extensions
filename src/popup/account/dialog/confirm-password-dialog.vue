<template>
  <vodal
      class="confirm-wrapper"
      :show="visible"
      animation="zoom"
      @hide="onHide"
      :close-button="false"
      :height="190"
      :width="320">
    <div class="confirm-title">{{ $t('account.dialog.passwordTitle') }}</div>
    <div class="confirm-body">
      <wallet-input
          v-model="password"
          type="password"
          :placeholder="$t('account.dialog.passwordPlaceHolder')"></wallet-input>
    </div>
    <div class="confirm-footer">
      <button @click="emitCancel">{{ $t('common.cancel') }}</button>
      <button class="btn-primary" @click="emitConfirm">{{ $t('common.confirm') }}</button>
    </div>
  </vodal>
</template>

<style lang="scss" scoped>
  .confirm-wrapper {
    padding: 8px;
  }

  .confirm-title {
    text-align: center;
    color: #5B5F67;
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 20px;
  }

  .confirm-body {
    text-align: center;
    font-size: 14px;
    color: #5B5F67;
    margin-bottom: 20px;
  }

  .confirm-footer {
    display: flex;
    flex-direction: row;
    align-items: center;

    button {
      &:first-child {
        margin-right: 16px;
      }
      flex: 1 0 0;
    }
  }
</style>

<script type="text/jsx">
  import WalletInput from '../../components/input'
  import API from '../../api/index'
  import DialogMixin from './dialog-mixin'

  export default {
    mixins: [DialogMixin],

    components: {
      WalletInput
    },

    props: {
      callback: {
        type: Function
      }
    },

    methods: {
      hide () {
        this.visible = false
        this.password = null
      },

      emitCancel () {
        this.$emit('cancel')
        this.$emit('update:visible', false)
      },

      emitConfirm () {
        this.$emit('confirm')

        API.validatePassword(this.password).then((value) => {
          if (value === true) {
            this.$emit('confirm:success')
          } else {
            this.$emit('confirm:failure')
            this.$toast(this.$t('common.passwordError'), {
              type: 'center'
            })
          }
        }, () => {
          this.$toast(this.$t('common.unknownError'), {
            type: 'center'
          })
        })
      }
    },

    data () {
      return {
        password: null
      }
    }
  }
</script>
