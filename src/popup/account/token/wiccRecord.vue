<template>
  <main-layout ref="mainLayout">
    <div class="backView" @click="goback">
      <img src="../../static/back-icon.svg" alt />
      <p>{{name}}</p>
    </div>

    <div class="tokenCount">
      <p class="count">{{number}}</p>
      <p>--</p>
    </div>
    <template slot="body">
      <trans-history v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-throttle-delay="1000" infinite-scroll-distance="0" :transactions="transactions" :show-empty-block="!loading"></trans-history>
    </template>
    
    <template class="footer" slot="footer">
      <button class="btn-primary" @click="gotoSend">{{ $t('account.main.sendButton') }}</button>
      <button @click="handleReceiveClick">{{ $t('account.main.receiveButton') }}</button>
    </template>
  </main-layout>
</template>

<style scoped lang="scss">
.button-wrapper {
  > button {
    flex: 1 0 0;
  }

  > button:first-child {
    margin-right: 10px;
  }
}
p {
  margin-bottom: 0;
}
.backView {
  text-align: center;
  box-sizing: border-box;

  img {
    position: absolute;
    left: 5px;
    top: 10px;
  }
  p {
    line-height: 54px;
    font-size: 18px;
    color: #5b5f67;
  }
}
.tokenCount {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  .count {
    font-size: 22px;
    color: #3c78ea;
  }
}
</style>

<script type="text/jsx">
import API from "../../api";
import vueiInfinite from 'vue-infinite-scroll';
import Vue from 'vue'
Vue.use(vueiInfinite)
import TransHistory from "../components/wiccs-history";
import StateWatcher from "../state-watcher";
import MainLayout from "../components/main-layout";
import { openQrCodeDialog } from "../dialog";
export default {
  mixins: [StateWatcher],

  components: {
    TransHistory,
    MainLayout
  },
  watch:{
    activeAddress(val){
      this.refresh();
    }
  },
    created(){
        this.number = this.$route.query.coinNum
        this.name = this.$route.query.coinName
    },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    refresh(silence = false) {
      if (!silence) {
        this.$loading(this.$t("common.loading"));
      }
      this.busy = true
      const param = {
        address:this.activeAddress,
        currentpage: this.currentpage,
        pagesize: 10,
        coinsymbol:this.name,
        // txtype:'BCOIN_TRANSFER_TX'
      }
     API.getTransHistory({info:param}).then(
        value => {
          
          console.log('==============',value)
          this.$loading.close();
          this.loading = false;
          if(this.currentpage == 1){
            this.busy = false
            this.transactions = value.transactions;
          }else{
            if(value.transactions.length > 0){
              this.busy = false
              this.transactions.push.apply(this.transactions,value.transactions)
            }else{
              // this.$toast('数据加载完毕')
            }
            
          }
          
        },err=>{
          console.log(err)
          this.$loading.close();
          this.loading = false;
      }
      );
    },
    loadMore(){
      this.currentpage++
      this.refresh()
    },
    gotoSend() {
      this.$router.push({
        name: "send",
        query: {
          balance: this.number,
          coinType:this.name,
        }
      });
    },
    handleReceiveClick() {
      openQrCodeDialog(this.activeAddress);
    }
  },

  data() {
    return {
      loading: false,
      number: null,
      name: null,
      transactions: null,
      activeAccountInfo: null,
      busy: true,
      currentpage:1,
    };
  }
};
</script>