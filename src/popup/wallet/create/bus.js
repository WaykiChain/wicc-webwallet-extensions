import Vue from 'vue'

const EventBus = new Vue({
  data () {
    return {
      password: null,
      mnemonic: null
    }
  }
})

export default EventBus
