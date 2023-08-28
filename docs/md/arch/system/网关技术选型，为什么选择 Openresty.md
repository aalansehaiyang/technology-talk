---
title: 网关技术选型，为什么选择 Openresty ？事件驱动、协程...
---

#  网关技术选型，为什么选择 Openresty ？事件驱动、协程...

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



互联网公司，不论体量大小如何，其内部的技术架构基本都是相似的，体现在以下几个方面：

* 数据量过大，如何定制化存储
* 访问量高了，如何集群化部署，流量负载均衡
* 响应速度慢了，如何提高处理速度，引入多级缓存
* 如果机器多了，如何保证某台服务器突然抽风，不影响业务集群的服务稳定性

麻雀虽小五脏俱全，今天要讲的网关，就是其中的关键一环，不论公司规模大小如何，基本都要有这个系统。

那么网关是干什么用的？

## 什么是网关

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-2.jpg" width="650px">
</div>

网关是连接客户端与服务端的中间桥梁，将很多`通用地`、`非业务逻辑`抽离，前置到网关系统，减少了很多重复性开发工作，是整个网站的唯一流量入口。

为了提高系统的扩展性，网关通常采用组件式架构，高内聚低耦合。

**常用的组件功能：**

* 黑名单拦截
* 日志
* 参数校验
* 鉴权
* 限流
* 负载均衡
* 路由转发
* 监控
* 灰度分流
* 多协议支持
* 熔断、降级、重试、数据聚合等

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-10.jpg" width="500px">
</div>

系统设计上一般采用`责任链`设计模式，定义好抽象接口，每个组件实现自己的专属功能，职责单一。并且根据不同的业务请求API，添加、删除一些节点，动态构建新的节点链，从而满足多样化的业务需求。

## 网关选型

1、Tomcat/Jetty+NIO+Servlet3

2、Nginx

3、Spring WebFlux

4、Soul

5、Spring cloud Gateway

6、Zuul

7、OpenResty

8、Kong

9、Netty 自建

各个框架的资料网上基本都有，考虑到篇幅限制，这里就不展开分析每个框架的优缺点（如果感兴趣，可以给我留言，人多的话我后面就单启一篇文章来讲一讲）。

**我们计划选型 OpenResty，主要有以下几个原因：**

* 能实现跨网络的gRPC请求转发，底层采用 HTTP/2 协议
* 支持 SSL/TLS 证书加密，通讯安全
* 性能方面，支持较高的并发请求
* 性能开销低，延迟少


## 翻牌 OpenResty

下图是 Netcraft 最新统计的 2021年10月 Web 服务器排行榜

> Netcraft 是一家总部位于英国巴斯始于 1995 年的互联网服务公司。 该公司官网每月发布的调研数据报告：Web Server Survey 系列 已成为当今人们了解全球网站的服务器市场份额

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-1.jpg" width="700px">
</div>

> 来源：https://news.netcraft.com/archives/2021/10/15/october-2021-web-server-survey.html

OpenResty 现在全球排名第三，由于将Nginx扩展成`动态服务器`，发展势头很猛。

我们常用的 12306 的余票查询功能，京东的商品详情页，这些高流量的背后，其实都是 OpenResty 在提供服务。

OpenResty 最擅长的是部署在流量入口处，处理各种高并发流量。

接下来，我们来深入了解下这个框架 


## OpenResty 诞生起因

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-4.jpg" width="600px">
</div>

> nginx 采用 master-worker 进程模型，分工明确，职责单一，也是其具备高性能的原因之一。

1、master 进程

管理进程，处理指令如：`-s reload`、`-s stop`，通过进程间通信，将管理指令发送给worker进程，从而实现对worker进程的控制。

2、worker 进程

工作进程，不断接收客户端的连接请求，处理请求。数量通常设置为与CPU核数一致，nginx也会将每个进程与每个CPU进行绑定，充分利用其多核特性。 

> 多个worker进程会竞争一个共享锁，只有抢到锁的进程才能处理客户端的请求。如果请求是accept事件，则会将其添加到accept队列中；如果是read或者write事件，则会将其添加到read-write队列。

**可能有人问，OpenResty 为什么要基于 Nginx 框架？**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-5.jpg" width="300px">
</div>

主要还是看重了 Nginx 的高并发能力，反向代理服务器通常流量很大，本身不涉及复杂计算，属于I/O密集型服务。Nginx 采用基于 epoll 机制的事件驱动，异步非阻塞，大大提高并发处理能力。

但是 Nginx 采用 `C 语言` 开发，二次开发门槛较高。市场应用广泛，更多是基于 `nginx.conf` 预留配置参数，如：反向代理、负载均衡、静态web服务器，等

如果想让Nginx访问 MySQL ，定制化开发一些业务逻辑，难度很高。OpenResty 通过 嫁接方式，将 Nginx 和 Lua 脚本相结合，既保留 Nginx 高并发优势，也拥有脚本语言的开发效率，也大大降低了开发门槛。

Lua 是最快的、动态脚本语言，接近C语言运行速度。LuaJIT 将一些常用的lua函数和工具库预编译并缓存，下次调用时直接使用缓存的字节码，速度很快。

另外，Lua支持协程，这个很重要。

> **协程是用户态的操作，上下文切换不用涉及内核态，系统资源开销小；另外协程占用内存很小，初始 2KB**


## OpenResty 核心架构

OpenResty是一个基于Nginx的Web平台，内部嵌入`LuaJIT`虚拟机运行Lua脚本。使用 Lua 编程语言对 Nginx 核心以及各种 Nginx C 模块进行脚本编程。

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-3.jpg" width="650px">
</div>

* 每接到一个客户端请求，通过抢占锁，由一个worker进程来跟进处理
* worker内部会创建一个lua协程，绑定请求，也就是说一个请求对应一个lua协程
* lua协程将请求通过网络发出，并添加一个event事件到nginx。然后，当前协程就处于 `yield`，让出CPU控制权
* 当服务端响应数据后，网络流程会创建一个新的event事件，将之前的协程唤醒，将结果返回。

> 注意：不同的lua协程之间数据隔离，从而保证了不同的客户端请求不会相互影响。另外，一个worker中同一时刻，只会有一个协程在运行。


<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-7.jpg" width="650px">
</div>

cosocket 将 Lua 协程 + Nginx 事件通知两个重要特性组合。

cosocket 是 OpenResty 世界中技术、实用价值最高部分。让我们可以用非常低廉的成本，优雅的姿势，比传统 socket 编程效率高好几倍的方式进行网络编程。无论资源占用、执行效率、并发能力都非常出色。

**为了方便开发，OpenResty 将一个 HTTP 请求划分为11个阶段，每个阶段有自己的专属职责。**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-6.jpg" width="650px">
</div>

**函数功能说明：**

* set_by_lua，用于设置变量
* rewrite_by_lua，用于转发、重定向等
* access_by_lua，用于准入、权限等
* content_by_lua，用于生成返回内容
* balancer_by_lua，负载均衡，路由转发
* header_filter_by_lua，用于响应头过滤处理
* body_filter_by_lua，用于响应体过滤处理
* log_by_lua，日志记录

OpenResty 提供了大量的 Lua API 接口，用于操作 Nginx 。只要熟悉lua语法，同时对 Nginx 的运行流程有较清楚理解，那么就可以轻松的在nginx上做二次开发。

无论是作为应用网关，还是高性能的web应用，支持连接各种丰富的后端存储，如：MySQL、Redis、Memcache、PostgreSQL 等，周边生态非常丰富。

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-8.jpg" width="260px">
</div>

> https://github.com/openresty/lua-nginx-module/#accessbylua
 
**注意：OpenResty 的 API 有使用范围限制，每个 API 都有与之对应的使用阶段列表，如果你超范围使用就会报错。**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/1-9.jpg" width="650px">
</div>



## 部署安装

本文以 CentOS 系统中为例

1、添加 openresty 仓库，这样以后可以通过 `yum updata ` 命令安装或更新我们的软件包

```
yum install yum-utils -y
yum-config-manager --add-repo https://openresty.org/package/centos/openresty.repo
```

2、安装软件

```
yum install openresty -y
```

3、安装命令行工具 resty

```
yum install openresty-resty -y
```


## 项目实战

1、修改nginx.conf配置文件

```
worker_processes  auto;
worker_rlimit_nofile 1000000;
events {
    use epoll;
    worker_connections  150000;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $content_length $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" "$upstream_response_time" "$request_time"';

    access_log  logs/access.log  main;
    
    server {
        listen 8080;
        location / {
            access_by_lua_block {
                local headers = ngx.req.get_headers(0)
                local trace_id= headers["X-Trace-Id"]
                ngx.log(ngx.ERR, trace_id)
            }
            #  ngx.say("<p>hello !</p>")
            proxy_pass http://168.12.8.10:8080;
        }
    }

    server {
        listen 8082;
        location / {
            default_type text/html;
            content_by_lua_block {
                ngx.say("<p>Hello Openresty!</p>")
            }
        }
    }
}
```

nginx.conf 内部分为三层嵌套：

* 最外层的http，表示处理 HTTP 协议
* http 内部 的 server 监听端口，会启动一个 LuaJIT 虚拟机，执行lua代码
* 同一个端口内部，区分不同的业务功能，采用 location 配置，通过不同的 path 路径，处理不同的业务逻辑。

2、添加环境变量

```
echo "export PATH=$PATH:/usr/local/openresty/nginx/sbin" >> /etc/profile
source /etc/profile
```

3、启动 openresty，启动命令和nginx一致

```
nginx -c /usr/local/openresty/nginx/conf/nginx.conf
```

4、访问 Web 服务

```
curl http://localhost:8082/
```

如果正常，浏览器页面会输出 Hello Openresty!

5、如果 nginx.conf 配置项做了修改，我们可以重新启动 

```
nginx  -s reload
```


## 参考资料

* [高性能网关设计实践](https://mp.weixin.qq.com/s/pSCtObwfr24Qv5RlKdiVZw)
* [如何设计一个高性能网关](https://mp.weixin.qq.com/s/xLpkHAden0qDEaAuqmn9dg)
* [浅谈微服务中的 API 网关（API Gateway）](https://zhuanlan.zhihu.com/p/31786017)
* [第三百五十四讲|一节课搞懂 API 网关 openresty 的实现原理|要想微服务就要先搞定RPC](https://www.bilibili.com/video/BV1ag411L7Qb?from=search&seid=14872072928161487010&spm_id_from=333.337.0.0)
* [百亿规模API网关服务Shepherd的设计与实现](https://tech.meituan.com/2021/05/20/shepherd-api-gateway.html)
* [nginx master-worker进程工作原理](https://zhuanlan.zhihu.com/p/96757160)
* [怎样理解 cosocket](https://moonbingbing.gitbooks.io/openresty-best-practices/content/ngx_lua/whats_cosocket.html)
* [主流的微服务API网关性能比较](https://www.jianshu.com/p/3884cbd694b6)
* [微服务五种开源API网关实现组件对比](http://dockone.io/article/8729)
* [OpenResty 中的 Nginx 基础知识](https://blog.crazytaxii.com/posts/openresty_nginx_basic/)
* [CentOS安装OpenResty(Nginx+Lua)开发环境](https://www.cnblogs.com/wushuaishuai/p/9315611.html)
