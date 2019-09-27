<template>
  <div class="content-wrapper">
    <nav-bar :title="$t('account.send.title')"></nav-bar>
    <div class="content-body">
      <div class="from-title">{{ $t('account.send.fromLabel') }}</div>
      <div class="from-address">{{ activeAddress }}</div>
      <label
        class="transfer-limit"
      >{{$t('account.sendToken.limit')}}&nbsp;{{balance}} &nbsp;{{coinType}}</label>
      <wallet-input
        v-model="destAddr"
        :label="$t('account.send.destLabel')"
        :placeholder="$t('account.send.destPlaceHolder')"
      ></wallet-input>

      <wallet-input
        v-model="value"
        type="number"
        :postfix="coinType"
        :label="$t('account.send.valueLabel')"
        :placeholder="$t('account.send.valuePlaceHolder')"
      ></wallet-input>

      <wallet-input v-model="desc" :label="$t('account.send.descLabel')"></wallet-input>

      <div class="feesView">
        <select class="feesName" name="WICC" id v-model="feesName">
          <option value="WICC">WICC</option>
          <option value="WUSD">WUSD</option>
        </select>
        <fees-slider v-model="fees" type="call-cdp" :feeName="feesName"></fees-slider>
      </div>
    </div>

    <div class="content-footer">
      <button
        :disabled="!valid"
        class="display-block btn-primary"
        @click="confirmSend"
      >{{ $t('account.send.confirmButton') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.content-body {
  margin-top: 20px;
  flex: 1 0 0;
  padding: 0 16px 7px;
  position: relative;
}
.transfer-limit {
  position: absolute;
  display: inline-block;
  top: 158px;
  right: 17px;
  z-index: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(165, 174, 193, 1);
}
.content-footer {
  padding: 0 16px;
}

.from-title,
.from-address {
  color: #717680;
  font-size: 14px;
  padding: 2px;
}

.from-address {
  margin-bottom: 10px;
}
.feesView {
  padding-top: 47px;
  position: relative;
  .feesName {
    border: none;
    position: absolute;
    top: 10px;
    right: 0px;
  }
}
</style>

<script type="text/jsx">
import WalletInput from "../components/input";
import NavBar from "../components/nav-bar";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import formatError from "../api/format-error";
import StateWatcher from "./state-watcher";

export default {
  components: {
    WalletInput,
    FeesSlider,
    NavBar
  },

  mixins: [StateWatcher],

  created() {
    const { query } = this.$router.currentRoute;
    if (query.balance && !isNaN(parseFloat(query.balance))) {
      this.balance = parseFloat(query.balance);
    } else {
      this.balance = 0;
    }
    this.feesName = query.coinType == "WUSD" ?  query.coinType : 'WICC'
    this.coinType = query.coinType
  },

  computed: {
    valid() {
      return this.destAddr && this.value;
    }
  },

  methods: {
    confirmSend() {
      if (!this.validateAddress(this.destAddr)) return;

      if (this.value < 0.0001) {
        this.$toast(this.$t("errors.amountLessThanLimit"), {
          type: "center"
        });

        return;
      }
      if (this.feesName == this.coinType){
        if (this.balance && this.value > (this.balance - this.fees - 0.00001)) {
          this.$toast(this.$t("errors.insufficientBalance"), {
            type: "center"
          });
          return;
        }
      }else{
        if (this.balance && this.value > this.balance) {
          this.$toast(this.$t("errors.insufficientBalance"), {
            type: "center"
          });
          return;
        }
      }
      

      this.$loading(this.$t("account.send.confirmLoading"));

      let param = {
        address: this.activeAddress,
        destAddr: this.destAddr,
        value: this.value,
        fees: this.fees,
        coinType: this.$route.query.coinType,
        feeSymbol: this.feesName,
        memo:this.desc,
      };
      this.callRaw("variousCoinsTx", param);
    },
    
    callRaw(method, param) {
      API.callRaw(method, { info: param }).then(
        res => {
          console.log(res);
          this.$loading.close();
          this.$toast(this.$t("account.send.sendSuccess"), {
            type: "center"
          });
          setTimeout(() => {
              window.history.go(-2);
          }, 1000);
          
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
        }
      );
    }
  },

  data() {
    return {
      balance: null,
      destAddr: null,
      value: null,
      desc: null,
      fees: 0.01,
      feesName:'WICC',
      coinType:'',
    };
  }
};
</script>
