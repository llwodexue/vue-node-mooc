import Vue from 'vue'
import Route from 'vue-router'
import HelloWorld from './components/HelloWorld'
import B from './components/B'

Vue.use(Route)
const routes = [
  {
    path: '/b',
    component: B,
    meta: { title: 'Custom Title B' },
    beforeEnter(to, from, next) {
      console.log('B beforeEnter')
      next()
    },
  },
  { path: '/hello-world', component: HelloWorld, meta: { title: 'HelloWorld' } },
]
const router = new Route({
  routes,
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'default title'
  }
  next()
})

router.beforeResolve((to, from, next) => {
  console.log('beforeResolve', to, from)
  next()
})

router.afterEach((to, from) => {
  console.log('afterEach', to, from)
})

export default router
