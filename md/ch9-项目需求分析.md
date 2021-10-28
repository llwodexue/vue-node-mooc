## 项目技术架构

### 三个应用

- 小慕读书管理后台（管理电子书）

  黄色的部分表示在服务端完成，绿色部分表示在前端完成

- 小慕读书小程序（查阅电子书）

- 小慕读书 H5（提供阅读器）

![](https://gitee.com/lilyn/pic/raw/master/js-img/imoocReader%E8%B7%AF%E7%BA%BF.jpg)

### 项目目标

- 完全在本地搭建开发环境
- 贴近企业真实应用场景

> 依赖别人提供的 API 将无法真正理解项目的运作逻辑

## 技术难点分析

### 登录

- 用户名密码校验
- token 生成、检验和路由过滤
- 前端 token 校验和重定向

### 电子书上传

- 文件上传
- 静态资源服务器

### 电子书解析

- epub 原理
- zip 解压
- xml 解析

### 电子书增删改

- MySQL 数据库应用
- 前后端异常处理

## ePub 电子书

- ePub(Electronic Publication)电子出版物

  它的本质是一个 zip 压缩包

- mobi 是 Amazon Kindle 的电子书格式

找到一本 `.epub` 后缀名的电子书（如果没有可以去我的 [GitHub epub](https://github.com/llwodexue/vue-node-mooc/tree/main/epub) 这里下载，这里我解压了 `西西弗的神话` 这本书，可以直接去看）

- `META-INF/container.xml`：容器信息，主要用于告诉阅读器电子书的根文件（rootfile）的路径 `full-path` 和打开格式 `media-type`
- `content.opf`：opf 文档是 epub 的核心文件，且是一个标准的 xml 文件
- `mimetype`（资源类型）：`application/epub+zip`
- `text`：电子书文字内容、`images`：电子书配图
- `cover.jpeg`：电子书封面
- `page_styles.css`：电子书的样式
- `toc.ncx`：目录文件（xml 格式）

