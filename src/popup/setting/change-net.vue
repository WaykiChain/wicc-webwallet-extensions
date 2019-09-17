<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <template slot="title">
        <span>{{ $t('setting.index.net') }}</span>
        <span class="editNet" @click="edit">{{showclose ? $t('setting.index.done') : $t('setting.index.edit') }}</span>
      </template>

      <template>
        <div class="section-title">
          <span>{{ $t('account.header.mainnet')}}</span>
        </div>
        <div class="section-title">
          <span>{{ $t('account.header.testnet') }}</span>
        </div>
        <div class="section-title" v-for="(item,index) in netList" v-bind:key="index">

          <span>{{ item.name }}</span>
          <img v-if="showclose" src="../static/colose.png" @click="delNet(index)" />
        </div>
        <div class="addNet" @click="toAddNet">添加网络</div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";
.section-title {
  border-bottom: rgba(180, 188, 204, 0.301) 1px solid;
  line-height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > img {
    width: 13px;
    height: 13px;
  }
}
.editNet{
  cursor: pointer;
  position: absolute;
  right: 16px;
  color: #8e8e8e;
  font-size: 14px;
}
.addNet{
  position: absolute;
  bottom: 16px;
  left: 16px;
  line-height: 48px;
  text-align: center;
  width: 343px;
  border: #3C78EA 1px solid;
  border-radius: 3px;
  color: #3C78EA;

}
</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";

export default {
  name: "setting",

  created() {
    this.netList = JSON.parse(localStorage.getItem('netList'))
  },

  components: {
    NavLayout
  },

  methods: {
  
    edit(){
      this.showclose = !this.showclose
    },
    toAddNet(){
      this.$router.push({path:'addNet'})
    },
    delNet(index){
      this.netList.splice(index,1)
      localStorage.setItem('netList',JSON.stringify(this.netList))
    }
  },

  data() {
    return {
      showclose:false,
      netList:[],
    };
  }
};
</script>
