<template>
  <vodal class="view-pk-dialog" :show="visible" animation="zoom" @hide="onHide" :width="300">
    <div class="dialog-title">{{ $t('account.dialog.exportPkTitle') }}</div>
    <password
      :warn-txt="$t('account.dialog.exportPkTip')"
      @on-cancel="onHide"
      @on-confirm="onConfirm"
    ></password>
    <div class="info-content" v-if="showInfoContent">
      <wallet-input v-model="privateKey" :label="$t('account.header.keySave')" type="textarea" read-only></wallet-input>
      <div class="btn-wrapper">
        <button @click="download" class="btn-lighter">{{ $t('account.dialog.downloadPkButton') }}</button>
        <button class="privateKey-need-copy btn-primary">{{ $t('account.dialog.copyPkButton') }}</button>
      </div>
    </div>
  </vodal>
</template>

<script>
import WalletInput from "../../components/input";
import API from "../../api/index";
import download from "../../api/download";
import Password from "./password";
import ClipboardJS from "clipboard";

export default {
  name: "view-private-key",

  components: {
    WalletInput,
    Password
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    network: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    }
  },

  watch: {
    showInfoContent(val) {
      setTimeout(() => {
        const clipboard = new ClipboardJS(
          this.$el.querySelector(this.clipboardSelector),
          {
            text: () => {
              return this.getCopyText();
            }
          }
        );

        clipboard.on("success", () => {
          this.handleCopySuccess && this.handleCopySuccess();
        });
      }, 200);
    }
  },

  methods: {
    handleCopySuccess() {
      this.$toast(this.$t("common.copySuccess"), {
        type: "center",
        duration: 1000
      });
    },
    show() {
      this.visible = true;
    },

    download() {
      download("WICC-Private-Key.txt", this.privateKey);
    },

    onHide() {
      this.$emit("update:visible", false);
      this.visible = false;
      this.$emit("hide");
    },

    getCopyText() {
      return this.privateKey;
    },

    onConfirm() {
      this.showInfoContent = true;
      this.$loading(this.$t("common.loading"));
      setTimeout(() => {
        API.getPrivateKey(this.network, this.address).then(
          value => {
            this.privateKey = value;
            this.$loading.close();
          },
          () => {
            this.$loading.close();
          }
        );
      }, 300);
    }
  },

  data() {
    return {
      privateKey: null,
      clipboardSelector: ".privateKey-need-copy",
      showInfoContent: false
    };
  }
};
</script>

<style lang="scss" scoped>
.dialog-title {
  text-align: center;
  font-size: 16px;
  color: #21274a;
  line-height: 22px;
  font-weight: 500;
  margin-bottom: 16px;
}

.tip-title {
  font-size: 14px;
  color: #ff1010;

  &::before {
    content: " ";
    display: inline-block;
    width: 24px;
    height: 14px;
    vertical-align: middle;
    background: url("../../static/warning-icon.svg") center center no-repeat;
    background-size: 18px 14px;
  }
}

.btn-wrapper {
  text-align: center;
  display: flex;
  justify-content: space-between;
  button {
    margin: 0;
    padding: 0;
    width: 124px;
  }
}
</style>