import API from '../api'

export default {
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
      onlyRaw: 0,
      currentWindowId: 0
    }
  },

  methods: {
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
      if (str){
        return str.substr(0,saveNum)+'...'+str.substring(str.length,str.length-saveNum)
      }
      return ''
    }
  }
}