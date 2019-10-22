<template>
  <div class="main-wrapper">
    <main-header @network-change="handleNetworkChange" :hide-menu-toggle="true"></main-header>
    <div class="content">
      <div class="page-title">{{ $t('window.contract.title') }}</div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.contract.addressLabel') }}</label>
          <span>{{ address }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.contractRegIdLabel') }}</label>
          <span>{{ destRegId }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.valueLabel') }}</label>
          <span>{{ value }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.contract.contractLabel') }}</label>
          <span>{{ contract }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider type="call-cdp" v-model="fees"></fees-slider>
      <div class="button-wrapper">
        <button @click="cancel">{{ $t('window.contract.closeButton') }}</button>
        <button
          class="btn-primary"
          @click="test ? testConfirm() : confirm()"
        >{{ $t('window.contract.confirmButton') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "../account/components/main-header";
import Main from "../account/main";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import formatError from "../api/format-error";
import WindowMixin from "./mixin";

export default {
  name: "contract",

  mixins: [WindowMixin],

  components: {
    Main,
    MainHeader,
    FeesSlider
  },

  created() {
    const query = this.$router.currentRoute.query;
    this.destRegId = query.destRegId;
    this.contract = query.contract;
    this.value = parseFloat(query.value) || 0;
    this.callbackId = query.callbackId;
    this.test = query.test;
  },

  methods: {
    // 测试
    testConfirm() {
      this.$loading(this.$t("window.contract.confirmLoading"));

      API.callRaw("genCallContractRaw", {
        network: this.network,
        address: this.address,
        destRegId: this.destRegId,
        value: this.value,
        fees: this.fees,
        contract: this.contract
      }).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.contract.createSuccess"), {
            type: "center"
          });

          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, value);
          }

          setTimeout(() => {
            window.close();
          }, 300);
        },
        error => {
          this.$loading.close();
          this.$toast(
            this.$t("window.contract.createFailure") + " " + formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );

          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }

          console.log(error);
        }
      );
    },
    confirm() {
      this.$loading(this.$t("window.contract.confirmLoading"));

      API.callContract(
        this.network,
        this.address,
        this.destRegId,
        this.value,
        this.fees,
        this.contract
      ).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.contract.createSuccess"), {
            type: "center"
          });

          if (this.callbackId) {
            API.callPageCallback(this.callbackId, null, value);
          }

          setTimeout(() => {
            window.close();
          }, 300);
        },
        error => {
          this.$loading.close();
          this.$toast(
            this.$t("window.contract.createFailure") + " " + formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );

          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null);
          // }

          console.log(error);
        }
      );
    }
  },

  data() {
    return {
      destRegId: null,
      contract: null,
      value: 0,
      fees: 0.01
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>