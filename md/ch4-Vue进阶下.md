## new Vue

在学 provide inject 之前，最好先知道 new Vue 都做了什么

- Vue 的庐山真面目就在此，实际上就是一个用 Function 实现的类，我们只能通过 `new Vue` 去实例化它

![](https://gitee.com/lilyn/pic/raw/master/js-img/newVue%E6%BA%90%E7%A0%811.png)

- 在`this._init(options)` 执行之前，除了给它的原型 prototype 扩展方法，还会给 Vue 这个对象扩展全局静态方法（set、delete、nextTick... -> 挂载到 Vue ASSET_TYPES[component|directive|filter] 和 _base(Vue 实例) -> 挂载到 Vue.options），这部分代码搜索 `initGlobalAPI`，这里就不举例了
- Vue 初始化主要干了如下几件事情：
  1. 合并配置（options）
  2. 初始化生命周期（initLifecycle）、初始化事件中心（initEvents）、初始化渲染（initRender）在 `beforeCreate` 之前
  3. 初始化 inject、初始化状态[props、methods、data、watach]（initState）、初始化provide 在 `beforeCreate` 之后在 `created` 之前

![](https://gitee.com/lilyn/pic/raw/master/js-img/newVue%E6%BA%90%E7%A0%813.png)

![](https://gitee.com/lilyn/pic/raw/master/js-img/newVue%E6%BA%90%E7%A0%814.png)

## provide inject

provide inject 为了提高更好的跨组件解决方案

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-1.html)

官方文档：[provide / inject](https://cn.vuejs.org/v2/api/#provide-inject)

`provide` 应该是一个对象或返回对象的函数，该对象可注入其子孙的 property

`inject` 应该是一个字符串数组或一个对象（key 是本地绑定名）

**注意：provide 和 inject 绑定并不是可响应的。然后，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的**

```html
<html>
  <head>
    <title>组件通信 provide 和 inject</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>
    <div id="root">
      <Test></Test>
    </div>
    <script>
      function registerPlugin() {
        Vue.component('Test', {
          template: '<div>{{message}}<Test2 /></div>',
          provide() {
            return {
              elTest: this
            }
          }, // function 的用途是为了获取运行时环境，否则 this 将指向 window
          data() {
            return {
              message: 'message from Test'
            }
          },
          methods: {
            change(component) {
              this.message = 'message from ' + component
            }
          }
        })
        Vue.component('Test2', {
          template: '<Test3 />'
        })
        Vue.component('Test3', {
          template: '<button @click="changeMessage">change</button>',
          inject: ['elTest'],
          methods: {
            changeMessage() {
              this.elTest.change(this.$options._componentTag)
            }
          }
        })
      }
      Vue.use(registerPlugin)
      new Vue({
        el: '#root'
      })
    </script>
  </body>
</html>
```

1. 通过 provide 将它的属性/方法/数据...甚至 Vue(this) 暴露出去，提供给子孙后代使用 `provide() { return { elTest: this } }`，provide 会先挂载到 `vm.options` 上，最后挂载到 `vm._provided` 上

2. inject 先挂载到 `vm.options` 上，最后挂载到 `vm` (VueComponent) 上，之后可以直接通过 this 获取

   获取组件名称：通过 `this.$options._componentTag` 

![](https://gitee.com/lilyn/pic/raw/master/js-img/provide%E6%BA%90%E7%A0%811.png)

## filter

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-2.html)



## watch

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-3.html)



## class style

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-4.html)



## Vue.observe

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-5.html)



## slot

> [案例链接](https://llwodexue.github.io/vue-node-mooc/src/ch4-6.html)



[https://iseeu.blog.csdn.net/article/details/105363274](https://iseeu.blog.csdn.net/article/details/105363274)

