<template>
  <vodal
      class="confirm-wrapper"
      :show="visible"
      animation="zoom"
      @hide="onHide"
      :close-button="false"
      :height="200"
      :width="320">
    <div class="confirm-title">{{ $t('account.dialog.registerTitle') }}</div>
    <div class="confirm-body">
      {{ $t('account.dialog.registerTip') }}
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
  import DialogMixin from './dialog-mixin'
  import API from '../../api'
  import formatError from '../../api/format-error'
  import eventBus from '../bus'

  export default {
    mixins: [DialogMixin],

    props: {
      address: {
        type: String
      }
    },

    methods: {
      emitCancel () {
        this.$emit('cancel')
        this.hide()
      },

      emitConfirm () {
        this.$emit('confirm')

        this.$loading(this.$t('account.dialog.registerLoading'))

        API.registerAccount(this.address)
          .then(() => {
            this.$loading.close()
            this.$toast(this.$t('account.dialog.registerSuccess'), {
              type: 'center'
            })

            eventBus.$emit('account:transactions:refresh')

            this.hide()
          }, (error) => {
            this.$loading.close()
            this.$toast(this.$t('account.dialog.registerFailed') + ' ' + formatError(error), {
              type: 'center',
              duration: 5000,
              wordWrap: true
            })

            console.log('error when active account:', error)
          })
      }
    },

    data () {
      return {
      }
    }
  }
</script>
