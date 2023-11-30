import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

/* new Vue({
  render: h => h(App),
  router
}).$mount('#app') */

import singleSpaVue from 'single-spa-vue'
const appOptions = {
  el: '#vue', // 挂载到父应用中id为vue的标签中
  router,
  render: h => h(App),
}
const vueLifeCycle = singleSpaVue({
  Vue,
  appOptions,
})
if (window.singleSpaNavigate) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = 'http://localhost:7787'
}
if (!window.singleSpaNavigate) {
  delete appOptions.el
  new Vue(appOptions).$mount('#app')
}
// 协议接入，定好协议父应用会调用这些方法
export const bootstrap = vueLifeCycle.bootstrap
export const mount = vueLifeCycle.mount
export const unmount = vueLifeCycle.unmount
