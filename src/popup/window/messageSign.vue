<template>
  <div class="main-wrapper">
    <div class="content">
      <h5 class="page-title">{{$t('window.msgSign.xxqm')}}</h5>
      <div class="info">
        <div class="imgbox">
          <img :src="imgUrl" alt />
        </div>
        <p class="app-name">{{appName}} {{$t('window.msgSign.appName')}}</p>
      </div>
      <p class="infoMsg">{{$t('window.msgSign.msgDesc')}}</p>
      <div class="cells">
        <div class="cell">
          <label>授权账号</label>
          <span class="addr">{{cutMiddleStr(address,6)}}</span>
        </div>
        <div class="cell">
          <label>消息</label>
          <span>{{msg}}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{$t('window.cdp.qx')}}</button>
        <button class="btn-primary" @click="sureCreateCDP">{{$t('window.cdp.qd')}}</button>
      </div>
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
      imgUrl: "",
      appName: ""
    };
  },
  created() {
    const query = this.$router.currentRoute.query;
    this.msg = query.message.substr(0, 30);
    this.imgUrl = query.imgUrl;
    this.appName = query.appName;
    this.callbackId = query.callbackId;
    console.log(query);
  },
  methods: {
    sureCreateCDP() {
      this.$loading(this.$t("window.cdp.zzyzqm")); //this.$t("window.transfer.confirmLoading")
      let param = {
        address: this.address,
        msg: this.msg
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
          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }
        }
      );
    }
  }
};
</script>
<style lang="scss">
@import "./common.scss";
.main-wrapper {
  p {
    margin: 0;
  }
  .info {
    display: flex;
    align-items: center;
  }
  .imgbox {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .app-name {
    font-size: 16px;
    color: #21254a;
  }
  .infoMsg {
    line-height: 28px;
    font-size: 20px;
    color: #21254a;
    margin-top: 24px;
    border-bottom: 1px solid #f0f3f7;
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
  .footer {
    border: none;
    .button-wrapper {
      margin-top: 106px;
    }
  }
}
</style>
