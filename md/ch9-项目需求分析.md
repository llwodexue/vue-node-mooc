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

找到一本 `.epub` 后缀名的电子书（如果没有可以去我的 [GitHub epub](https://github.com/llwodexue/vue-node-mooc/tree/main/epub) 这里下载，这里我解压了 `从0到1` 这本书，可以直接去看）可以直接解压，也可以修改为 `.zip` 后缀解压

- `META-INF/container.xml`：容器信息，主要用于告诉阅读器电子书的根文件（rootfile）的路径 `full-path`
- `content.opf`：opf 文档是 epub 的核心文件，且是一个标准的 xml 文件
- `mimetype` ：`application/epub+zip`（资源类型）
- `text`：电子书文字内容、`images`：电子书配图
- `cover.jpeg`：电子书封面
- `toc.ncx`：目录文件（xml 格式）

`content.opf` ，是 epub 的核心文件，其内容主要由五部分组成：

> 参考：[epub文件格式介绍](https://www.jianshu.com/p/d2edab6750df)
>
> 扩展：[epub直接获取书名及书封面](https://blog.csdn.net/qq_35323561/article/details/82771376)

1. `metadata` ：元数据信息

2. `manifest` ：文件列表，列出书籍初版的所有文件

   `id`：文件的id号、`href`：文件的相对路径、`media-type`：文件的媒体类型

3. `spine` ：脊骨，其主要功能时提供书籍的线性阅读次序

   `idref` ：参照 `manifest` 列出的 `id`

   `spine toc="ncx"` ：在电子书中还会包括一个 `toc.ncx`，这个文件就是电子书的目录文件

4. `guide` ：指南，一次列出电子书的特定页面，例如封面、目录、序言等，属性值指向文件保存地址，epub 电子书可以不用该元素

5. `tour` ：导读，可以根据不同的读者水平或阅读目的，按一定的次序，选择电子书中的部分页面组成导读。epub 电子书可以不用该元素

```xml
<package>
  <metadata>
    <dc:title>从0到1:开启商业与未来的秘密</dc:title>
  </metadata>
  <manifest>
    <item href="text/part0000_split_000.html" id="id602" media-type="application/xhtml+xml"/>
    <item href="titlepage.xhtml" id="titlepage" media-type="application/xhtml+xml"/>
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="titlepage"/>
    <itemref idref="id602"/>
  </spine>
  <guide>
    <reference href="text/part0001.html" title="titlepage" type="text"/>
    <reference href="titlepage.xhtml" title="Cover" type="cover"/>
    <reference href="text/part0002.html" title="目录" type="toc"/>
  </guide>
</package>
```

## Nginx 服务器搭建

> [Nginx 配置详解 菜鸟教程](https://www.runoob.com/w3cnote/nginx-setup-intro.html)

### 安装 nginx

- Windows 安装，参考：[windows下安装nginx](https://www.cnblogs.com/qfb620/p/5508468.html)
- Mac 通过 brew 安装，参考：[Mac上搭建nginx教程](https://www.jianshu.com/p/c3294887c6b6)

Windows 在 [Nginx 官网](http://nginx.org/en/download.html) 下载安装包

- 解压压缩包，在地址栏输入 CMD 进入 Nginx 目录输入：`start nginx.exe`

**解决 macOS operation not permitted 问题**

macOS 从 El Capitan（10.11）后加入了 Rootless 机制，很多系统目录不再能够随心所欲的读写了，即使设置 root 权限也不行，解决方法：

重启按住 Command+R，进入恢复模式，打开 Terminal：

```bash
csrutil disable
```

之后再次进入系统就可以获得修改 /usr 的写入权限了，打开 csrutil 方法是进入恢复模式，在 Terminal 中：

```bash
csrutil enable
```

### 修改配置文件

打开配置文件 `nginx.conf`

- windows 位于安装目录下
- macOS 位于：`/usr/local/etc/nginx/nginx.conf`

对其进行修改

1. 添加当前登录用户 `li`，注意：需要在结尾添加 `;`，不然会报 `[emerg] invalid number of arguments in "user" directive`

   ```nginx
   user li owner;
   ```

2. 在结尾大括号之前添加，注意：需要把 `\` 改为 `/`，否则会出现配置错误启动出现 500 异常

   ```nginx
   include E:/upload/upload.conf;
   ```

3. 在对应目录 `E:` 下创建 upload 文件夹对应的是资源文件路径，在这个文件夹下创建 `upload.conf` 对应的是额外配置文件，当然也可以把配置文件的内容添加到 `nginx.conf` 中

   ```nginx
   server
   { 
     charset utf-8;                                        # 字符编码
     listen 8089;                                          # 端口
     server_name http_host;
     root E:/upload;                                       # 资源文件路径
     autoindex on;											# 自动打开索引
     add_header Cache-Control "no-cache, must-revalidate";	# 客户端缓存设置
     location / { 											# 对所有路由生效的配置
       add_header Access-Control-Allow-Origin *;			# 防止跨域（生产环境需改为实际域名）
     }
   }
   ```

   如果需要加入 https 服务，可以再添加一个 server：

   ```nginx
   server
   {
     listen 4430 default ssl;
     server_name https_host;
     root E:/upload;
     autoindex on;
     add_header Cache-Control "no-cache, must-revalidate";
     location / {
       add_header Access-Control-Allow-Origin *;
     }
     ssl_certificate E:/upload/https/book.llmysnow.top.pem;                  # 证书存放位置 
     ssl_certificate_key E:/upload/https/book.llmysnow.top.key;              # 秘钥存放位置
     ssl_session_timeout  5m;                                                # 重用会话缓存中的SSL过期时间
     ssl_protocols  SSLv3 TLSv1;                                             # 启用特定的加密协议
     ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP; # 密码加密方式
     ssl_prefer_server_ciphers  on;                                          # 配置优先使用服务端的加密套件
   }
   ```

4. 修改 hosts 文件

   hosts 目录：`C:\Windows\System32\drivers\etc\hosts`

   最下面添加 `127.0.0.1 book.llmysnow.top`

### 启动服务

切换到 Nginx 目录：

```bash
d:
cd D:\Develop\nginx-1.18.0
```

- 启动 Nginx 服务

```bash
start nginx            # windows
sudo nginx             # mac
```

- 重启 Nginx 服务：

```bash
nginx -s reload        # windows
sudo nginx -s reload   # mac
```

- 停止 Nginx 服务（快速停止）

```bash
nginx -s stop          # windows
sudo nginx -s stop     # mac
```

- 退出 Nginx 服务（完整有序停止）

  `taskkill /f /t /im nginx.exe` 强制结束它的进程和启用它的子进程

```bash
nginx -s quit          # windows
sudo nginx -s quit     # mac
```

- 检查配置文件是否存在语法错误

  `nginx: [warn] "user" is not supported` nginx v1.18.0 版本中已经启用，注释掉 `user li owner` 即可

```bash
nginx -t               # windows
sudo nginx -t          # mac
```

检查 80 端口是否被占用：

```bash
netstat -ano | findstr 0.0.0.0:80
# 或
netstat -ano | findstr "80"
# 查看对应任务pid后可以查看具体是什么任务
tasklist | findstr 10200 # 对应pid
# 强制退出对应pid进程
taskkill /pid 10200 -t
```

访问地址：

- http: `http://localhost:8089`
- https: `https://localhost`

### 阿里云 https 证书

- 下载证书，选择 Nginx

![](https://gitee.com/lilyn/pic/raw/master/js-img/SSL%E8%AF%81%E4%B9%A6%E4%B8%8B%E8%BD%BD.png)

解压到相应目录：

- https 证书：`E:/upload/https/book.llmysnow.top.pem`
- https 私钥：`E:/upload/https/book.llmysnow.top.key`

## MySQL 数据库搭建

### 数据库安装

> Windows MySQL安装参考：[windows版mysql8.0安装详解](https://blog.csdn.net/ycxzuoxin/article/details/80908447)
>
> Mac MySQL安装参考：[mac安装mysql8](https://blog.csdn.net/qq_25628891/article/details/88431942)

MySQL下载：[MySQL 官网](https://dev.mysql.com/downloads/mysql/)

- 下载时记得点击：`No thanks, just start my download.`

![](https://gitee.com/lilyn/pic/raw/master/js-img/mysql%E4%B8%8B%E8%BD%BD.png)

挪动到指定位置解压，之后配置环境变量（我的电脑 —— 属性 —— 环境变量）

- 创建系统变量 `MYSQL_HOME`，变量值为 MySQL 文件解压的路径
- 在系统变量 Path 中新建一条 `%MYSQL_HOME%\bin`

![](https://gitee.com/lilyn/pic/raw/master/js-img/mysql%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.png)

在解压目录创建一个 `my.ini` 文件，填下如下内容（记得修改安装目录和 data 存放目录）

```bash
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=D:\\Develop\mysql-8.0.27-winx64
# 设置mysql数据库的数据的存放目录
datadir=D:\\Develop\mysql-8.0.27-winx64\Data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数（防止有人攻击数据库系统）
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```

以管理员身份打开 CMD

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E7%AE%A1%E7%90%86%E5%91%98%E8%BA%AB%E4%BB%BD%E6%89%93%E5%BC%80CMD.png)

切换到 MySQL 文件目录

```bash
cd D:\Develop\mysql-8.0.27-winx64
d:
```

初始化 MySQL，并把这个密码进行复制

- 如果没有复制，误把 CMD 关闭，需要把 MySQL 目录下的 Data 文件夹删掉，再初始化一次

```bash
mysqld --initialize --console
```

![](https://gitee.com/lilyn/pic/raw/master/js-img/mysql%E5%AF%86%E7%A0%81.png)

开始安装 MySQL 服务，并设定服务名，这里设定为 mysql8

```bash
mysqld install mysql8
```

启动服务

- 如果出现 `mysql8 服务无法启动。 服务没有报告任何错误。` 没有启动成功
- 输入 `mysqlid --console` 查看 `ERROR` 报错信息，如果出现 `[Server] Can't start server: Bind on TCP/IP port: 通常每个套接字地址( 议/网络地址/端口)只允许使用一次` ，即 3306 端口被占，修改 `my.ini` 下的端口为 3008 即可

```bash
net start mysql8
```

因为我电脑里安装了多个 MySQL，所以我需要指定端口连接

```bash
mysql -P 3308 -u root -p
```

修改密码，把新密码修改为你想设置的密码

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
```

输入 quit 退出登录

```sql
quit
```

查看用户信息

```sql
select user,host,authentication_string from mysql.user;
```

![](https://gitee.com/lilyn/pic/raw/master/js-img/mysql%E6%9F%A5%E7%9C%8B%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF.png)

可以看到此时数据库 root 用户仅限 localhost 登录访问。如果要允许开放其他 IP 登录，则需要添加新的 host。如果允许所有 IP 访问，可以直接修改成 `%`

- `flush privileges;` 本质试讲当前 user 和 privilige 表中的用户信息/权限从 MySQL 数据库中提取到内存里

```sql
use mysql;
update user set host='%' where user='root';
flush privileges;
```

> MySQL 8.0 引入了新特性 `caching_sha2_password` ，这种密码加密方式客户端不支持，客户端支持的是 `mysql_native_password` 这种加密方式
>
> 可以使用 `select host,user,plugin from user;` 查看 root 的 plugin
>
> 如果不是，可以使用 `update user set plugin='mysql_native_password' where user='root';` 修改为 `mysql_native_password` 加密模式

### 数据库基础

可以参考我这篇文章：[MySQL 学习](https://blog.csdn.net/qq_38689395/article/details/116538774)

### 创建数据库并导入数据

- 创建数据库 `book`
- 字符集`utf8 -- UTF-8 Unicode`
- 排序规则`utf8_general_ci`

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E6%96%B0%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93mysql.png)

- 下载 `book.sql`：
  [https://www.youbaobao.xyz/resource/admin/book.sql](https://www.youbaobao.xyz/resource/admin/book.sql)

- 执行 `book.sql` 导入数据

  ![](https://gitee.com/lilyn/pic/raw/master/js-img/%E8%BF%90%E8%A1%8Csql%E6%96%87%E4%BB%B6mysql.png)

- 点击 book 下的表，右击刷新即可

