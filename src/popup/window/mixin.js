import API from '../api'

export default {
  created () {
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

  data () {
    return {
      callbackId: null,
      activeAccount: null,
      address: null,
      network: null,
      test: 0,
      onlyRaw: 0
    }
  },

  methods: {
    handleNetworkChange (network, header) {
      this.network = network

      header.hideNetwork()

      if (network === 'mainnet') {
        this.address = this.activeAccount.address
      } else {
        this.address = this.activeAccount.testnetAddress
      }
    },

    cancel () {
      if (this.callbackId) {
        API.callPageCallback(this.callbackId, { message: 'User denied transaction signature.' }, null).then(() => {
          setTimeout(() => {
            window.close()
          }, 300)
        })
      } else {
        window.close()
      }
    }
  }
}
