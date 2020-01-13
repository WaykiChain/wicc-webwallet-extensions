<template>
  <div class="password" v-if="show">
    <wallet-input ref="password123" v-model="password" :message="error" :pattern="/^\S{0,}$/" :label="$t('account.header.pwdTip')" type="password"></wallet-input>
    <div class="warn">{{warnTxt}}</div>
    <div class="btn-wrapper">
      <button class="btn-lighter" @click="cancel">{{ $t('common.cancel') }}</button>
      <button class="btn-primary coin-card-copy" @click="confirm">{{ $t('common.confirm') }}</button>
    </div>
  </div>
</template>

<script>
import WalletInput from "../../components/input";
import API from "../../api/index";
export default {
  data() {
    return {
      password: "",
      error: "",
      show: true
    };
  },
  props: {
    warnTxt: {
      type: String,
      default: ""
    }
  },
  components: {
    WalletInput
  },
  mounted() {
    setTimeout(() => {
      if (!this.$refs.password123.$el.querySelector('input')) return
      this.$refs.password123.$el.querySelector('input').focus()
      this.$refs.password123.$el.querySelector('input').onkeyup = data => {
        if (data.keyCode === 13) {
          this.confirm();
        }
      };
    }, 200);
  },
  watch: {
    show(val) {
      if(!val) {
        this.$refs.password123.$el.querySelector('input').onkeyup = null
      }
    }
  },
  methods: {
    cancel() {
      this.$emit("on-cancel");
    },
    confirm() {
      API.validatePassword(this.password).then(
        value => {
          if (value === true) {
            this.$emit("on-confirm");
            this.show = false
          } else {
            this.error = this.$t("errors.passwordError");
          }
        },
        () => {
          this.error = this.$t("common.unknownError");
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.warn {
  padding: 12px 18px 12px 42px;
  border-radius: 6px;
  line-height: 20px;
  color: #8187a5;
  font-weight: 300;
  background: #f5f7fa url("../../static/warning-icon.svg") no-repeat 14px 14px;
  margin-bottom: 14px;
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