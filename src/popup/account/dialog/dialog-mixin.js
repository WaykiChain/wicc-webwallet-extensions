export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    show () {
      this.visible = true
    },

    hide () {
      this.visible = false
    },

    onHide () {
      this.$emit('update:visible', false)
      this.visible = false
      this.$emit('hide')
    }
  }
}
