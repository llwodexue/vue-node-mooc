

## Node

> 查看 [node](https://github.com/nodejs/node) 源码
>
> Node 基础可以查看我这篇文章：[Node 学习](https://blog.csdn.net/qq_38689395/article/details/105398781)

Node 是一个基于 V8 引擎的 Javascript 运行环境，它使得 Javascript 可以运行在服务端，直接与操作系统进行交互，与文件控制、网络交互、进程控制等

### 运行、调试 Node

- bash 运行

  ```bash
  node app.js
  ```

- Nodemon 自动重启

  监视代码修改，自动重启

  ```bash
  npm i nodemon -g
  
  nodemon app.js
  ```

- VSCode 调试 debug

### 事件循环

详细可以查看我这篇文章：[Node 事件循环及多线程](https://blog.csdn.net/qq_38689395/article/details/120995319)

在 `JavaScript` 中，任务被分为两种，一种宏任务（`MacroTask`）也叫 `Task`，一种叫微任务（`MicroTask`）

- 宏任务

|                         | 浏览器 | Node |
| ----------------------- | ------ | ---- |
| `I/O`                   | ✔️      | ✔️    |
| `setTimeout`            | ✔️      | ✔️    |
| `setInterval`           | ✔️      | ✔️    |
| `setImmediate`          | ❌      | ✔️    |
| `requestAnimationFrame` | ✔️      | ❌    |

- 微任务

|                                                              | 浏览器 | Node |
| ------------------------------------------------------------ | ------ | ---- |
| `process.nextTick`                                           | ❌      | ✔️    |
| [`MutationObserver`](http://javascript.ruanyifeng.com/dom/mutationobserver.html) | ✔️      | ❌    |
| `Promise.then catch finally`                                 | ✔️      | ✔️    |

主线程从任务队列中读取事件，这个过程是循环不断的，这种整个运行机制又称为 `Event Loop` （事件循环）

- 浏览器中的 Event Loop

  执行栈在执行完 **同步任务** 后，查看 **执行栈** 是否为空，如果 **执行栈** 为空，就回去检查 **微任务** 队列是否为空，如果为空的话，就会执行 **宏任务**，否则就一次性执行完所有 **微任务**

  ![](https://gitee.com/lilyn/pic/raw/master/js-img/%E6%B5%8F%E8%A7%88%E5%99%A8EventLoop.gif)

- Node 中的 Event Loop

  Node 的 Event Loop 是基于 `libuv` 实现的，`libuv` 使用异步、事件驱动的编程方法，核心是提供 `I/O` 的事件循环和异步回调

  ![](https://gitee.com/lilyn/pic/raw/master/js-img/NodeEventLoop.png)

Node 的 Event Loop 一共分为 6 个阶段：

1. **timers（定时器）**：此阶段执行那些由 `setTimeout()` 和 `setInterval()` 调度的回调函数

2. **pending callbacks**：执行 I/O 回调，此阶段执行几乎所有的回调函数，除了 **close callbacks（关闭回调）** 和那些由 **timers** 与 `setImmediate()` 调度的回调

   `setImmediate() ≈ setTimeout(cb, 0)`

3. idle（空转），prepare：此阶段只在内部使用

4. **poll（轮询）**：检索新的 I/O 事件，在恰当的时候 Node 会阻塞这个阶段

5. check（检查）：`setImmediate()` 设置的回调会在这个阶段被调用

6. close callbacks（关闭事件的回调）：诸如：`http.server.on('close', [fn])`、`socket,on('close', [fn])`，此类的回调会在此阶段被调用

**poll 阶段**

如果 Event Loop 进入了 **poll** 阶段，且代码未设定 `timer`，将会发生下面情况：

- 如果 `poll` 队列不为空，则 Event Loop 将 **同步执行** `callback` 队列，直至队列为空或者达到系统上限
- 如果 `poll` 队列为空，将会发生下面情况：
  - 如果有 `setImmediate()` 回调需要执行， Event Loop 会立即停止执行 **poll** 阶段并执行 **check** 阶段，然后执行回调
  - 如果没有 `setImmediate()` 回调需要执行，Event Loop 将阻塞在 **poll** 阶段，等待 `callback` 被添加到任务队列中，然后执行

如果 Event Loop 进入了 **poll** 阶段，且代码设定了 `timer`：

- 如果 `poll` 队列为空，则 Event Loop 将检查 `timer` 是否超时，如果有的话会回到 **timers** 阶段执行回调

![](https://gitee.com/lilyn/pic/raw/master/js-img/NodeEvent6.png)

**process.nextTick() 不在 Event Loop 的任何阶段执行，而是在各个阶段切换的中间执行**，即从一个阶段切换到下个阶段前执行

**不同版本 Node**

- 浏览器只要执行了一个宏任务就会执行微任务队列
- Node 10(11以下) 中只有全部执行了 **timers** 阶段队列的全部任务才执行微任务队列
- Node 11 在 **timers** 阶段的 `setTimeout()`、`setInterval()` 和在 **check** 阶段的 `setImmediate()` 修改为一旦执行一个阶段里的一个任务就会执行微任务队列

## Express

> 查看 [express](https://github.com/expressjs/express) 源码
>
> Express 基础可以查看我这篇文章：[Node 学习](https://blog.csdn.net/qq_38689395/article/details/105398781)

Express 是一个轻量级的 Node Web 服务端框架，可以帮助我们快速搭建基于 Node 的 Web 应用

- 创建项目

```bash
mkdir admin-imooc-node
cd admin-imooc-node/
npm init -y
```

- 使用 WebStrom 如果 `const express = require('express')` 下面有波浪线

  在 Settings 里搜 `node`，勾选 `Coding assistance for Node.js`

  使用 VSCode 跳过这一步

## Express 三大概念

### 中间件

中间件，把很复杂的事情分割成单个，然后依次有条理的执行，在请求和响应周期中被顺序调用

- 目的：提高代码灵活性、动态可扩展性

中间件的本质就是一个请求处理方法，该方法需要接收三个参数：

- request 请求对象

- response 响应对象

- next 下一个中间件

  如果请求进入中间件之后，没有调用 next 则代码会停在中间件（类似迭代器）

  如果调用了 next 则继续向后查找第一个匹配的中间件

```js
function myLogger(req, res, next) {
  console.log('myLogger')
  next()
}

app.use(myLogger)
```

**注意：** 中间件需要在响应结束前被调用，绝大多数实在响应结束前被调用

### 路由

路由：应用如何响应请求的一种规则

- 当你以 get 方法请求的时候，执行对应的处理函数

```js
app.get('/', (req, res) => {
  console.log(req.query)
  res.send('hello get')
})
```

- 当你以 post 方法请求的时候，执行对应的处理函数

```js
app.post('/', (req, res) => {
  res.send('hello post')
})
```

规则主要分两部分：

- 请求方法：`get`、`post`...
- 请求路径：`/`、`/user`、`/.*fly$/`...

### 异常处理

异常处理：通过自定义异常处理中间件处理请求中产生的异常

**错误处理中间件需要注意：**

1. 参数一个都不能少，否则会视为普通的中间件 `err, req, res, next`
2. 错误处理中间件需要在请求之后引用

```js
app.get('/', (req, res) => {
  throw new Error('error...')
})

function errorHandler(err, req, res, next) {
  console.log(err)
  res.status(500).json({
    error: -1,
    msg: err.toString(),
  })
}

app.use(errorHandler)
```

## 项目架构搭建

安装 boom 依赖（帮我们生成异常信息）：

- [npm boom](https://www.npmjs.com/package/boom)

```bash
npm i boom
```

### 路由

错误处理中间件打印的 err 对象：

err 对象

- message：'接口不存在'
- output
  - payload
    - error：'Not Found'
    - message：'接口不存在'
    - statusCode：404
  - statusCode：404

![](https://gitee.com/lilyn/pic/raw/master/js-img/debugger-err.png)

创建 `router.index.js`

```js
const express = require('express')
const boom = require('boom')
const userRouter = require('./user')
const { CODE_ERROR } = require('../utils/constant')

// 注册路由
const router = express.Router()

router.get('/', (req, res) => {
  res.send('welcome imooc admin')
})

router.use('/user', userRouter)

/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
  const msg = (err && err.message) || '系统错误'
  const statusCode = (err && err.output.statusCode) || 500;
  const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
  res.status(statusCode).json({
    code: CODE_ERROR,
    msg,
    error: statusCode,
    errorMsg
  })
})

module.exports = router
```

创建 `router.user.js`

```js
const express = require('express')

const router = express.Router()

router.get('/info', (req, res, next) => {
  res.json('user info...')
})

module.exports = router
```

### main

修改 `app.js` 为

```js
const express = require('express')
const router = require('./router')

const app = express()

app.use('/', router)

const server = app.listen(3003, () => {
  const { port } = server.address()
  console.log('running on http://127.0.0.1:%s', port)
})
```

创建 `utils/constant.js`

```js
module.exports = {
  CODE_ERROR: -1,
}
```

