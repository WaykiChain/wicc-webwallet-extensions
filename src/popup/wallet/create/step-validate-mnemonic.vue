<template>
  <nav-layout back-type="close" :path="backPath" class="u-full-height">
    <div class="title">{{$t('wallet.create.validate.title')}}</div>
    <div
    class="mnemonic-word"
      style="margin-top: 16px;">{{currentMnemonic}}</div>

    <div class="mnemonic-wrap">
      <mnemonic-tags
        :default-selection="defaultSelection"
        :mnemonics="shuffledMnemonics"
        @input="handleInput"
      ></mnemonic-tags>
    </div>

    <template>
      <button
        class="display-block btn-primary"
        :disabled="!isCompleted || !isValid"
        @click="confirmCreate"
      >{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<style lang="scss" scoped>
.mnemonic-wrap {
  margin-top: 24px;
  margin-bottom: 24px;
}
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
.mnemonic-word {
  background: #f5f7fa;
  padding: 14px;
  padding-bottom: 22px;
  line-height: 20px;
  border-radius: 6px;
  font-size: 15px;
  color: rgb(6, 45, 235);
  min-height: 76px;
  box-sizing: border-box;
}
</style>

<script type="text/jsx">
import NavLayout from "../../components/nav-layout";
import WalletInput from "../../components/input";
import MnemonicTags from "../../components/mnemonic-tags";
import * as shuffle from "shuffle-array";
import API from "../../api";
import formatError from "../../api/format-error";
import eventBus from "../../account/bus";
import mnemonic from "./mnemonic";

export default {
  name: "validate-mnemonic",

  components: {
    NavLayout,
    WalletInput,
    MnemonicTags
  },

  props: {
    mnemonics: {
      type: Array,
      default: []
    }
  },

  created() {
    this.shuffledMnemonics = shuffle(this.mnemonics.slice());

    const route = this.$router.currentRoute;
    console.log("query:", route.query);
    const { password, mnemonic, currentMnemonic } = route.query;
    if (password) {
      this.password = password;
    }
    if (mnemonic) {
      this.mnemonic = mnemonic;
    }
    if (currentMnemonic) {
      this.selection = currentMnemonic.split(" ");
      this.currentMnemonic = currentMnemonic;
      this.defaultSelection = this.selection;
    }

    if (route && route.path) {
      this.isCreatingWallet = route.path.indexOf("wallet") !== -1;
    }

    // window.onunload = () => {
    //   localStorage.setItem(
    //     "WICC_RESTORE_PATH",
    //     JSON.stringify({
    //       name: route.name,
    //       query: {
    //         ...(route.query || {}),
    //         currentMnemonic: this.currentMnemonic
    //       }
    //     })
    //   );
    // };
  },

  destroyed() {
    window.onunload = null;
  },

  computed: {
    isCompleted() {
      return (this.selection || []).length === 12;
    },

    backPath() {
      if (this.isCreatingWallet) {
        return {
          name: "backupWalletMnemonic"
        };
      } else {
        return {
          name: "createAccount"
        };
      }
    }
  },

  methods: {
    confirmCreate() {
      this.$loading(this.$t("wallet.create.validate.confirmLoading"));

      setTimeout(() => {
        this.$loading.close();
        this.$toast(this.$t("wallet.create.validate.createSuccess"), {
          type: "center"
        });

        if (!this.isCreatingWallet) {
          eventBus.$emit("header:state:refresh");
        }

        this.$router.push({
          name: "accountMain"
        });
      }, 300);
    },

    validate() {
      const mnemonics = this.mnemonics;
      const selection = this.selection || [];

      let isValid = true;
      for (let i = 0; i < selection.length; i++) {
        if (mnemonics[i] !== selection[i]) {
          isValid = false;
        }
      }

      if (!isValid) {
        this.$toast(this.$t("wallet.create.validate.validateErrorTip"), {
          type: "center"
        });
      }

      return isValid;
    },

    handleInput(selection) {
      this.selection = selection;
      this.currentMnemonic = selection.join(" ");

      this.isValid = this.validate();
    }
  },

  data() {
    return {
      isCreatingWallet: true,
      defaultSelection: null,
      selection: [],
      currentMnemonic: "",
      shuffledMnemonics: [],
      isValid: true,
      mnemonic: "",
      password: null
    };
  }
};
</script>