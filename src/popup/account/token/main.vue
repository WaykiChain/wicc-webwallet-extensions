<template>
  <main-layout ref="mainLayout" >

    <div class="backView"  @click="goback">
       <img src="../../static/back-icon.svg" alt="">
      <p >
       {{this.name}}
      </p>
    </div>

    <div class="tokenCount">
      <p class="count">
         {{activeTokenInfo ? activeTokenInfo.FreeValues : 0}}
      </p>
      <p>
        --
      </p>
    </div>
    <template slot="body" >
      <trans-history
          :transactions="transactions"
          :show-empty-block="!loading"></trans-history>
    </template>

    <template slot="footer">
      <button class="btn-primary display-block" @click="gotoSendToken"> 转账 </button>
    </template>
  </main-layout>
</template>

<style scoped lang="scss">
p{
  margin-bottom: 0;
}
.backView{
  text-align: center;
  box-sizing: border-box;

  img{
    position: absolute;
    left: 5px;
    top: 10px;
  }
  p{
    line-height: 54px;
    font-size: 18px;
    color: #5B5F67;
  };
}
.tokenCount{
  padding: 20px;
  text-align: center;
  font-size: 14px;
  .count{
    font-size: 22px;
    color: #3C78EA;
  }
}
</style>

<script type="text/jsx">
  import API from '../../api'
  import TransHistory from '../components/trans-history'
  import StateWatcher from '../state-watcher'
  import MainLayout from '../components/main-layout'

  export default {
    mixins: [StateWatcher],

    components: {
      TransHistory,
      MainLayout
    },

    created () {
      const query = this.$router.currentRoute.query
      this.regId = query.regId
      this.name = query.name
    },

    watch: {
      activeAddress () {
        this.fetchTokenInfo()
      },

      '$route.query.regId' (val) {
        this.regId = val
        this.fetchTokenInfo()
      },

      '$route.query.name' (val) {
        this.name = val
      }
    },

    methods: {
      goback(){
        this.$router.go(-1)
      },

      fetchTokenInfo () {

        this.loading = true
        this.$loading(this.$t('common.loading'))
        console.log(this.network,this.activeAddress,this.regId)
        API.getTokenInfo(this.network, this.activeAddress, this.regId).then((value) => {
          const tokenInfo = value.result
          if (tokenInfo && tokenInfo.FreeValues) {
            tokenInfo.FreeValues = tokenInfo.FreeValues * Math.pow(10, -8)
          }
          this.activeTokenInfo = tokenInfo
          this.$loading.close()
          this.loading = false
        }, (error) => {
          console.log(error)
          this.$loading.close()
          this.loading = false
        })

        API.getTokenTransHistory(this.network, this.activeAddress, this.regId).then((value) => {
          // console.log('token trans:', value)
          this.transactions = value
        })
      },

      gotoSendToken () {

        if (!this.activeTokenInfo){
          this.$toast('No found this token')
          return
        }

        this.$router.push({
          name: 'sendToken',
          query: {
            from: this.activeAddress,
            network: this.network,
            name: this.name,
            regId: this.regId,
            balance: this.activeTokenInfo.FreeValues
          }
        })
      },
    },

    data () {
      return {
        loading: false,
        regId: null,
        name: null,

        transactions: null,
        activeTokenInfo: null
      }
    }
  }
</script>
