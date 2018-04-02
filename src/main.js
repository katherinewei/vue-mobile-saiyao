// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import App from './App'
import {AjaxPlugin, ToastPlugin, WechatPlugin, LoadingPlugin} from 'vux'
import store from './store/'

Vue.use(WechatPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(LoadingPlugin)

// Vue.prototype.$http.defaults.baseURL = 'https://api.saiyaoyun.com/v2/'
Vue.prototype.$http.defaults.baseURL = 'http://192.168.2.111:5020/v2/'

FastClick.attach(document.body)

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
