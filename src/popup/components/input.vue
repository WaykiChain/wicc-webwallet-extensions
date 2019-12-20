<template>
  <div class="wallet-input">
    <div class="wallet-input--label">{{ label || '' }}</div>
    <div class="wallet-input-content" :class="{hover: hover, readOnly: readOnly}">
      <textarea
        v-if="theType === 'textarea'"
        class="wallet-input--textarea display-block"
        :value="value"
        :placeholder="placeholder"
        :readonly="readOnly"
        :style="{color: color}"
        @input="handleInput"
        @focus="focusHandler"
        @blur="blurHandler"
      ></textarea>

      <input
        ref="input"
        v-if="theType === 'text' || theType === 'password' || theType === 'number'"
        class="wallet-input--input display-block"
        :placeholder="placeholder"
        :type="theType"
        :value="value"
        :readonly="readOnly"
        :style="{color: color}"
        @input="handleInput"
        @focus="focusHandler"
        @blur="blurHandler"
      />

      <div v-if="postfix" class="wallet-input-postfix">{{ postfix }}</div>

      <slot></slot>

      <div class="actions" v-if="!postfix && theType !== 'textarea'">
        <div class="action clear" v-if="showClear" @click="setClear"></div>
        <div class="action line" v-if="showClear && showCheck"></div>
        <div
          class="action check"
          :class="{cansee: cansee}"
          v-if="showCheck && showClear"
          @click="toggleCansee"
        ></div>
      </div>
    </div>
    <div class="wallet-input--message"></div>
  </div>
</template>

<script>
export default {
  name: "WalletInput",

  props: {
    label: {
      type: String
    },
    color: {
      type: String,
      default: "#21294A"
    },
    type: {
      default: "text"
    },
    value: {
      default: null
    },
    placeholder: {
      type: String,
      default: ""
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
  beforeMount() {
    if (this.type === "password") {
      this.showCheck = true;
    }
    this.theType = this.type;
  },
  data() {
    return {
      hover: false,
      showClear: false,
      cansee: false,
      showCheck: false,
      theType: ""
    };
  },
  watch: {
    cansee(val) {
      if (val) {
        this.theType = "text";
      } else {
        this.theType = "password";
      }
    }
  },
  methods: {
    setClear() {
      this.$refs.input.value = "";
      this.$emit("input", "");
      setTimeout(() => {
        this.showClear = false;
      }, 10);
    },
    toggleCansee() {
      this.cansee = !this.cansee;
    },
    focusHandler() {
      if (this.readOnly) {
        return;
      }
      this.hover = true;
    },
    blurHandler() {
      this.hover = false;
    },
    handleInput(event) {
      const type = this.type;
      let value = event.target.value;

      if (value) {
        this.showClear = true;
      } else {
        this.showClear = false;
      }

      if (type === "number") {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          value = parsed;
        }
      }
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.wallet-input {
  margin-bottom: 24px;
}
.wallet-input--label {
  color: #717680;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 6px;
}

.wallet-input-content {
  display: flex;
  align-items: center;
  border: 1px solid #e4e8ee;
  border-radius: 6px;
  &.hover {
    border-color: #8187a5;
  }
  &.readOnly {
    border: 0;
  }
}

.wallet-input-postfix {
  margin-right: 12px;
  margin-left: 12px;
  font-size: 12px;
}

.wallet-input--input {
  height: 48px;
  margin: 0;
  border: 0;
  flex: 1;
  overflow: hidden;
}

.actions {
  right: 1px;
  top: 1px;
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .action {
    background-color: #ccc;
    margin-right: 12px;
    cursor: pointer;
  }
  .clear {
    margin-left: 12px;
    width: 16px;
    height: 16px;
    background: url("../static/input-clear.svg");
  }
  .line {
    width: 1px;
    height: 17px;
    background-color: #d1d2da;
  }
  .check {
    width: 18px;
    height: 14px;
    background: url("../static/cansee.svg");
    &.cansee {
      background: url("../static/cannotsee.svg");
    }
  }
}

.wallet-input--textarea {
  padding: 16px;
  resize: none;
  font-size: 14px;
  line-height: 30px;
  height: 120px;
  margin: 0;
  border: 0;
}

.wallet-input--textarea[readonly] {
  background: #f5f7fa;
  font-size: 15px;
  color: #21294a;
}

.wallet-input--message {
  line-height: 20px;
}
</style>
