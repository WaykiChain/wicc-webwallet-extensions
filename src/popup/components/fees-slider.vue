<template>
  <div class="fees-slider">
    <div class="fees-slider-label">{{ label || $t('common.minerFee') }}</div>
    <div class="fees-slider-value-tip">{{ inputValue }} WICC</div>
    <vue-slider
        v-model="inputValue"
        @callback="handleChange"
        :min="min"
        :max="max"
        :interval="interval"
        :tooltip="false"
        :dot-size="20"
        :height="2"></vue-slider>
    <span>{{ $t('common.slow') }}</span>
    <span class="u-pull-right">{{ $t('common.fast') }}</span>
  </div>
</template>

<style lang="scss">
  .fees-slider {
    margin: 0 auto;
    width: 84%;
  }

  .fees-slider .vue-slider-component {
    margin: 0 -6px;

    .vue-slider {
      background-color: #bce0fd;
    }

    .vue-slider-process {
      background-color: #3c78ea;
    }

    .vue-slider-dot-handle {
      background: linear-gradient(to right, #3c78ea 0%, #004eec 100%);
      box-shadow: none;
    }

    .vue-slider-dot {
      position: relative;

      &::after {
        position: absolute;
        display: block;
        content: '';
        background-color: #fff;
        width: 8px;
        height: 8px;
        margin-left: -4px;
        margin-top: -4px;
        left: 50%;
        top: 50%;
        border-radius: 50%;
      }
    }
  }

  .fees-slider {
    position: relative;

    span {
      font-size: 14px;
      color: #999;
    }
  }

  .fees-slider-label {
    color: #999;
    font-size: 14px;
    padding: 2px;
  }

  .fees-slider-value-tip {
    position: absolute;
    font-size: 14px;
    right: 0;
    top: 2px;
    color: #999;
  }
</style>

<script type="text/jsx">
  import VueSlider from 'vue-slider-component'

  export default {
    components: {
      VueSlider
    },

    props: {
      label: {
        type: String
      },
      type: {
        type: String,
        default: 'transfer'
      },
      value: {
        type: Number,
        default: 0.0001
      }
    },

    beforeMount () {
      this.inputValue = this.value
    },

    methods: {
      handleChange (value) {
        this.$emit('input', value)
      }
    },

    data () {
      const type = this.type
      if (type === 'publish-contract') {
        return {
          inputValue: 1.1,
          min: 1.1,
          max: 100,
          interval: 0.1
        }
      } else if (type === 'call-contract') {
        return {
          inputValue: 0.01,
          min: 0.01,
          max: 1,
          interval: 0.01
        }
      } else {
        return {
          inputValue: 0.0001,
          min: 0.0001,
          max: 0.05,
          interval: 0.0001
        }
      }
    }
  }
</script>
