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
import messages from './locale'
import i18nUtil from './api/i18n'
import fixed from './api/fixed'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.component(Vodal.name, Vodal)

Vue.use(Toast, {
  defaultType: 'center',
  duration: 2500,
  wordWrap: false,
  width: 'auto'
})

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: i18nUtil.getLanguage(),
  messages
})

Vue.filter('fixed', fixed)

/* eslint-disable no-new */
new Vue({
  el: '#root',
  i18n,
  router,
  render: h => h(root)
})
