<template>
  <div class="main-wrapper must-wicc">
    <div class="content">
      <div class="page-title">{{ $t('window.publishContract.title') }}</div>
      <div class="cells">
        <div class="cell">
          <label>{{ $t('window.publishContract.addressLabel') }}</label>
          <span class="">{{ cutMiddleStr(address, 6) }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.publishContract.scriptDescLabel') }}</label>
          <span>{{ scriptDesc }}</span>
        </div>
        <div class="cell">
          <label>{{ $t('window.publishContract.scriptLabel') }}</label>
          <span>{{ script }}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <fees-slider v-model="fees" type="publish-contract" :show-wicc-symbol="true"></fees-slider>
      <div class="button-wrapper">
        <button class="btn-lighter" @click="cancel">{{ $t('window.publishContract.closeButton') }}</button>
        <button
          class="btn-primary"
          @click="raw ? confirmRaw() : confirm()"
        >{{ $t('window.publishContract.confirmButton') }}</button>
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
    const query = this.$route.query; //currentRoute
    //const par = location.hash.split('?')[1].split('&');
    this.script = decodeURI(query.script);
    this.scriptDesc = query.scriptDesc;
    (this.callbackId = query.callbackId), (this.raw = query.raw);
    console.log(this.script);
  },

  methods: {
    confirmRaw() {
      this.$loading(this.$t("window.publishContract.confirmLoading"));
      API.callRaw("genPublishContractRaw", {
        network: this.network,
        address: this.address,
        fees: this.fees,
        script: this.script,
        scriptDesc: this.scriptDesc
      }).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.publishContract.createSuccess"), {
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
            this.$t("window.publishContract.createFailure") +
              " " +
              formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );

          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null)
          // }

          console.log(error);
        }
      );
    },
    confirm() {
      this.$loading(this.$t("window.publishContract.confirmLoading"));

      API.publishContract(
        this.network,
        this.address,
        this.fees,
        this.script,
        this.scriptDesc
      ).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.publishContract.createSuccess"), {
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
            this.$t("window.publishContract.createFailure") +
              " " +
              formatError(error),
            {
              type: "center",
              duration: 5000,
              wordWrap: true
            }
          );

          // if (this.callbackId) {
          //   API.callPageCallback(this.callbackId, error, null)
          // }

          console.log(error);
        }
      );
    }
  },

  data() {
    return {
      script: null,
      scriptDesc: null,
      fees: 1.1
    };
  }
};
</script>

<style lang="scss">
@import "./common.scss";
</style>