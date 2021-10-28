## 项目搭建

```bash
git clone https://github.com/PanJiaChen/vue-element-admin
cd vue-element-admin
cnpm i
npm run dev
```

删除 `src/views` 下的源码，保留如下几个文件夹：

- dashboard：首页
- error-page：异常页面
- login：登录
- redirect：重定向

对 `src/router/index` 进行相应修改

- 删除 `Router Modules` 下面的 4 条 import
- 删除路由（只保留重定向到 404 即可）

删除 `src/router/modules` 文件夹

删除 `src/vendor` 文件夹

> 如果是线上项目，建议把 components 的内容也进行清理，以免影响访问速度，或直接使用 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 构建项目，不过 vue-element-admin 实现了登录模块，包括 token 校验、网络请求等

## 项目配置

通过 `src/settings.js` 进行全局配置

- title：站点标题，进入某个页面后，格式为 `页面标题 - 站点标题`

  修改 `settings.js` 的 `title: 'xxx'`

  修改 `utils/get-page-title.js` 的 `const title = defaultSettings.title || 'xxx'`

- showSettings：是否显示右侧悬浮配置按钮

- tagView：是否显示页面标签功能条

- fixedHeader：是否将头部布局固定

- sidebarLogo：菜单栏中是否显示 LOGO

- errorLog：默认显示错误日志的环境

修改 `vue.config.js` （针对源码调试）

- 将 `cheap-source-map` 改为 `source-map`，如果希望提高构建速度可以改为 `eval`

```js
config
  // https://webpack.js.org/configuration/devtool/#development
  .when(process.env.NODE_ENV === 'development',
    config => config.devtool('cheap-source-map')
  )
```

我一般会使用 `eval-source-map`，可以写在 `configureWebpack` 中

```js
configureWebpack: {
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
},
```

对这里不太理解的可以看我的这篇文章 [Webpack（优化和问题）](https://blog.csdn.net/qq_38689395/article/details/117999184) 看 `Webpack 优化配置` 中的 `source-map`

## 项目结构

```js
|-- build                         // 项目打包配置项
|-- mock                          // 项目模拟接口数据
|-- node_modules                  // 项目依赖包
|-- public                        // 项目公共文件
|    |-- index.html               // 项目入口
|-- src                           // 项目根目录
|    |-- api                      // 接口请求
|    |-- assets                   // 静态资源
|    |-- components               // 通用组件（通常不包含业务组件）
|         |-- Pagination.vue      // 分页组件
|    |-- directive                // 自定义指令
|         |-- permission.js       // 权限控制指令
|    |-- filters                  // 自定义过滤器
|    |-- icons                    // 图标组件svg 
|    |-- layout                   // 布局组件（全局框架，也可能放在components里）
|    |-- router                   // 路由配置
|    |-- mixins                   // 混入组件
|    |-- styles                   // 公共样式scss
|    |-- utils                    // 通用工具库
|         |-- auth.js             // token存取
|         |-- permission.js       // 权限检查
|         |-- get-page-title.js   // 获取页面标题
|         |-- request.js          // axios请求封装
|         |-- index.js            // 工具方法
|    |-- views                    // 业务组件和页面
|    |-- App.vue                  // 全局入口组件
|    |-- main.js                  // 全局入口文件
|    |-- permission.js            // 权限校验
|    |-- settings.js              // 全局配置参数
|-- env.development               // 开发环境配置
|-- env.production                // 生产环境配置
|-- env.staging                   // 预发布环境
|-- package.json                  // 项目所需要各种模块及项目的配置信息
|-- vue.config.js                 // vue配置文件
```

