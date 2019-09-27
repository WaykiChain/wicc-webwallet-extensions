<template>
  <div class="cdp">
    <div class="content">
      <h5 class="titleHeader">{{$t('window.msgSign.xxqm')}}</h5>
      <div class="bar">
        <span>{{$t('window.msgSign.zh')}}{{activeAccount?activeAccount.index+1:1}}：{{cutMiddleStr(address,8)}}</span>
      </div>
      <div class="cell">
        <div class="info">
          <img :src="imgUrl" alt />
          <p class="cellValue" style="line-height:26px">{{appName}} {{$t('window.msgSign.appName')}}</p>
        </div>
        <p class="infoMsg">{{$t('window.msgSign.msgDesc')}}</p>
      </div>
      <div style="overflow:hidden;padding: 20px 16px;">
        <p class="cellValue">{{$t('window.msgSign.msgTitle')}}</p>
        <p class="cellName" style="margin-top:10px;">{{msg}}</p>
      </div>
    </div>

    <div class="bottom_btn">
      <div class="btn" @click="cancel">{{$t('window.cdp.qx')}}</div>
      <div class="btn sure" @click="sureCreateCDP">{{$t('window.cdp.qd')}}</div>
    </div>
  </div>
</template>
<script>
import API from "../api";
import WindowMixin from "./mixin";
import formatError from "../api/format-error";
export default {
  mixins: [WindowMixin],
  data() {
    return {
      urlQuery: "",
      msg: "",
      imgUrl:"",
      appName:"",
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.msg = query.message;
    this.imgUrl = query.imgUrl;
    this.appName = query.appName;
    this.callbackId = query.callbackId;
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      this.$loading(this.$t("window.cdp.zzyzqm")); //this.$t("window.transfer.confirmLoading")
      let param = {
        address:this.address,
        msg:this.msg,
      };
      API.callRaw("messageSign", { info: param }).then(
        res => {
          this.$loading.close();
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, res);
            this.$toast("Success", {
              type: "center",
              duration: 1000,
              wordWrap: true
            });
            setTimeout(() => {
              window.close();
            }, 1000);
          }
        },
        error => {
          this.$loading.close();
          this.$toast(
            this.$t("window.transfer.createFailure") + " " + formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );
          if (this.callbackId) {
            API.callPageCallback(this.callbackId, error, null);
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.cdp {
  .titleHeader {
    line-height: 64px;
    text-align: center;
    border-bottom: 1px solid rgba($color: #b4bccc, $alpha: 0.3);
    font-size: 18px;
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
    line-height: 18px;
  }
}
.content {
  height: 447px;
  position: relative;
  .bar {
    line-height: 30px;
    background: #f2f5fc;
    color: #a0a9be;
    font-size: 12px;
    text-align: center;
  }
}
.cellName {
  color: #b4bccc;
  font-size: 13px;
  line-height: 26px;
  line-height: 1.5;
  word-break: break-all;
}
.cellValue {
  color: #5b5f67;
  font-size: 14px;
  
}
.cell {
  position: relative;
  padding: 20px 16px;
  &:after {
    content: " ";
    width: calc(100% - 32px);
    height: 1px;
    background: rgba($color: #b4bccc, $alpha: 0.3);
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%); //居中处理
  }

  img {
    width: 26px;
    height: 26px;
    margin-right: 10px;
  }
  .info {
    display: flex;
    justify-content: flex-start;
  }
  .infoMsg {
    font-size: 20px;
    color: #21294a;
    line-height: 1.5;
    margin-top: 10px;
    word-break: break-all;
  }
}
.bottom_btn {
  display: flex;
  justify-content: flex-start;
  margin-top: 120px;
  .btn {
    width: calc(50% - 24px);
    margin-left: 16px;
    text-align: center;
    font-size: 16px;
    line-height: 48px;
    border-radius: 4px;
    border: 1px #b4bccc solid;
    cursor: pointer;
  }
  .sure {
    background: -webkit-linear-gradient(
      #3c78ea,
      #004eec
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#3c78ea, #004eec); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#3c78ea, #004eec); /* Firefox 3.6 - 15 */
    background: linear-gradient(#3c78ea, #004eec); /* 标准的语法 */
    color: white;
    border: none;
  }
}
</style>
