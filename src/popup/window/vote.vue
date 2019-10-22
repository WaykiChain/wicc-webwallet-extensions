<template>
  <div class="main-wrapper">
    <main-header @network-change="handleNetworkChange" :hide-menu-toggle="true"></main-header>

    <div class="content">
      <div class="page-title">{{ $t('window.vote.title') }}</div>
      <div class="cells">
        <template v-for="vote in votes">
          <div class="cell no-border">
            <label>{{ $t('window.vote.addressLabel') }}</label>
            <span>{{ vote.address }}</span>
          </div>

          <div class="cell">
            <label>{{ vote.votes >= 0 ? $t('window.vote.valueLabel') : $t('window.vote.withdrawValueLabel') }}</label>
            <span>{{ formatVotes(vote.votes) }} WICC</span>
          </div>
        </template>
      </div>
    </div>

    <div class="footer">
      <fees-slider v-model="fees"></fees-slider>
      <div class="button-wrapper">
        <button @click="cancel">{{ $t('window.vote.closeButton') }}</button>
        <button class="btn-primary" @click="onlyRaw ? confirmRaw() : confirm()">{{ $t('window.vote.confirmButton') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "../account/components/main-header";
import Main from "../account/main";
import FeesSlider from "../components/fees-slider";
import API from "../api";
import fixed from "../api/fixed";
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
    const votesString = query.votes;
    try {
      this.votes = JSON.parse(votesString);
    } catch (error) {
      console.log("parse votes error:", votesString, error);
    }

    this.callbackId = query.callbackId;
    this.onlyRaw = query.onlyRaw;
  },

  methods: {
    formatVotes(votes) {
      votes = votes || 0;
      return fixed(Math.abs(votes * Math.pow(10, -8)), 8);
    },

    confirmRaw() {
      if (this.votes && this.votes.length > 11) {
        this.$toast(this.$t("window.vote.maxVoteLimit"), {
          type: "center"
        });

        return;
      }

      this.$loading(this.$t("window.vote.confirmLoading"));

      API.callRaw("voteRaw", this.network, this.address, this.votes, this.fees).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.vote.createSuccess"), {
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
            this.$t("window.vote.createFailure") + " " + formatError(error),
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
      if (this.votes && this.votes.length > 11) {
        this.$toast(this.$t("window.vote.maxVoteLimit"), {
          type: "center"
        });

        return;
      }

      this.$loading(this.$t("window.vote.confirmLoading"));

      API.vote(this.network, this.address, this.votes, this.fees).then(
        value => {
          this.$loading.close();
          this.$toast(this.$t("window.vote.createSuccess"), {
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
            this.$t("window.vote.createFailure") + " " + formatError(error),
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
      votes: [],
      fees: 0.0001
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>