<template>
  <nav-layout footer-padding="60" class="u-full-height">
    <div class="title">{{$t('account.import.title')}}</div>
    <wallet-input :label="$t('account.import.typeLabel')" type="custom">
      <div class="type-wrapper" :class="{hover: show}" @click="setType" v-click-outside="setHide">
        <span class="value">{{$t(`account.import.${type}Type`)}}</span>
        <wallet-select
          :options="[{name: 'mnemonic', value: $t('account.import.mnemonicType')}, {name: 'privateKey', value: $t('account.import.privateKeyType')}]"
          :value="value"
          :show="show"
          @on-change="handleChange"
        ></wallet-select>
        <!-- <option value="mnemonic">{{ $t('account.import.mnemonicType') }}</option>
        <option value="privateKey">{{ $t('account.import.privateKeyType') }}</option>-->
      </div>
    </wallet-input>

    <wallet-input
      v-if="type === 'mnemonic'"
      v-model="mnemonic"
      :label="$t('account.import.mnemonicLabel')"
      :placeholder="$t('account.import.mnemonicPlaceholder')"
      type="textarea"
      @change="setChange"
    ></wallet-input>

    <wallet-input
      v-else
      v-model="privateKey"
      @change="setChange"
      :label="$t('account.import.privateKeyLabel')"
      :placeholder="$t('account.import.privateKeyPlaceholder')"
      type="textarea"
    ></wallet-input>

    <template slot="footer">
      <button
        class="display-block btn-primary"
        :disabled="!isValid"
        @click="confirm"
      >{{ $t('common.confirm') }}</button>
    </template>
  </nav-layout>
</template>

<script>
import WalletInput from "../components/input";
import API from "../api";
import formatError from "../api/format-error";
import NavLayout from "../components/nav-layout";
import WalletSelect from "../components/select";
import ClickOutside from "vue-click-outside";
var _ = require('lodash');

export default {
  name: "import-account",

  components: {
    WalletInput,
    NavLayout,
    WalletSelect
  },

  directives: {
    ClickOutside
  },

  computed: {
    isValid() {
      return this.mnemonic || this.privateKey;
    }
  },

  watch: {
    type(val) {
      if (val === "mnemonic") {
        this.privateKey = null;
      } else if (val === "privateKey") {
        this.mnemonic = null;
      }
    }
  },

  methods: {
    setChange() {
      if (this.type === "mnemonic") {
        this.mnemonic = _.trim(this.mnemonic)
      } else {
        this.privateKey = _.trim(this.privateKey)
      }
    },
    handleChange(option) {
      this.type = option.name;
      this.value = option.value;
      this.setHide();
    },
    setType() {
      this.show = !this.show;
    },
    setHide() {
      this.show = false;
    },
    checkMnemonicCode() {
      API.checkMnemonicCode(this.mnemonic).then(
        data => {
          if (data === true) {
            this.commit();
          } else {
            this.$toast(this.$t("wallet.import.correctMnemonic"), {
              type: "center",
              duration: 5000,
              wordWrap: true
            });
          }
        },
        error => {
          this.$loading.close();
          this.$toast(formatError(error), {
            type: "center",
            duration: 5000,
            wordWrap: true
          });
        }
      );
    },
    commit() {
      this.$loading(this.$t("account.import.confirmLoading"));
      setTimeout(() => {
        API.importAccount(this.mnemonic, this.privateKey).then(
          () => {
            let id = localStorage.getItem("newId");
            API.setActiveAccount(id).then(() => {
              localStorage.removeItem("newId");
              this.$loading.close();
              this.$toast(this.$t("account.import.importSuccess"), {
                type: "center"
              });

              this.$router.push({
                name: "welcome"
              });
            });
          },
          error => {
            this.$loading.close();
            this.$toast(formatError(error), {
              type: "center",
              duration: 5000,
              wordWrap: true
            });
          }
        );
      }, 300);
    },
    confirm() {
      if (this.type === "mnemonic") {
        this.checkMnemonicCode();
      } else {
        this.commit();
      }
    }
  },

  data() {
    return {
      type: "mnemonic",
      value: this.$t("account.import.mnemonicType"),
      mnemonic: null,
      privateKey: null,
      show: false
    };
  }
};
</script>

<style lang="scss">
.type-wrapper {
  .wallet-select {
    top: 48px !important;
  }
}
</style>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  color: #21274a;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 30px;
}
.type-wrapper {
  width: 100%;
  height: 48px;
  padding: 6px 10px;
  border: 1px solid #e4e8ee;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  line-height: 34px;
  &:after {
    content: "";
    position: absolute;
    right: 16px;
    top: 15px;
    width: 8px;
    height: 15px;
    background: url("../static/nextArror.png") no-repeat;
    background-size: 8px 15px;
    transition: all 300ms;
  }
  &.hover {
    border-color: #8187a5;
    &:after {
      transform: rotate(90deg);
    }
  }
}
</style>
