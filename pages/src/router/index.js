import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes } from './constant'

Vue.use(Router)

// 防止连续点击多次路由报错
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
export { constantRoutes } from './constant'
export { dynamicRoutes } from './dynamic'
export { userRoutes } from './dynamic'
