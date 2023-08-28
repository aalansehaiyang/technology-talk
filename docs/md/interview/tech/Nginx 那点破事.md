---
title: 第二十篇：Nginx ！反向代理、正向代理、高并发、负载均衡
---

# Nginx 那点破事！反向代理、正向代理、高并发、负载均衡

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



## 什么是 Nginx？

答案：<br />Nginx是一款免费的、开源的、高性能 HTTP 服务器和反向代理服务器，以其高性能、稳定性、丰富的功能、简单的配置和低资源消耗而闻名。支持 HTTP、HTTPS、SMTP、POP3 和 IMAP 协议。<br />解决了服务器的C10K（就是在一秒之内连接客户端的数目为10k即1万）问题。它的设计不像传统的服务器那样使用线程处理请求，而是一个更加高级的机制，是一种异步事件驱动结构。

## Nginx 优点？<br /><br />
答案：<br />1、跨平台、配置简单。<br />2、响应快。在正常情况下，单次请求会得到更快的响应；另一方面，在高峰期（如有数以万计的并发请求），Nginx 可以比其他Web服务器更快地响应请求。<br />3、内存消耗低。10 000个非活跃的HTTP Keep-Alive连接在Nginx中仅消耗2.5MB 内存<br />4、单机支持10万以上的并发连接。随着互联网的迅猛发展和互联网用户数量的成倍增长，各大公司、网站都需要应付海量并发请求，一个能够在峰值期顶住10万以上并发请求的Server，无疑会得到大家的青睐。理论上，Nginx支持的并发连接上限取决于内存，10万远未封顶。当然，能够及时地处理更多的并发请求，是与业务特点紧密相关的。<br />5、高可靠性：用于反向代理，宕机的概率微乎其微。因为Nginx的可靠性是大家有目共睹的，很多家高流量网站都在核心服务器上大规模使用Nginx。Nginx的高可靠性来自于其核心框架代码的优秀设计、模块设计的简单性；另外，官方提供的常用模块都非常稳定，每个worker进程相对独立，master进程在1个worker进程出错时可以快速“拉起”新的worker子进程提供服务。<br />6、热部署<br />master 管理进程与 worker 工作进程的分离设计，使得 Nginx 能够提供热部署功能，即可以在7×24小时不间断服务的前提下，升级Nginx的可执行文件。当然，它也支持不停止服务就更新配置项、更换日志文件等功能。<br />7、成本低廉，且开源。<br />8、内置的健康检查功能：如果有一个服务器宕机，会做一个健康检查，再发送的请求就不会发送到宕机的服务器了。重新将请求提交到其他的节点上

## Nginx 应用场景？<br /><br />
答案：<br />1、反向代理，负载均衡。当网站的访问量达到一定程度后，单台服务器不能满足用户的请求时，需要用多台服务器集群可以使用nginx做反向代理。并且多台服务器可以平均分担负载，不会出现某台服务器负载高宕机而某台服务器闲置的情况。<br />2、web容器。Nginx是一个http服务可以独立提供http服务。可以做网页静态服务器。<br />3、正向代理。通过代理服务转发请求到目标服务器。<br />4、虚拟主机。可以实现在一台服务器虚拟出多个网站，例如个人网站使用的虚拟机。

## Nginx 如何处理请求？

答案：
```
server { # 第一个Server区块开始，表示一个独立的虚拟主机站点
   listen       80；# 提供服务的端口，默认80
   server_name localhost; # 提供服务的域名主机名
   location / { # 第一个location区块开始
         root   html; # 站点的根目录，相当于Nginx的安装目录
         index  index.html index.html; # 默认的首页文件，多个用空格分开
} 
```

1、首先，Nginx 在启动时，会解析配置文件，得到需要监听的端口与 IP 地址，然后在 Nginx 的 Master 进程里面先初始化好这个监控的Socket(创建 Socket，设置 addr、reuse 等选项，绑定到指定的 ip 地址端口，再 listen 监听)。<br />2、然后，再 fork(一个现有进程可以调用 fork 函数创建一个新进程。由 fork 创建的新进程被称为子进程 )出多个子进程出来。<br />3、之后，子进程会竞争 accept 新的连接。此时，客户端就可以向 nginx 发起连接了。当客户端与nginx进行三次握手，与 nginx 建立好一个连接后。此时，某一个子进程会 accept 成功，得到这个建立好的连接的 Socket ，然后创建 nginx 对连接的封装，即 ngx_connection_t 结构体。<br />4、接着，设置读写事件处理函数，并添加读写事件来与客户端进行数据的交换。<br />5、最后，Nginx 或客户端来主动关掉连接，到此，一个连接就寿终正寝了。

## Nginx 如何实现高并发？

答案：<br />**异步非阻塞、 epoll 事件机制。**<br />每进来一个 request ，会有一个 worker 进程去处理。但不是全程的处理，处理到什么程度呢？处理到可能发生阻塞的地方，比如向上游（后端）服务器转发 request ，并等待请求返回。那么，这个处理的worker 不会这么傻等着，他会在发送完请求后，注册一个事件：“如果 upstream 返回了，告诉我一声，我再接着干”。于是他就休息去了。此时，如果有新的 request 进来，他可以很快再按这种方式处理。而一旦上游服务器返回了，就会触发这个事件，worker 才会来接手，这个 request 才会接着往下走。

## 什么是反向代理？<br /><br />
答案：<br />反向代理（Reverse Proxy）方式，是指以代理服务器来接受 Internet上的连接请求，然后将请求发给内部网络上的服务器，并将从服务器上得到的结果返回给 Internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。
> 总结就一句话：代理的是服务端。


## 什么是正向代理？

答案：<br />一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标 (原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端才能使用正向代理。
> 总结就一句话：代理的是客户端。比如：我们使用的OpenVPN 等


## 反向代理服务器的优点?

答案：<br />反向代理服务器可以隐藏源服务器的存在和特征。它充当互联网云和web服务器之间的中间层。这对于安全方面来说是很好的，特别是当您使用web托管服务时。

## nginx.conf 有哪些属性模块?

答案：
```
worker_processes  1；# worker进程的数量
events { # 事件区块开始
    worker_connections  1024；# 每个worker进程支持的最大连接数
} # 事件区块结束
http { # HTTP区块开始
    include       mime.types；# Nginx支持的媒体类型库文件
    default_type application/octet-stream；# 默认的媒体类型
    sendfile on；# 开启高效传输模式
    keepalive_timeout 65；# 连接超时
    server { # 第一个Server区块开始，表示一个独立的虚拟主机站点
        listen       80；# 提供服务的端口，默认80
        server_name localhost；# 提供服务的域名主机名
        location / { # 第一个location区块开始
            root   html；# 站点的根目录，相当于Nginx的安装目录
            index index.html index.htm；# 默认的首页文件，多个用空格分开
        } # 第一个location区块结果
        error_page 500502503504  /50x.html；# 出现对应的http状态码时，使用50x.html回应客户
        location = /50x.html { # location区块开始，访问50x.html
            root   html；# 指定对应的站点目录为html
        }
    }
    ......
```


## 为什么 Nginx 不使用多线程？<br /><br />
答案：<br />1、Apache: 创建多个进程或线程，而每个进程或线程都会为其分配 cpu 和内存（线程要比进程小的多，所以 worker 支持比 perfork 高的并发），并发过大会榨干服务器资源。<br />2、Nginx: 采用单线程来异步非阻塞处理请求（管理员可以配置 Nginx 主进程的工作进程的数量）(epoll)，不会为每个请求分配 cpu 和内存资源，节省了大量资源，同时也减少了大量的 CPU 的上下文切换。所以才使得 Nginx 支持更高的并发。

## Nginx 和 apache 区别？<br /><br />
答案：<br />1、轻量级，同样起web服务，比apache占用更少的内存和资源。<br />2、高并发，nginx处理请求是异步非阻塞的，而apache则是阻塞性的，在高并发下nginx能保持低资源、低消耗、高性能。<br />3、高度模块化的设计，编写模块相对简单。<br />4、最核心的区别在于apache是同步多进程模型，一个连接对应一个进程，nginx是异步的，多个连接可以对应一个进程。

## **Master 和 Worker 进程分别是什么?**<br /><br />
答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1667012097572-a6084691-f5ca-4138-ae4a-45d4b61be32b.png#clientId=uae95391c-3cb3-4&from=paste&id=u931b9adf&originHeight=419&originWidth=621&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uce2b4a63-5d8e-4c63-af98-a0364a5f068&title=)<br />1、master 进程启动后，通过一个 for 循环来 接收 和 处理外部信号 <br />2、主进程通过 fork() 函数产生 worker 子进程 ，每个子进程执行一个 for循环来实现Nginx服务器对<br />事件的接收和处理 。 

## Nginx 怎么做的动静分离？<br /><br />
答案：<br />只需要指定路径对应的目录。location/可以使用正则表达式匹配。并指定对应的硬盘中的目录。如下：（操作都是在Linux上）
```
location /image/ {
    root /usr/local/static/;
    autoindex on;
}

步骤：
# 创建目录
mkdir /usr/local/static/image
 
# 进入目录
cd  /usr/local/static/image
 
# 上传照片
photo.jpg
 
# 重启nginx
sudo nginx -s reload
```

打开浏览器， 地址栏输入 server_name/image/1.jpg 就可以访问该静态图片了

## Nginx 负载均衡的算法有哪些?

答案：<br />为了避免服务器崩溃，通过负载均衡的方式来分担服务器压力。将对台服务器组成一个集群，当用户访问时，先访问到一个转发服务器，再由转发服务器将访问分发到压力更小的服务器。

Nginx 负载均衡实现的策略有以下五种：<br />**1 .轮询(默认)**<br />每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某个服务器宕机，能自动剔除故障系统。
```
upstream backserver {
 server 192.168.0.12;
 server 192.168.0.13;
}
```

**2. 权重 weight**<br />weight的值越大，分配到的访问概率越高，主要用于后端每台服务器性能不均衡的情况下。其次是为在主从的情况下设置不同的权值，达到合理有效的地利用主机资源。
```
# 权重越高，在被访问的概率越大，如上例，分别是20%，80%。
upstream backserver {
 server 192.168.0.12 weight=2;
 server 192.168.0.13 weight=8;
}
```

**3. ip_hash( IP绑定)**<br />每个请求按访问IP的哈希结果分配，使来自同一个IP的访客固定访问一台后端服务器，并且可以有效解决动态网页存在的session共享问题
```
upstream backserver {
 ip_hash;
 server 192.168.0.12:88;
 server 192.168.0.13:80;
}
```

**4. fair(第三方插件)**<br />必须安装upstream_fair模块。对比 weight、ip_hash更加智能的负载均衡算法，fair算法可以根据页面大小和加载时间长短智能地进行负载均衡，响应时间短的优先分配。
```
# 哪个服务器的响应速度快，就将请求分配到那个服务器上。
upstream backserver {
 server server1;
 server server2;
 fair;
}
```

**5.url_hash(第三方插件)**<br />必须安装Nginx的hash软件包按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。
```
upstream backserver {
 server squid1:3128;
 server squid2:3128;
 hash $request_uri;
 hash_method crc32;
}
```

## 如何用 Nginx 解决前端跨域问题？<br /><br />
答案：<br />使用Nginx转发请求。把跨域的接口写成调本域的接口，然后将这些接口转发到真正的请求地址。

## Nginx 高可用性怎么配置？<br /><br />
答案：<br />当上游服务器 (真实访问服务器)，一旦出现故障或者没有及时响应，应该轮询到下一台服务器，保证服务器的高可用Nginx配置代码：
```
server {
        listen       80;
        server_name  www.lijie.com;
        location / {
            ### 指定上游服务器负载均衡服务器
            proxy_pass http://backServer;
            ###nginx与上游服务器(真实访问的服务器)超时时间 后端服务器连接的超时时间_发起握手等候响应超时时间
            proxy_connect_timeout 1s;
            ###nginx发送给上游服务器(真实访问的服务器)超时时间
            proxy_send_timeout 1s;
            ### nginx接受上游服务器(真实访问的服务器)超时时间
            proxy_read_timeout 1s;
            index  index.html index.htm;
        }
    }
```

## Nginx 如何实现后端服务的健康检查？

答案：<br />1、利用 nginx 自带模块 ngx_http_proxy_module 和 ngx_http_upstream_module 对后端节点做健康检查。<br />2、利用 nginx_upstream_check_module 模块对后端节点做健康检查，推荐该方式。

## Nginx 如何开启压缩？

答案：<br />开启nginx `gzip` 压缩后，网页、css、js 等静态资源的大小会大大的减少，从而可以节约大量的网络带宽，提高传输效率，给用户快的体验。<br />虽然会消耗cpu资源，但是为了给用户更好的体验是值得的。开启的配置如下：将以下配置放到nginx.conf 的 http{ … } 模块中
```
http {
  # 开启gzip
  gzip on;
 
  # 启用gzip压缩的最小文件；小于设置值的文件将不会被压缩
  gzip_min_length 1k;
 
  # gzip 压缩级别 1-10
  gzip_comp_level 2;
 
  # 进行压缩的文件类型
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
 
  # 是否在http header中添加Vary: Accept-Encoding，建议开启
  gzip_vary on;
}
```

保存并重启nginx，刷新页面（为了避免缓存，请强制刷新）就能看到效果了

## 如何设置worker进程的数量？<br /><br />
答案：<br />在有多个cpu的情况下，可以设置多个worker，worker进程的数量可以设置到和cpu的核心数一样多。<br />如果在单个cpu上起多个worker进程，那么操作系统会在多个worker之间进行调度，这种情况会降低系统性能，如果只有一个cpu，那么只启动一个worker进程就可以了。

## **Nginx如何处理一个HTTP请求？**<br /><br />
答案：<br />Nginx 是一个高性能的 Web 服务器，能够同时处理大量的并发请求。它结合多进程机制和异步机制，异步机制使用的是异步非阻塞方式 ，接下来就给大家介绍一下 Nginx 的多线程机制和异步非阻塞机制<br />**1、多进程机制**<br />服务器每当收到一个客户端时，由服务器主进程 （ master process ）生成一个子进程（ worker process ）出来和客户端建立连接进行交互，直到连接断开，该子进程就结束了。<br />使用进程的好处是各个进程之间相互独立，不需要加锁，减少了使用锁对性能造成影响，同时降低编程的复杂度，降低开发成本。其次，采用独立的进程，可以让进程互相之间不会影响 ，如果一个进程发生异常退出时，其它进程正常工作， master 进程则很快启动新的 worker 进程，确保服务不会中断，从而将风险降到最低。<br />缺点：操作系统生成一个子进程需要进行内存复制等操作，在资源和时间上会产生一定的开销。当有大<br />量请求时，会导致系统性能下降 。 <br />**2、异步非阻塞机制**<br />每个工作进程 使用 异步非阻塞方式 ，可以处理多个客户端请求 。<br />当某个工作进程 接收到客户端的请求以后，调用 IO 进行处理，如果不能立即得到结果，就去处理其他请求 （非阻塞 ）；而 客户端在此期间也无需等待响应 ，可以去处理其他事情（异步）。<br />当 IO 返回时，会通知此工作进程 。该进程得到通知，暂时挂起当前处理的事务去 响应客户端请求。
