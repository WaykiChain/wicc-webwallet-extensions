<template>
  <div class="window-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "empty",

  created() {
    document.title = "WICC";
  }
};
</script>

<style scoped>
.window-container {
  padding: 0;
  margin: 0;
  width: 360px;
  height: 600px;
  margin: auto;
  position: relative;
  background-color: #fff;
}
@media (min-width: 550px) {
  .window-container {
    box-shadow: 0 5px 10px #ccc;
  }
}
</style>
