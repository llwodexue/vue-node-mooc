## Vuex 原理解析

> [Vuex 源码](https://github.com/vuejs/vuex)

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch6-1.html)

Vuex 的原理关键：使用 Vue 实例管理状态

1. `Vue.use(registerPlugin)` 全局使用这个组件
2. `vuex._vm = new Vue({ ... })` 创建全局 Vue 实例
3. 全局混入了一个 `beforeCreate` 钩子函数，里面注入 `init` 方法。`init` 方法给各个组件的实例上赋值 `$store`

```html
<body>
  <div id="root">{{ data }}</div>
  <div id="root2">{{ data2 }}</div>
  <div id="root3">
    <button @click="change">change</button>
  </div>
  <script>
    function registerPlugin(Vue) {
      const vuex = {}
      vuex._vm = new Vue({
        data: {
          message: 'hello vue.js',
        },
      })
      vuex.state = vuex._vm
      vuex.mutations = {
        setMessage(value) {
          vuex.state.message = value
        },
      }
      function init() {
        this.$store = vuex
      }
      Vue.mixin({
        beforeCreate: init,
      })
    }
    Vue.use(registerPlugin)
    new Vue({
      el: '#root',
      computed: {
        data() {
          return this.$store.state.message
        },
      },
    })
    new Vue({
      el: '#root2',
      computed: {
        data2() {
          return this.$store.state.message
        },
      },
    })
    new Vue({
      el: '#root3',
      methods: {
        change() {
          const newValue = this.$store.state.message + '.'
          this.$store.mutations.setMessage(newValue)
        },
      },
    })
  </script>
</body>
```

### 插件安装

在调用 `Vue.use(Vuex)` 时，会调用静态的 `install` 方法。`install` 主要任务：把传入的 `_Vue` 赋值给 Vue 并执行了 `applyMixin(Vue)` 方法

```js
/* src/store.js */
export function install (_Vue) {
  // 防止该调用重复执行
  if (Vue && _Vue === Vue) {
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

`applyMixin(Vue)` 首先会判断 Vue 的版本（支持 1.x 版本）

Vue2.0 以上版本的逻辑其实就是在全局混入了一个 `beforeCreate` 钩子函数，里面注入 `vuexInit` 方法。这个方法把 `options.store` 保存在所有组件的 `this.$store` 中，这个 `options.store` 就是我们实例化 `Store` 对象的实例

```js
/* src/mixin.js */
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

### Store 对象

在 `import Vuex` 之后，会实例化其中的 `Store` 对象，返回 `store` 实例并传入 `new Vue` 的 `options`，也就是上面提到的 `options.store`

`Store` 的实例化过拆分成 3 个部分，分别是初始化模块、安装模块和初始化 `store._vm`

- `this._modules = new ModuleCollection(options)` 主要是初始化 modules
- `installModule` 主要是安装模块去对 `_actions` 、`_mutations`、`_wrappedGetters`...进行赋值
- `resetStoreVM` 主要是让 getters 和 state 建立依赖关系并使其变成响应式

```js
/* src/store.js */
export class Store {
  constructor (options = {}) {
    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    // strict mode
    this.strict = strict
    const state = this._modules.root.state

    // init root module.
    installModule(this, state, [], this._modules.root)

    resetStoreVM(this, state)
    // apply plugins
    plugins.forEach(plugin => plugin(this))
  }
  // 这里的get方法会在resetStoreVM创建的Vue实例的data中进行赋值
  get state () {
    return this._vm._data.$$state
  }
}
```

这里主要关注 `resetStoreVM(this, state)`，这里实例化了一个 Vue 实例 `store._vm`，并把 `computed` 传入，`data` 里定义了 `$$data` 属性，当我们访问 `store.state` 的时候，实际上会访问  `Store` 类上定义的  `state` 的 `get` 方法 

```js
/* src/store.js */
function resetStoreVM (store, state, hot) {
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
}
```

## Vue-Router 实现原理

> [Vue-Router 源码](https://github.com/vuejs/vue-router)

### 路由安装

根 Vuex 一样，在调用 `Vue.use(VueRouter)` 时，会调用静态的 `install` 方法

- 将 Vue 导出去，这样就不用单独去 `import Vue` （减小包体积），之后就可以在源码任意地方访问到 Vue 了

- 利用 `Vue.mixin` 把 `beforeCreate` 和 `destroyed` 钩子函数注入到每一个组件中

  `beforeCreate` 做一些私有属性的定义和路由初始化工作

- 在 Vue 原型上添加 `$router` 、`$route` 方法，全局注册 `RouterView`、`RouterLink` 两个组件

```js
/* src/install.js */
export let _Vue
export function install (Vue) {
  // 防止该调用重重复执行
  if (install.installed && _Vue === Vue) return
  install.installed = true
  _Vue = Vue
    
  Vue.mixin({
    beforeCreate () {
      // ...
    },
    destroyed () {
      // ...
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
}
```

### VueRouter 对象

Vue-Router 支持 `hash`、`history`、`abstract` 3 种路由模式

- 路由模式默认为 `hash`，非浏览器会有 `abstract` 模式
- 实例化 VueRouter 时会初始化 `this.history` ，不同 mode 值对应不同的 history
- 在初始化时会执行 `setupHashListener` 方法去设置监听器，监听历史栈的变化，这个稍后会讲到

```js
/* src/index.js */
export default class VueRouter {
  constructor (options: RouterOptions = {}) {
    this.options = options
    let mode = options.mode || 'hash'
    if (!inBrowser) {
      mode = 'abstract'
    }

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  init (app: any /* Vue component instance */) {
    const history = this.history
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }
  }

  // ...
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }
}
```

当我们点击 `router-link` 的时候，实际上会执行 `this.history.push`，不同模式下该函数会略有不同，这里主要以 `HashHistory` 为例

- `push` 函数会先执行 `this.transitionTo` 做路径切换，在切换完成的回调函数中，执行 `pushHash` 函数

- `pushHash` 函数首先会判断当前浏览器是否支持 `history.pushState` 方法

  如果支持，先拼接成新的 url，执行 `pushState` 方法，这个方法会调用浏览器原生的 `history.pushState` 方法或 `history.replaceState` 方法，之后把 url 压入历史栈中（Satari 浏览器可能会报错：触发上限为 100 次的 pushState，所以需要用 try...catch 包裹）

  如果不支持 `history.pushState` 方法，则直接更改 `window.location.hash`

```js
/* src/history/hash.js */
export class HashHistory extends History {
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.transitionTo(location, route => {
      pushHash(route.fullPath)
      onComplete && onComplete(route)
    }, onAbort)
  }
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}

function getUrl (path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

/* src/utils/push-state.js */
export function pushState (url?: string, replace?: boolean) {
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}
```

在初始化时会执行 `setupHashListener` 方法去设置监听器

- 当点击浏览器返回按钮的时候，如果已有 url 被压入历史栈，则会触发 `popstate` 事件，然后拿到当前要跳转的 `hash`，执行 `transitionTo` 方法做一次路径转换

  注意：调用 `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件

```js
export class HashHistory extends History {
  setupListeners () {
    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
      const current = this.current
      this.transitionTo(getHash(), route => {
        if (!supportsPushState) {
          replaceHash(route.fullPath)
        }
      })
    })
  }
}
```

## Vue-Router 导航守卫

起步可直接移步官网 [起步-VueRouter官网](https://router.vuejs.org/zh/guide/#html) 这里就不多介绍了，下面主要说导航守卫

官方说法叫导航守卫，实际上就是发生在路由路径切换的时候，执行的一系列钩子函数

### 全局守卫

导航守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**

- `beforeEach` 里可以对参数进行处理、权限校验、动态修改标题（路由原信息）、开启进度条等
- `afterEach` 里可以做关闭进度条

`src/router.js` 中添加如下内容

```js
// 导航被触发
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  next()
})
// 在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后
router.beforeResolve((to, from, next) => {
  console.log('beforeResolve', to, from)
  next()
})
// 导航被确认之后
router.afterEach((to, from) => {
  console.log('afterEach', to, from)
})
```

### 路由独享守卫

`src/router.js` 中添加如下内容

```js
const routes = [
  {
    path: '/b',
    component: B,
    beforeEnter(to, from, next) {
      console.log('B beforeEnter')
      next()
    },
  },
]
```

### 组件内(局部)守卫

- `beforeRouteEnter` 和 `beforeRouteUpdate` 一般会配合着来使用。当前路由 query 变更时，会调用 `beforeRouteUpdate` （也可以使用 `$route`）

  场景：根据 id 或搜索词进入商品详情页，这时就需要用到 `beforeRouteEnter` ，但如果一个 spu(一个产品) 有多个 sku(具体型号)，切换 sku(具体型号) 时只是 query 发生改变，这时就需要用到 `beforeRouteUpdate` 

**注意：** `beforeRouteEnter` 不能获取组件实例的 `this`，因为当守卫执行前，组件实例还没有被创建。不过可以传一个回调给  `next` 来访问组件实例 `next(vm => { //通过vm访问组件实例 })`，会在 `created` 和 `mounted` 生命周期之间执行

`src/components/B.vue` 中添加如下内容

```js
// 在渲染该组件的对应路由被 confirm 前调用
beforeRouteEnter (to, from, next) {
  console.log('beforeRouteEnter', to, from)
  next()
},
// 在当前路由改变，但是该组件被复用时调用
beforeRouteUpdate (to, from, next) {
  console.log('beforeRouteUpdate', to, from)
  next()
},
// 导航离开该组件的对应路由时调用
beforeRouteLeave (to, from, next) {
  console.log('beforeRouteLeave', to, from)
  next()
}
```

### 解析流程

先看一下官方描述的触发流程，是比较难记住的，结合源码去可能会容易一点

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E5%AF%BC%E8%88%AA%E5%AE%88%E5%8D%AB%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png)

1. 执行 `extractLeaveGuards(deactivated)` ，获取到失活组件定义的 `beforeRouteLeave` 函数
2. 执行 `this.router.beforeHooks`，在 `VueRouter` 类中定义的 `beforeEach` 方法
3. 执行 `extractUpdateHooks(updated)`，获取到重用组件中定义的 `beforeRouteUpdate` 函数
4. 执行 `activated.map(m => m.beforeEnter)`，获取激活在路由配置中定义的 `beforeEnter` 函数
5. 执行 `resolveAsyncComponents(activated)`，解析完所有激活的异步组件后，就可以拿到这一次所有激活的组件
6. 执行 `extractEnterGuards(activated, postEnterCbs, isValid)`，获取组件中的 `beforeRouteEnter` 函数
7. 执行 `enterGuards.concat(this.router.resolveHooks)` 在 `VueRouter` 类中定义的 `beforeResolve` 方法
8. 执行 `onComplete(route)` 随后这里会执行 `this.router.afterHooks`，在 `VueRouter` 类中定义的 `afterEach` 方法

```js
/* src/history/base.js */
export class History {
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const queue: Array<?NavigationGuard> = [].concat(
      extractLeaveGuards(deactivated),    // beforeRouteLeave
      this.router.beforeHooks,            // beforeEach
      extractUpdateHooks(updated),        // beforeRouteUpdate
      activated.map(m => m.beforeEnter),  // beforeEnter
      resolveAsyncComponents(activated)
    )

    runQueue(queue, iterator, () => {
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid) // beforeRouteEnter 
      const queue = enterGuards.concat(this.router.resolveHooks)               // beforeResolve
      runQueue(queue, iterator, () => {
        onComplete(route)                                                      // afterEach
      })
    })
  }
}
```

## 路由元信息和API

通过导航守卫元信息动态修改标题

```js
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'default title'
  }
  next()
})
```

通过 `Vue.mixin` 把 `beforeCreate` 生命周期混入到各个组件中（不推荐）

```js
Vue.mixin({
  beforeCreate() {
    if (this.$route.meta && this.$route.meta.title) {
      document.title = this.$route.meta.title
    } else {
      document.title = 'default title'
    }
  },
})
```

