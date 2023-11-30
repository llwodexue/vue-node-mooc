# 「多看读书」管理后台

## 上线地址

- 页面调试：[https://llwodexue.github.io/vue-node-mooc/](https://llwodexue.github.io/vue-node-mooc/)
- 上线页面：[http://182.92.10.187:9094/](http://182.92.10.187:9094/)

## 静态站点到OSS

[阿里云-云效](https://link.juejin.cn/?target=https%3A%2F%2Fwww.aliyun.com%2Fproduct%2Fyunxiao)，阿里云企业级一站式 DevOps，可以免费使用（会限制人数、流水线数量等，个人项目够用了）。相关文章 [CI 持续集成 - 阿里云云效](https://link.juejin.cn/?target=https%3A%2F%2Flearnku.com%2Farticles%2F13794%2Fci-continuous-integration-ali-cloud-effect)

OSS 是对象存储的意思，一般一个项目对应一个 Bucket (存储桶)，可以通过一个地址来访问里面的文件，配置成静态站点后，将自己的域名通过 CNAME 解析到该地址，项目就能访问了

CI/CD 一般需要找到流水线设置，常规前端项目自动化部署一般分为 4 个阶段

1. 添加流水线源
2. 测试
3. 构建上传
4. 部署

### 添加流水线源

Github、码云第一次弄需要先授权才会有服务连接



![image-20231130151625258](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130151625258.png)

### 测试

添加单元测试，这里我就不添加了

![image-20231130155325894](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130155325894.png)

### 构建

设置构建命令，构建生成文件目录，选择所需要的 Node 版本

![image-20231130152326643](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130152326643.png)

OSS 上传，第一次弄，需要先进入阿里云对象 OSS，创建 Bucket

![image-20231130152826801](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130152826801.png)

设置进行赋权操作，选择对应的 Bucket

![image-20231130152901155](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130152901155.png)

### 前端构建流水线

前端部署在 OSS 上即可，其优点：

1. 前后端部署服务位置分离，防止服务器被 ddos 攻击后，静态站点、接口服务全挂掉
2. OSS 访问速度很快，带宽不低

![image-20231130164729866](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130164729866.png)

## Node服务到云服务器

### 部署

选择主机部署

![image-20231130155258111](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130155258111.png)

第一次弄需要先点击新建主机组，我的是阿里云ECS

![image-20231130155539032](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130155539032.png)

选择对应的服务添加对应的主机，之后添加对应标签及内容

![image-20231130160026574](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130160026574.png)

修改对应署脚本

![image-20231130164934800](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130164934800.png)

```bash
# 持续集成
cd /home/template/vue-node-mooc/server/
echo "git pull"
git pull

# 查看最近一次提交 log
echo "git log -1"
git log -1 

pnpm install

echo 'server restart'
pm2 delete vue-read
pm2 start app.js -n vue-read
```

### 后端部署流水线

![image-20231130165027389](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231130165027389.png)
