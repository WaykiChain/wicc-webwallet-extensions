<template>
  <div class="navbar">
    <div class="navbar-btn" @click="goBack">
      <img v-if="backType === 'arrow'" class="arrow" src="../static/back-icon-arrow.png" />
      <img v-else src="../static/back-icon-close.png" />
    </div>
    <div class="navbar-title">
      <slot></slot>
      {{ title }}
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.navbar-title {
  flex: 1;
  overflow: hidden;
  color: #21274a;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
}

.navbar-btn {
  width: 20px;
  cursor: pointer;
}

.navbar-btn img {
  width: 18px;
  float: left;
}
.navbar-btn .arrow {
  width: 13px;
}
</style>

<script type="text/jsx">
export default {
  props: {
    title: {
      type: String
    },

    path: {
      type: Object
    },
    backType: {
      type: String,
      default: "arrow"
    }
  },

  data() {
    return {};
  },

  methods: {
    goBack() {
      if (this.backType === "close") {
        this.$router.replace("/");
      } else {
        if (this.path) {
          this.$router.push(this.path);
        } else {
          history.go(-1);
        }
      }
    }
  }
};
</script>
