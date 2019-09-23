<template>
  <div class="wallet-container">
    <nav-layout class="u-full-height">
      <template slot="title">
        <span>{{ $t('setting.index.net') }}</span>
      </template>

      <template>
        <div class="section">
          <span>{{ $t('setting.index.name') }}</span>
          <input type="text" maxlength="50" v-model="name">
        </div>
         <div class="section">
          <span>{{ $t('setting.index.rpc') }}</span>
          <input type="text" v-model="url">
        </div>
        <div class="btnView">
          <div class="cancel">取消</div>
          <div class="save" @click="save">保存</div>
        </div>
      </template>
    </nav-layout>
  </div>
</template>

<style lang="scss" scoped>
@import "./header-tab.scss";

.section{
  span{
    color: #717680;
    font-size: 15px;
    line-height: 30px;
  }
  input{
    width: 100%;
    margin: 0;
  }
  margin-top: 24px;
}
.btnView{
  margin-top: 60px;
  display: flex;
  justify-content: center;
  div{
    width: 164px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    color: #5B5F67;
    border-radius: 3px;
  }
  .cancel{
    border: #B4BCCC 1px solid;
    background: white;
    margin-right: 16px;
  }
  .save{
    border: none;
    background: #004EEC;
    color: white;
  }
}

</style>

<script type="text/jsx">
import NavLayout from "../components/nav-layout";
import axios from 'axios'
export default {
  name: "setting",


  components: {
    NavLayout
  },

  methods: {
    save() {
      this.checkUrl()
      return
      
    },
    checkUrl(){
      
      axios.post(this.url + '/block/getinfo',{}).then(res=>{
        const net = res.data.data.nettype
        if (net === 'MAIN_NET'){
          this.add('mainnet')
        }else{
          this.add('testnet')
        }
      }).catch(err=>{
        this.$toast('Invalid url')
      })
    },
    add(network){
      
      const netItem = {
        name:this.name,
        url:this.url,
        network: network
      }
      if (!this.netList){
        this.netList = []
      }
      this.netList.push(netItem)
      localStorage.setItem('netList',JSON.stringify(this.netList))
      this.$toast(this.$t('account.addToken.addSuccess'))
      this.$router.go(-1)
    }
  },

  data() {
    return {
      netList : [],
      name:'',
      url:'',
    };
  },
  created(){
    this.netList = JSON.parse(localStorage.getItem('netList'))
  }
};
</script>
