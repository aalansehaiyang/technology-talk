---
title: OpenResty 实现限流
---

#  OpenResty 实现限流

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



目前限流的解决方案有很多，从分布式角度来看，限流可分为分布式限流（比如基于Sentinel或者 Redis的集群限流）和单机限流。

从算法实现角度来看，限流算法可分为`计数器算法`、`滑动时间窗口算法`、`漏桶算法`、`令牌桶算法`

`本文主要介绍如何在Nginx中增加流控功能，原因是考虑到nginx的广泛使用且基于流量的入口位置，越早拦截对后面系统的压力越小。`

首先，我们先来了解下nginx，它是一款轻量级的Web服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。

**Nginx可以做的事情很多，归纳起来主要有四块：**

1、反向代理

> 接收Internet上的请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给Internet上请求连接的客户端

2、负载均衡

> 将大量的用户请求按照一定的负载策略分摊转发给内部的服务器。负载均衡策略有：轮询（默认）、weight、ip_hash、fair（第三方）、url_hash（第三方）

3、HTTP服务器

> Nginx本身是一个静态资源的服务器，对静态资源缓存，提升性能。也可以实行动静分离，将动态请求转发给后台服务器。

4、正向代理

> 为了安全限制，有些内部服务器不允许直接访问外网，需要将请求转发到代理机，再由代理机访问internet。


**那么，Nginx 如何做到高并发下的高效处理？**

`现在的软件系统一般采用微服务架构，跨服务器请求产生了大量的网络IO，而IO等待严重影响系统吞吐量`

Nginx采用异步事件驱动的方法来处理请求，Linux的epoll模型基于事件驱动机制，它可以监控多个事件是否准备就绪，如果OK，那么放入epoll队列中，这个过程是异步的。worker只需要从epoll队列循环处理即可。官方测试结果，单台能够支持五万个并行连接。

`Nginx采用模块化设计，扩展性好，但由于采用C语言，涉及大量的通信协议，开发环境复杂，门槛较高。有没有一种方式，通过简单的脚本语言就可以实现各种定制化功能，并能方便的集成到 Nginx中，OpenResty 是个不错选择，接下来，我们来了解下这个框架`
 

##  首先，了解下OpenResty

OpenResty 是一个基于 Nginx 与 Lua 的高性能 Web 服务器，其内部集成了大量 Lua 库、第三方模块以及大多数的依赖项。方便搭建支持高并发、高扩展性的动态 Web 服务和网关。

包含 Nginx、ngx_lua、LuaJIT 2.0/2.1 (或者可选的标准 Lua 5.1解释器)，还包含很多强劲、好用的 Nginx 模块。

> OpenResty 使用 Lua 编程语言对 Nginx 核心以及各种 Nginx C 模块进行脚本编程，可以处理一万以上并发请求。选择OpenResty，既拥有脚本语言的开发效率，以及 Nginx 高并发优势。

OpenResty 现在是全球排名第三的 Web 服务器，由于将Nginx扩展成动态服务器，发展势头很猛。我们经常用到的 12306 的余票查询功能，或者是京东的商品详情页，这些高流量的背后，其实都是 OpenResty 在默默地提供服务。OpenResty 最擅长的是部署在流量入口处，处理各种高并发流量。

<div align="left">
    <img src="https://offercome.cn/images/arch/system/7-5.jpg" width="650px">
</div>


##  应用场景

* 在请求真正到达下游服务之前，Lua 可以随心所欲的做复杂访问控制和安全检测
* 从外部存储服务（比如 redis, memcached, mysql, postgresql）中获取后端信息，并用这些信息来实时选择哪一个后端来完成业务访问
* 在内容 handler 中随意编写复杂的 web 应用，使用同步非阻塞的方式，访问后端数据库和其他存储
* 在 rewrite 阶段，通过 Lua 完成非常复杂的 URL dispatch
* 用 Lua 可以为 Nginx 子请求和任意 location，实现高级缓存机制

> Nginx采用原生C语言开发的，通过`nginx-lua-module` 借助nginx开放的api，实现 Nginx 的各种功能自由拼接、业务定制化。Lua语言，大大降低了开发门槛。


##  如何二次开发

我们编写的Lua脚本代码均包含在指令函数中，指令函数有严格的执行顺序。当接收请求时，通过指令函数对 `request ` 、 `response`做二次干预处理，从而实现个性化业务。

**指令函数的执行顺序：**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/7-1.jpg" width="650px">
</div>

函数功能说明：

```
set_by_lua，用于设置变量
rewrite_by_lua，用于转发、重定向等
access_by_lua，用于准入、权限等
content_by_lua，用于生成返回内容
header_filter_by_lua，用于响应头过滤处理
body_filter_by_lua，用于响应体过滤处理
log_by_lua，用于日志记录
```

> 注意：OpenResty 的 API 有范围限制，每一个 API 都有一个与之对应的使用阶段列表，如果你超范围使用就会报错。


##  限流实战

OpenResty 官方提供了封装好的 lua函数，方便我们开箱即用。支持一下几个场景：

* 根据ip限制并发连接数
* 限制时间窗口的请求数，如：限制 ip 每分钟只能调用 100 次 /order 接口，（允许在时间段开始的时候一次性放过100个请求）
* 平滑限制接口请求数，如：限制 ip 每分钟只能调用 120 次 /order 接口（平滑处理请求，即每秒放过2个请求）
* 漏桶算法限流，如：限制 ip 每分钟只能调用 120 次 /order 接口（平滑处理请求，即每秒放过2个请求），超过的部分进入桶中等待，（桶容量为60），如果桶也满了，则进行限流


### Lua脚本

```
 server {
        listen       80;
        server_name  localhost;
        charset utf-8;
        #access_log  logs/host.access.log  main;
 
        # 限流示例
        location /order/limit {

            default_type 'text/html';
            access_by_lua_block {

                -- 导入模块
                local limit_count = require "resty.limit.count"
         
                -- 限流规则: 每分钟3次
                local lim, err = limit_count.new("my_limit_count_store", 3, 60)
                if not lim then
                    ngx.log(ngx.ERR, "failed to instantiate a resty.limit.count object: ", err)
                    return ngx.exit(500)
                end
         
                local key = ngx.var.binary_remote_addr
                local delay, err = lim:incoming(key, true)
                -- 如果请求数在限制范围内，则当前请求被处理的延迟（这种场景下始终为0，因为要么被处理要么被拒绝）和将被处理的请求的剩余数
                 ngx.log(ngx.ERR,"delay: ",delay," err: ",err)
                if not delay then
                    if err == "rejected" then
                        ngx.say("访问太频繁了..","delay: ",delay," , err: ",err)
                        -- return ngx.exit(503)
                    end
         
                    ngx.log(ngx.ERR, "被限流啦...... ", err)
                    return ngx.exit(500)
                end

                ngx.say("success")
            }
         
           
        }

```

**场景测试：**

流控设置规则，每分钟限制访问3次

**正常请求：**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/7-2.jpg" width="450px">
</div>

**请求过多，触发流控：**

<div align="left">
    <img src="https://offercome.cn/images/arch/system/7-3.jpg" width="450px">
</div>






