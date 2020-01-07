<template>
  <div class="fees-slider">
    <div class="fees-slider-label">
      <div>{{ label || $t('common.minerFee') }}</div>
      <div class="fees-slider-value-tip">{{ inputValue }} <span v-if="showWiccSymbol">WICC</span> </div>
    </div>
    <vue-slider
      v-model="inputValue"
      @callback="handleChange"
      :min="min"
      :max="max"
      :interval="interval"
      :tooltip="false"
      :dot-size="16"
      :height="4"
    ></vue-slider>
    <div class="speed">
      <span class="u-pull-left">{{ $t('common.slow') }}</span>
      <span class="u-pull-right">{{ $t('common.fast') }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.fees-slider {
  margin: 0 auto;
}

.fees-slider .vue-slider-component {
  margin: 0 -6px;

  .vue-slider {
    background-color: #E4E8EE;
    border-radius: 2px;
  }

  .vue-slider-process {
    background-color: #062DEB;
  }

  .vue-slider-dot-handle {
    background: linear-gradient(to right, #062DEB 0%, #062DEB 100%);
    box-shadow: none;
  }

  .vue-slider-dot {
    position: relative;

    &::after {
      position: absolute;
      display: block;
      content: "";
      background-color: #fff;
      width: 12px;
      height: 12px;
      margin-left: -6px;
      margin-top: -6px;
      left: 50%;
      top: 50%;
      border-radius: 50%;
    }
  }
}

.fees-slider {
  position: relative;
}

.speed {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  color: #8187A5;
  font-size: 13px;
  line-height: 18px;
}

.fees-slider-label {
  width: 210px;
  color: #8187a5;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
}

.fees-slider-value-tip {
  color: #21254a;
  font-size: 15px;
  font-weight: 500;
}
</style>

<script type="text/jsx">
import VueSlider from "vue-slider-component";

export default {
  components: {
    VueSlider
  },

  props: {
    feeName: {
      type: String,
      default: "WICC"
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: "transfer"
    },
    value: {
      type: Number,
      default: 0.0001
    },
    showWiccSymbol: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this.inputValue = this.value;
  },

  methods: {
    handleChange(value) {
      this.$emit("input", value);
    }
  },

  data() {
    const type = this.type;
    if (type === "publish-contract") {
      return {
        inputValue: 1.1,
        min: 1.1,
        max: 100,
        interval: 0.1
      };
    } else if (type === "call-cdp") {
      return {
        inputValue: 0.01,
        min: 0.01,
        max: 0.1,
        interval: 0.001
      };
    } else if (type === "wiccTx") {
      return {
        inputValue: 0.001,
        min: 0.001,
        max: 0.01,
        interval: 0.0001
      };
    } else {
      return {
        inputValue: 0.001,
        min: 0.001,
        max: 0.01,
        interval: 0.0001
      };
    }
  }
};
</script>
