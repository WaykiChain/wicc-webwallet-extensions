<template>
  <div class="wallet-select" :style="{width:`${width}px`}" v-if="show">
    <div
      class="option"
      v-for="(option, index) in options"
      :key="index"
      :class="{selected: value === option.value}"
      @click.stop="setSelect(option)"
    >
      <span class="selector"></span>
      <span class="value">
        {{option.value}}
        <i v-if="option.label">({{option.label}})</i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    width: {
      type: [Number, String],
      default: 200
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: [Number, String],
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  methods: {
    setSelect(option) {
      this.$emit("on-change", option);
    },
    handler() {
      this.$emit("on-click-outside");
    }
  }
};
</script>

<style lang="scss" scoped>
.wallet-select {
  position: absolute;
  top: 32px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 6px;
  z-index: 10;
  animation: slide 300ms ease-in-out;
}
@keyframes slide {
  0% {
    opacity: 0.5;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.option {
  line-height: 20px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &.selected .selector {
    border: 2px solid #fff;
    background-color: #062deb;
  }
}
.selector {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: #515151;
  margin-right: 11px;
  border: 1px solid #979797;
  box-sizing: border-box;
}
.value {
  flex: 1 0 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
i {
    font-style: normal;
}
</style>