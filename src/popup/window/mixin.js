import API from '../api'
import WalletSelect from "../components/select";
import ClickOutside from "vue-click-outside";

export default {
  components: {
    WalletSelect
  },
  directives: {
    ClickOutside
  },
  created() {
    API.getState().then((state) => {
      if (state.isLocked) {
        const current = this.$router.currentRoute
        return this.$router.push({
          name: 'loginWindow',
          query: {
            redirectPage: JSON.stringify({
              name: current.name,
              query: current.query
            })
          }
        })
      }

      this.network = state.network
      this.address = state.activeAddress
      this.activeAccount = state.activeAccount
    })
  },

  data() {
    return {
      callbackId: null,
      activeAccount: null,
      address: null,
      network: null,
      test: 0,
      raw: 0,
      currentWindowId: 0,
      showFeeType: false
    }
  },

  methods: {
    setTypeShow() {
      this.showFeeType = !this.showFeeType
    },
    setTypeHide() {
      this.showFeeType = false;
    },
    handleFeeTypeChange(option) {
      this.feesName = option.value
      this.setTypeHide()
    },
    getCurrentWindow() {
      const _this = this
      chrome.windows.getCurrent(function (currentWindow) {
        _this.currentWindowId = currentWindow.id
      });
    },
    onWindowClose() {
      const _this = this
      chrome.windows.onRemoved.addListener(function () {
        if (_this.callbackId) {
          API.callPageCallback(_this.callbackId, {
            message: 'User denied transaction signature.'
          }, null)
        }
      });
    },
    handleNetworkChange(network, header) {
      this.network = network

      header.hideNetwork()

      if (network === 'mainnet') {
        this.address = this.activeAccount.address
      } else {
        this.address = this.activeAccount.testnetAddress
      }
    },

    cancel() {
      if (this.callbackId) {
        API.callPageCallback(this.callbackId, {
          message: 'User denied transaction signature.'
        }, null).then(() => { })
        setTimeout(() => {
          window.close()
        }, 300)
      } 
    },

    cutMiddleStr(str,saveNum){
      if (str&& str.length > 24){
        return str.substr(0,saveNum)+'...'+str.substring(str.length,str.length-saveNum)
      }
      return str
    }
  }
}