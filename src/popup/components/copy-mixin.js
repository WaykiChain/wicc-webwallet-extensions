import ClipboardJS from 'clipboard'

export default {
  mounted () {
    if (this.clipboardSelector) {
      const clipboard = new ClipboardJS(this.$el.querySelector(this.clipboardSelector), {
        text: () => {
          return this.getCopyText()
        }
      })

      clipboard.on('success', () => {
        this.handleCopySuccess && this.handleCopySuccess()
      })

      this.clipboard = clipboard
    }
  },

  beforeDestroy () {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
  },

  data () {
    return {
      clipboardSelector: null
    }
  },

  methods: {
    getCopyText () {
      return ''
    },

    handleCopySuccess () {
      this.$toast(this.$t('common.copySuccess'), {
        type: 'center',
        duration: 1000
      })
    }
  }
}
