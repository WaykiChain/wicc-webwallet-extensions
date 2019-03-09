<template>
  <div class="token-list-wrapper">
    <div class="account-info">
      <div class="account-info-basic">
        <img src="../../static/account-icon.svg" />
        <div class="account-info-name">{{ $t('common.accountLabel') }} {{ activeAccount ? activeAccount.index + 1 : 1 }}</div>
      </div>
      <div class="account-address-wrapper" v-show="activeAddress">
        <span class="account-address">{{ activeAddress }}</span>
        <button class="address-btn-copy"></button>
      </div>
    </div>
    <div class="token-list-container">
      <ul class="token-list">
        <li class="token-item"
            :class="{
            active: activeRegId === null
          }"
            @click="handleItemClick(null)">
          <img class="token-item-icon" src="../../static/coin-icon.svg"/>
          <span class="token-item-name">WICC</span>
        </li>
        <li class="token-item"
            v-for="(token, index) in visibleTokens"
            :key="index"
            @click="handleItemClick(token)"
            :class="{
            active: activeRegId === token.regId
          }"
        >
          <img class="token-item-icon" src="../../static/coin-icon.svg"/>
          <span class="token-item-name">{{ token.name }}</span>
          <span class="token-item-more-btn">
            <span class="token-item-remove-btn" @click.stop="handleRemoveToken(token)">{{ $t('account.main.removeToken') }}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="token-list-bottom">
      <button class="token-list-btn-add" @click="gotoAddToken"><img src="../../static/coin-no-add-icon.svg" /> 
      {{ $t('account.main.addTokenButton') }} <span style="font-size:10px;"> ({{ $t('account.main.expect') }})</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .token-list-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding-top: 20px;
  }

  .token-list-container {
    flex: 1 0 0;
    overflow-y: auto;
  }

  .account-info-basic {
    text-align: center;
  }

  .account-info-basic img {
    width: 60px;
    height: 60px;
  }

  .account-info-name {
    font-size: 16px;
    font-weight: 400;
  }

  .account-address-wrapper {
    display: flex;
    flex-direction: row;
    border: 1px solid #C6CEDE;
    background-color: #F2F5FC;
    border-radius: 3px;
    margin: 16px 16px 0 16px;
    overflow: hidden;
    height: 48px;
    box-sizing: border-box;
  }

  .account-address {
    font-size: 13px;
    color: #5B5F67;
    flex: 1 100%;
    text-overflow: ellipsis;
    line-height: 48px;
    overflow: hidden;
    padding-left: 10px;
  }

  .address-btn-copy {
    display: inline-block;
    border: none;
    padding: 0;
    margin: 0;
    flex: 1 0 32px;
    width: 32px;
    background: url('../../static/copy-icon-blue.svg') center center no-repeat;
    background-size: 16px 17px;
  }

  .token-list-bottom {
    text-align: center;
    height:63px;
    line-height: 63px;
    background:rgba(242,245,252,1);
  }

  .token-list-btn-add {
    border: none;
   color:rgba(153,153,153,1);
   font-size: 16px;
  }

  .token-list-btn-add img {
    position: relative;
    width: 15px;
    height: 15px;
    top: 3px;
  }

  .token-list {
    list-style: none;
    margin: 0 16px;
  }

  .token-item {
    display: flex;
    flex-direction: row;
    padding: 16px 0;
    align-items: center;
    border-bottom: 1px solid rgba(180, 188, 204, 0.3);
    cursor: pointer;
  }

  .token-item.active {
    color: #3C78EA;
    font-weight: bold;
  }

  .token-item-icon {
    width: 43px;
    height: 39px;
    margin-right: 8px;
  }

  .token-item-name {
    font-weight: 400;
    font-size: 16px;
    margin-right: 8px;
    flex: 1 0 0;
  }

  .token-item-more-btn {
    position: relative;
    width: 40px;
    height: 39px;
    background: url('../../static/more-icon.svg') right center no-repeat;
    background-size: 20px 4px;

    &:hover .token-item-remove-btn {
      display: inline-block;
    }

    .token-item-remove-btn {
      display: none;
      background: rgba(70, 74, 83, .95);
      position: absolute;
      right: 0;
      top: 30px;
      padding-left: 15px;
      width: 128px;
      height: 42px;
      box-sizing: border-box;
      line-height: 42px;
      font-size: 14px;
      color: white;
    }
  }
</style>

<script type="text/jsx">
  import CopyMixin from '../../components/copy-mixin'
  import API from '../../api'

  export default {
    name: 'token-list',

    mixins: [CopyMixin],

    props: {
      activeRegId: {
        type: String
      },
      activeAccount: {
        type: Object
      },
      activeAddress: {
        type: String
      },
      network: {
        type: String
      },
      tokens: {
        type: Array,
        default () {
          return []
        }
      }
    },

    computed: {
      visibleTokens () {
        const network = this.network
        const tokens = this.tokens
        return tokens.filter((token) => {
          const tokenNetwork = token.network || 'testnet'
          return tokenNetwork === network
        })
      }
    },

    methods: {
      gotoAddToken () {
        //return false;
        this.$router.push({
          name: 'addToken'
        })
      },

      getCopyText () {
        return this.activeAddress
      },

      handleItemClick (token) {
        this.activeToken = token
        this.$emit('active-token-change', token)
      },

      handleRemoveToken (token) {
        const index = token.index
        API.removeToken(this.activeAccount.id, index).then(() => {
          const token = this.tokens[index]
          this.tokens.splice(index, 1)
          if (token && token.regId === this.activeRegId) {
            this.activeToken = null
            this.$emit('active-token-change', null)
          }

          this.$toast(this.$t('account.main.removeTokenSuccess'), {
            type: 'center'
          })
        }, (error) => {
          console.log('remove token error:', error)
          this.$toast(this.$t('account.main.removeTokenFailed'), {
            type: 'center'
          })
        })
      }
    },

    data () {
      return {
        activeToken: null,
        clipboardSelector: '.address-btn-copy'
      }
    }
  }
</script>
