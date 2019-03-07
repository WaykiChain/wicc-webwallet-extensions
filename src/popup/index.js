import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import root from './root.vue'
import router from './router'
import Vodal from 'vodal'
import './scss/skeleton.scss'
import './scss/base.scss'
import './scss/vodel.scss'
import 'vodal/zoom.css'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
import { i18n } from './locale'
import fixed from './api/fixed'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueI18n)

Vue.component(Vodal.name, Vodal)

Vue.use(Toast, {
  defaultType: 'center',
  duration: 2500,
  wordWrap: false,
  width: 'auto'
})

Vue.filter('fixed', fixed)

/* eslint-disable no-new */
new Vue({
  el: '#root',
  i18n,
  router,
  render: h => h(root)
})
