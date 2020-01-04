<template>
  <nav-layout :title="$t('account.main.sendButton')" class="content-wrapper">
    <div class="content-body">
      <div class="from-title">{{ $t('account.send.fromLabel') }}</div>
      <div class="from-address">{{ activeAddress }}</div>
      <wallet-input
        v-model="destAddr"
        :label="$t('account.send.destLabel')"
        :placeholder="$t('account.send.destPlaceHolder')"
      ></wallet-input>

      <wallet-input
        v-model="value"
        type="number"
        postfix=" "
        :label="$t('account.send.valueLabel')"
        :placeholder="$t('account.send.valuePlaceHolder')"
      >
        <div
          class="transfer-coin"
          :class="{down: showTokens}"
          @click="setTokensShow"
          v-click-outside="setHIde"
        >
          <span>{{coinType}}</span>
          <wallet-select
            :options="tokenArr"
            :value="coinType"
            :show="showTokens"
            @on-change="handleTokenChange"
            width="250"
          ></wallet-select>
        </div>
      </wallet-input>

      <!-- <wallet-input v-model="desc" :label="$t('account.send.descLabel')"></wallet-input> -->

      <div class="feesView">
        <div class="feesName" :class="{down: showFeeType}" @click="setTypeShow" v-click-outside="setTypeHide">
          <span>{{feesName}}</span>
           <wallet-select
            :options="[{value: 'WICC'}, {value: 'WUSD'}]"
            :value="feesName"
            :show="showFeeType"
            @on-change="handleFeeTypeChange"
          ></wallet-select>
        </div>
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
  </nav-layout>
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
  flex: 1 0 0;
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
  padding-top: 42px;
}

.from-title {
  color: #8187a5;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
}

.from-address {
  margin-bottom: 24px;
  height: 50px;
  background-color: #f5f7fa;
  border-radius: 6px;
  color: rgba(33, 36, 74, 0.5);
  padding-left: 10px;
  line-height: 50px;
}
.transfer-coin {
  position: absolute;
  z-index: 100;
  right: 1px;
  border: none;
  margin: 0;
  padding-right: 24px;
  font-size: 14px;
  line-height: 19px;
  color: #21244a;
  font-weight: 500;
  cursor: pointer;
  &.down:after {
    transform: rotate(270deg);
  }
  &:after {
    content: "";
    background: url("../static/back-icon-arrow.svg") no-repeat center center;
    position: absolute;
    right: 0px;
    top: 0;
    width: 20px;
    height: 19px;
    background-size: 6px 11px;
    transform-origin: center center;
    transition: all 0.2s;
    transform: rotate(180deg);
  }
}
.feesView {
  padding-top: 20px;
  position: relative;
  .feesName {
    border: 1.5px solid #d9dbde;
    position: absolute;
    top: 15px;
    right: 0px;
    padding-left: 14px;
    padding-right: 34px;
    border-radius: 18px;
    height: 28px;
    margin: 0;
    z-index: 10;
    line-height: 28px;
    font-size: 13px;
    color: #21254a;
    font-weight: 500;
    cursor: pointer;
    &.down:after {
      transform: rotate(270deg);
    }
    &:after {
      content: "";
      background: url("../static/back-icon-arrow.svg") no-repeat center center;
      position: absolute;
      right: 6px;
      width: 20px;
      height: 28px;
      background-size: 6px 11px;
      transform-origin: center center;
      transition: all 0.2s;
      transform: rotate(180deg);
    }
  }
}
</style>

<script type="text/jsx">
import WalletInput from "../components/input";
import NavLayout from "../components/nav-layout";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import formatError from "../api/format-error";
import StateWatcher from "./state-watcher";
import WalletSelect from "../components/select";
import ClickOutside from "vue-click-outside";

export default {
  components: {
    WalletInput,
    FeesSlider,
    NavLayout,
    WalletSelect
  },

  directives: {
    ClickOutside
  },

  mixins: [StateWatcher],

  created() {
    const { query } = this.$router.currentRoute;
    // if (query.balance && !isNaN(parseFloat(query.balance))) {
    //   this.balance = parseFloat(query.balance);
    // } else {
    //   this.balance = 0;
    // }
    this.feesName = query.coinType == "WUSD" ? query.coinType : "WICC";
    this.coinType = query.coinType || "WICC";
    this.tokens = query.tokens === "null" ? {} : JSON.parse(query.tokens);
    let keys = Object.keys(this.tokens);
    ["WICC", "WUSD", "WGRT"].map(item => {
      if (!keys.includes(item)) {
        this.tokens[item] = {
          freeAmount: 0
        };
      }
    });

    for (let item in this.tokens) {
      this.tokenArr.push({
        value: item,
        label: String(this.tokens[item].freeAmount / Math.pow(10, 8))
      });
    }
    console.log(this.tokens)
    this.balance = this.tokens[this.coinType].freeAmount / Math.pow(10, 8)
  },

  computed: {
    valid() {
      return this.destAddr && this.value;
    }
  },

  methods: {
    handleFeeTypeChange(option) {
      this.feesName = option.value
      this.setTypeHide()
    },
    handleTokenChange(option) {
      this.coinType = option.value;
      this.balance = +option.label;
      this.showTokens = false;
    },
    setTypeShow() {
      this.showFeeType = !this.showFeeType
    },
    setTypeHide() {
      this.showFeeType = false;
    },
    setHIde() {
      this.showTokens = false;
    },
    setTokensShow() {
      this.showTokens = !this.showTokens;
    },
    confirmSend() {
      if (!this.validateAddress(this.destAddr)) return;

      if (this.value < 0.0001) {
        this.$toast(this.$t("errors.amountLessThanLimit"), {
          type: "center"
        });

        return;
      }
      if (this.feesName == this.coinType) {
        if (this.balance && this.value > this.balance - this.fees - 0.00001) {
          this.$toast(this.$t("errors.insufficientBalance"), {
            type: "center"
          });
          return;
        }
      } else {
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
        coinType: this.coinType,
        feeSymbol: this.feesName,
        memo: this.desc
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
      feesName: "WICC",
      coinType: "",
      tokens: null,
      tokenArr: [],
      showTokens: false,
      showFeeType: false
    };
  }
};
</script>
