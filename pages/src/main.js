import Vue from 'vue'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss'
import '@/assets/styles/common.scss'
import App from './App'
import store from './store'
import router from './router'
import directive from './directive'
import plugins from './plugins'

import './assets/icons'
import './permission'
import { parseTime, resetForm } from '@/utils'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'

// 全局方法挂载
Vue.prototype.$parseTime = parseTime
Vue.prototype.$resetForm = resetForm

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(directive)
Vue.use(plugins)

import '@/assets/icons'
import request from '@/utils/request'
Vue.prototype.$axios = request
import '@/styles/index.scss'

// 默认点击背景不关闭弹窗
import ElementUI from 'element-ui'
ElementUI.Dialog.props.closeOnClickModal.default = false

Vue.use(Element, {
  size: 'small'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
