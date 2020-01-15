<template>
  <div class="warning animated" :class="{fadeInUpBig: show, fadeOutDownBig: !show}">
    <div class="tip">{{ text }}</div>
    <div class="confirm">
      <div class="inner" @click="setConfirm">{{$t('common.confirm')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "warning",
  data() {
    return {
      show: true
    };
  },
  props: {
    text: {
      type: String
    }
  },
  components: {},
  methods: {
    setConfirm() {
      this.show = false
    }
  }
};
</script>

<style lang="scss" scoped>
.warning {
  position: absolute;
  width: 328px;
  bottom: 16px;
  left: 16px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 16px;
  box-sizing: border-box;
  &.fadeInUpBig {
    animation-duration: 0.5s !important;
  }
  .tip {
    padding-left: 30px;
    background: url("../static/warning.svg") no-repeat left top;
    background-size: 18px 16px;
    color: #fff;
    line-height: 20px;
    font-weight: lighter;
    margin-bottom: 21px;
  }
  .confirm {
    overflow: hidden;
    .inner {
      float: right;
      height: 30px;
      padding: 0 15px;
      border: 2px solid rgba(255, 255, 255, 0.5);
      font-size: 17px;
      font-weight: 450;
      color: #fff;
      text-align: center;
      line-height: 30px;
      border-radius: 6px;
      cursor: pointer;
      &:hover {
          border-color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}
</style>