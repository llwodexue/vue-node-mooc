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