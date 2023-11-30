import axios from 'axios'
import modal from '@/plugins/modal'
import { getToken } from '@/utils/auth'
import router from '@/router'
import store from '@/store'
import { AUTHOR_KEY } from '@/global'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const baseURL = process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL,
  timeout: 10 * 1000,
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = config.headers?.isToken === false
    if (getToken() && !isToken) {
      config.headers[AUTHOR_KEY] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 二进制数据则直接返回
    if (['blob', 'arraybuffer'].includes(response.request.responseType)) {
      return response
    }
    const res = response.data

    // 展示正确或错误信息
    const code = res.code || 0
    const msg = res.msg
    if (code === 2) {
      store.dispatch('resetToken').then(() => {
        router.push({ path: '/login' })
      })
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code !== 0) {
      modal.notifyError(msg)
      return Promise.reject('error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '后端接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '后端接口' + message.substr(message.length - 3) + '异常'
    }
    modal.msgError(message || '后端接口未知异常')
    return Promise.reject(error)
  }
)

export function getBaseHeader() {
  return {
    Authorization: 'Bearer ' + getToken()
  }
}

export default service
