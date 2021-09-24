## $emit 和 $on

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-1.html)

$emit 和 $on 主要负责事件的定义和消费，以实现逻辑的解耦

```html
<body>
  <div id="root">
    <button @click="boost">触发事件</button>
  </div>
  <script>
    new Vue({
      el: '#root',
      data() {
        return {
          message: 'hello vue',
        }
      },
      created() {
        this.$on(['my_events', 'my_events2'], this.handleEvents)
      },
      methods: {
        handleEvents(e) {
          console.log(this.message, e)
        },
        boost() {
          this.$emit('my_events', 'my params')
        },
      },
    })
  </script>
</body>
```

### $on

通过对 [案例](https://llwodexue.github.io/vue-node-mooc/src/ch3-1.html) 进行断点调试分析

![](https://gitee.com/lilyn/pic/raw/master/js-img/$on%E6%BA%90%E7%A0%81.png)

$on传入两个参数事件名称 `event`、事件处理方法 `fn` 

1. 将 Vue 实例传给 vm `var vm = this`
2. 判断事件名称 `event` 是否是数组
   - 是，使用迭代的方法继续调用 $on，将 `event` 事件名称数组中每个名称都依次绑定事件方法
   - 否，判断 `vm._events`  下的 `event` 是否为空，如果为空则给它默认置为空数组，然后把 `fn` 事件处理方法 push 进去 `(vm._events[event] || (vm._events[event] = [])).push(fn)`
3. 返回处理后的 Vue 实例

通过第 2 步可知，**可以一个事件名称 event 绑定多个事件方法 fn** 

```js
this.$on('my_events', this.handleEvents)
this.$on('my_events', this.handleEvents)
```

**也可以多个事件 event 绑定一个事件方法 fn** 

```js
this.$on(['my_events1', 'my_events2'], this.handleEvents)
```

### $emit

通过对 [案例](https://llwodexue.github.io/vue-node-mooc/src/ch3-1.html) 进行断点调试分析

![](https://gitee.com/lilyn/pic/raw/master/js-img/$emit%E6%BA%90%E7%A0%81.png)

$emit 传入一个参数事件名称 `event`

1. 将 Vue 实例传给 vm `var vm = this`

2. 将事件名称转为小写并赋给 lowerCaseEvent：`var lowerCaseEvent = event.toLowerCase()`

3. 从 `vm._events` 中拿出事件方法，有对应的 event 才会处理，没有直接返回 Vue 实例

4. 对事件方法进行处理，如果一个事件名称有多个事件方法则对其进行数组转换操作 `cbs = cbs.length > 1 ? toArray(cbs) : cbs`

   对参数进行数组转换操作

5. 将事件方法依次遍历在 `invokeWithErrorHandling` 里执行

   `invokeWithErrorHandling` 是加了 `try-catch` 的，如果执行过程出错是不会中断代码的运行，会走 Vue 全局处理异常的 `handleError` 方法

6. 返回处理后的 Vue 实例

通过第 5 步可知，**$emit 中报错并不会中断代码的执行因为内部做了 try-catch 处理**

## directive

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-2.html)

官方文档：[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

主要看的是指令的钩子函数：

- `bind`：指令第一次绑定到元素时调用
- `inserted`：被绑定元素插入父节点时调用
- `update`：所在组件的 VNode 更新时调用
- `componentUpdated`：指令所在组件 VNode 及其 VNode 全部更新时调用
- `unbind`：指令与元素解绑时调用

以及钩子函数的参数：

- `el`：需要进行 loading 操作的 DOM 对象
- `binding`：一个对象，包含 `name`、`value`、`oldValue`、`expression`、`arg`、`modifiers` 这些属性
- `vnode`：Vue 编译生成的虚拟节点

```html
<body>
  <div id="root">
    <div v-loading="isLoading">{{data}}</div>
    <button @click="update">更新</button>
  </div>
  <script>
    Vue.directive('loading', {
      update(el, binding, vnode) {
        if (binding.value) {
          const div = document.createElement('div')
          div.innerText = '加载中...'
          div.setAttribute('id', 'loading')
          div.style.position = 'absolute'
          div.style.left = 0
          div.style.top = 0
          div.style.width = '100%'
          div.style.height = '100%'
          div.style.display = 'flex'
          div.style.justifyContent = 'center'
          div.style.alignItems = 'center'
          div.style.color = 'white'
          div.style.background = 'rgba(0, 0, 0, .7)'
          document.body.append(div)
        } else {
          document.body.removeChild(document.getElementById('loading'))
        }
      },
    })
    new Vue({
      el: '#root',
      data() {
        return {
          isLoading: false,
          data: '',
        }
      },
      methods: {
        update() {
          this.isLoading = true
          setTimeout(() => {
            this.data = '用户数据'
            this.isLoading = false
          }, 3000)
        },
      },
    })
  </script>
</body>
```

`Vue.directive` 传递两个参数

1. 自定义指令名称 `id` 对应 loading，`definition` 对应 update 外层的那个对象

2. 因为 `type` 是 directive 而不是 component，definition 是一个对象，条件就都不会走到

   可以发现这里不仅可以使用对象还可以传递函数，它会默认把这个函数添加到 bind 和 update 里面： `definition = { bind: definition, update: definition }` 

3. 在 Vue 实例的 options 的 directives 上挂载 loading 方法

![](https://gitee.com/lilyn/pic/raw/master/js-img/directive%E6%BA%90%E7%A0%811.png)

可以发现 `v-model`、`v-show` 也是自定义指令

![](https://gitee.com/lilyn/pic/raw/master/js-img/directive%E6%BA%90%E7%A0%812.png)

## component

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-3.html)

```html
<body>
  <div id="root">
    <Test :msg="message"></Test>
  </div>
  <script>
    Vue.component('Test', {
      template: '<div>{{msg}}</div>',
      props: {
        msg: {
          type: String,
          default: 'default message'
        }
      }
    })
    new Vue({
      el: '#root',
      data() {
        return {
          message: "Test Component"
        }
      }
    })
  </script>
</body>
```

`compoent` 跟 `directive` 一样首先会进入一个匿名函数，传递两个参数

1. 组件名称 `id` 对应 Test，`definition` 是一个对象

2. 验证 id 是否符合命名规范 `/^[a-zA-Z][\w-]*$/` ，即 kebab-case（短横线分割命名） 或 PascalCase（首字母大写命名）

3. 首先判断它是不是一个纯粹对象（使用 `Object.prototype.toString.call(obj)`），jQuery 对此加了一层判断（直属类是 Object  或 所属类的原型的 constructor 是 Object `Function.toString.call(Object.getPrototypeOf(obj).constructor) === Object.toString()`）

   之后看 `definition` 对象里是由有 name 属性，如果没有默认赋值 `id`

   最后走 `Vue.extend` ，在其中构造一个 `Vue` 的子类，使用原型继承把一个纯粹对象转换成 一个继承于 `Vue` 的构造器 `Sub` 返回

4. 在 Vue 实例的 options 的 components上挂载组件对象

在这里可以发现一些全局组件：`KeepAlive`、`Transition`、`TransitionGroup`

![](https://gitee.com/lilyn/pic/raw/master/js-img/component%E6%BA%90%E7%A0%811.png)

## Vue.extend

### 基础

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-4.html)

这里组件的定义方法根上面不太一样，这里直接用 `Vue.extend` 生成组件

```html
<body>
  <h2 class="title">
    <a href="../index.html" style="text-decoration: none; color: #2c3e50">>back</a>
  </h2>
  <div id="root">
    <Test :msg="message"></Test>
  </div>
  <script>
    const component = Vue.extend({
      template: '<div>{{msg}}</div>',
      props: {
        msg: {
          type: String,
          default: 'default message'
        }
      },
      name: 'Test'
    })
    Vue.component('Test')
    new Vue({
      el: '#root',
      data() {
        return {
          message: "Test Extend Component"
        }
      }
    })
  </script>
</body>
```

`Vue.extend ` 接收一个参数 extendOptions

1. 使用基础`Vue` 构造器创建一个子类 `Sub`，使用原型继承的方式使 `Sub` 继承于 `Vue`，然后对 `Sub` 这个对象扩展 options 属性（会把接收的 extendOptions 合并），并把 `Vue` 以 super 属性挂载到 `Sub` 上

2. 对配置中的 `props` 和 `computed` 做了初始化工作

   `props` 走 `proxy` 方法，通过 `Object.defineProperty` 把 `target[sourceKey][key]` 变成 `target[key]`

3. 把 extend、mixin、use、component、directive、filter、options、extendOptions...挂载到子类 `Sub` 上

4. 最后对子类 `Sub` 进行了缓存，避免多次执行 `Vue.extend` 的时候对同一个组件重复构造。返回子类 `Sub` 

![](https://gitee.com/lilyn/pic/raw/master/js-img/VueExtend%E6%BA%90%E7%A0%811.png)

![](https://gitee.com/lilyn/pic/raw/master/js-img/VueExtend%E6%BA%90%E7%A0%812.png)

### * 进阶

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-5.html)

loading CSS 样式

```css
#loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
}
```

```html
<body>
  <div id="root">
    <button @click="showLoading">显示Loading</button>
  </div>
  <script>
    function Loading(msg) {
      const LoadingComponent = Vue.extend({
        template: '<div id="loading-wrapper">{{msg}}</div>',
        props: {
          msg: {
            type: String,
            default: 'loading...',
          },
        },
        name: 'LoadingComponent',
      })
      const div = document.createElement('div')
      div.setAttribute('id', 'loading-wrapper')
      document.body.append(div)
      new LoadingComponent({
        props: {
          msg: {
            type: String,
            default: msg,
          },
        },
      }).$mount('#loading-wrapper')
      return () => {
        document.body.removeChild(document.getElementById('loading-wrapper'))
      }
    }
    Vue.prototype.$loading = Loading
    new Vue({
      el: '#root',
      methods: {
        showLoading() {
          const hide = this.$loading('正在加载，请稍等...')
          setTimeout(() => {
            hide()
          }, 2000)
        },
      },
    })
  </script>
</body>
```

之前我们用 `directive` 实现 loading，现在我们换一种方式实现，直接在 Vue 中使用 loading

1. 把 loading 方法挂载到 Vue 原型上，这个方法接收 1 个参数
2. 创建一个 div 并挂载到页面上，给其设置 id 属性 `loading-wrapper`
3. 由于 `Vue.extend` 返回的是一个 `Sub` 子类，可以使用 new 生成对应实例，生成的实例要挂载到 id 属性为 `loading-wrapper` 的 div 上（直接覆盖，因此 id 必须相同，否则后面移除的时候会找不到）
4. loading 函数的函数值，是将 id 属性为 `loading-wrapper` 的 div 移除掉，可以在指定的时间将其移除

**实现 loading 效果，使用这种方式（自定义 API）相比自定义指令更加灵活，耦合度更低**

## Vue.use

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch3-6.html)

Vue.use 主要是用来加载 Vue 的插件，这个案例跟上面那个不一样，这个是把上面那个封装成插件，提高了复用性

```html
<body>
  <div id="root">
    <button @click="showLoading">显示Loading</button>
  </div>
  <script>
    const loadingPlugin = {
      install: function(vm) {
        const LoadingComponent = vm.extend({
          template: '<div id="loading-wrapper">{{msg}}</div>',
          props: {
            msg: {
              type: String,
              default: 'loading...'
            }
          }
        }, 'LoadingComponent')
        function Loading(msg) {
          const div = document.createElement('div')
          div.setAttribute('id', 'loading-wrapper')
          document.body.append(div)
          new LoadingComponent({
            props: {
              msg: {
                type: String,
                default: msg
              }
            } 
          }).$mount('#loading-wrapper')
          return () => {
            document.body.removeChild(document.getElementById('loading-wrapper'))
          }
        }
        vm.prototype.$loading = Loading
      }
    }
    Vue.use(loadingPlugin)
    new Vue({
      el: '#root',
      methods: {
        showLoading() {
          const hide = this.$loading('正在加载，请稍等...')
          setTimeout(() => {
            hide()
          }, 2000)
        }
      }
    })
  </script>
</body>
```

1. Vue.use 引入一个插件 plugin，首先判断 installedPlugins 中是否有这个 plugin（做了缓存），如果有直接返回

2. toArray 方法实现，在下图。`toArray(arguments, 1)` 相当于把除了第一个元素以外的其余元素以数组形式返回

   `args.unshift(this)` 相当于在数组索引为 0 添加数据，相当于 install 方法第一个参数是 Vue

3. 判断 plugin 的 install 是否为函数，如果是函数执行 plugin.install 方法

   如果 plugin 是函数，则执行 plugin 方法

4. 最后把这个 plugin 添加到 installedPlugins 中，避免同一个插件多次安装

![](https://gitee.com/lilyn/pic/raw/master/js-img/Vue.use%E6%BA%90%E7%A0%81.png)

![](https://gitee.com/lilyn/pic/raw/master/js-img/toArray%E6%BA%90%E7%A0%81.png)

**Vue.use 好处：让代码显得更加简洁，将整个插件存放到另外一个模块中，通过模块方式使整个代码解耦**

## 挂载

- $on 的方法会挂载到 `vm._events` 上去

- directive、compoents、filters 的方法会挂载到 `vm.options` 上去

- Vue.extend 会把 extend、mixin、use、component、directive、filter、options、extendOptions...挂载到子类 `Sub(VueComponent)` 上去

- initState 会把 prop 变为响应式，并挂在到 `vm._props.xxx` 上去，之后通过 proxy 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上去

- initData 通过 proxy 把 `vm._data.xxx` 的访问代理到 `vm.data` 上去，之后调用 observe 方法观测整个 data 变化，data 也就变为响应式了

- Vue.use 注册的插件会挂载到 `vm._installedPlugins` 上去

- provide 会先挂载到 `vm.options` 上，最后挂载到 `vm._provided` 上

  inject 先挂载到 `vm.options` 上，最后挂载到 `vm` (VueComponent) 上

