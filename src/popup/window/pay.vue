<template>
  <div class="main-wrapper must-wicc">
    <div class="content">
      <div class="page-title">{{ $t('window.transfer.title') }}</div>
      <div class="value-block">
        <div class="value">-{{ value }} WICC</div>
      </div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.transfer.addressLabel') }}</label>
          <span class="">{{ cutMiddleStr(address, 6) }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.transfer.destAddressLabel') }}</label>
          <span class="">{{ cutMiddleStr(destAddress, 6) }}</span>
        </div>
        <div class="cell" v-if="desc">
          <label>{{ $t('account.transDetail.commentLabel') }}</label>
          <span>{{ desc }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider v-model="fees" type="wiccTx" :show-wicc-symbol="true"></fees-slider>
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{ $t('window.transfer.closeButton') }}</button>
        <button
          class="btn-primary"
          @click="raw ? confirmRaw() : confirm()"
        >{{ $t('window.transfer.confirmButton') }}</button>
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
    this.destAddress = query.destAddress;
    this.desc = query.desc;
    this.callbackId = query.callbackId;
    this.value = parseFloat(query.value) || 0;
    this.raw = query.raw;
  },

  methods: {
    confirmRaw() {
      this.$loading(this.$t("window.transfer.confirmLoading"));

      API.callRaw("sendRaw", {
        network: this.network,
        address: this.address,
        destAddr: this.destAddress,
        value: this.value,
        fees: this.fees,
        desc: this.desc
      }).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.transfer.createSuccess"), {
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

          console.log(error);
        }
      );
    },
    confirm() {
      this.$loading(this.$t("window.transfer.confirmLoading"));
      API.send(
        this.network,
        this.address,
        this.destAddress,
        this.value,
        this.fees,
        this.desc
      ).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.transfer.createSuccess"), {
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

          console.log(error);
        }
      );
    }
  },

  data() {
    return {
      destAddress: null,
      desc: null,
      value: 0,
      fees: 0.001
    };
  }
};
</script>

<style lang="scss">
@import "./common.scss";
.main-wrapper {
  .value-block {
    border-bottom: 1px solid #f0f3f7;
    margin-bottom: 24px;
    .value {
      font-size: 18px;
      color: #1d213c;
      font-weight: 500;
      line-height: 24px;
      padding-bottom: 24px;
    }
  }
}
</style>