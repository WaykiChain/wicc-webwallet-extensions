<template>
  <div class="wallet-input">
    <div class="wallet-input--label">{{ label || '' }}</div>
    <div class="wallet-input-content">
      <textarea
          v-if="type === 'textarea'"
          class="wallet-input--textarea display-block"
          :value="value"
          :placeholder="placeholder"
          :readonly="readOnly"
          @input="handleInput"></textarea>
      <input
          ref="input"
          v-if="type === 'text' || type === 'password' || type === 'number'"
          class="wallet-input--input display-block"
          :placeholder="placeholder"
          :type="type === 'number' ? 'text' : type"
          :value="value"
          :readonly="readOnly"
          @keydown="handleKeyDown"
          @input="handleInput" />
      <div v-if="postfix" class="wallet-input-postfix">{{ postfix }}</div>

      <slot></slot>
    </div>
    <div class="wallet-input--message">
    </div>
  </div>
</template>

<script>
  const NUMBER_VALID_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
    'Tab', 'Delete', 'Backspace', 'ShiftLeft', 'ShiftRight', 'Escape', 'Shift', 'Meta']

  export default {
    name: 'WalletInput',

    props: {
      label: {
        type: String
      },
      type: {
        default: 'text'
      },
      value: {
        default: null
      },
      placeholder: {
        type: String,
        default: ''
      },
      message: {
        type: String
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      postfix: {
        type: String
      }
    },

    methods: {
      handleKeyDown (event) {
        const key = event.key
        const type = this.type
        const input = this.$refs.input

        if (type === 'number' && input) {
          if (key && NUMBER_VALID_KEYS.indexOf(key) === -1) {
            event.preventDefault()
          }

          if (key === '.' && input.value.indexOf('.') !== -1) {
            event.preventDefault()
          }
        }
      },

      handleInput (event) {
        const type = this.type
        let value = event.target.value

        if (type === 'number') {
          const parsed = parseFloat(value)
          if (!isNaN(parsed)) {
            value = parsed
          }
        }

        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wallet-input {
  }

  .wallet-input--label {
    color: #717680;
    font-size: 15px;
    padding: 2px;
  }

  .wallet-input-content {
    position: relative;
  }

  .wallet-input-postfix {
    position: absolute;
    right: 12px;
    top: 12px;
  }

  .wallet-input--input {
  }

  .wallet-input--textarea {
    padding: 16px;
    resize: none;
    font-size: 16px;
    line-height: 30px;
    height: 120px;
  }

  .wallet-input--textarea[readonly] {
    background: rgba(0, 61, 184, 0.05);
  }

  .wallet-input--message {
    line-height: 20px;
  }
</style>
