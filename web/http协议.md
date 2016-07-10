## http协议

---

HTTP全称是HyperText Transfer Protocal，即：超文本传输协议，从1990年开始就在WWW上广泛应用，是现今在WWW上应用最多的协议，    Http是应用层协议，当你上网浏览网页的时候，浏览器和Web服务器之间就会通过HTTP在Internet上进行数据的发送和接收。Http是一个基于请求/响应模式的、无状态的协议。即我们通常所说的Request/Response。


---
### Request相关

* 	URL：

URL(Uniform Resource Locator) 地址用于描述一个网络上的资源,  基本格式如下

```
schema://host[:port#]/path/.../[?query-string][#anchor]
scheme               指定低层使用的协议(例如：http, https, ftp)
host                   HTTP服务器的IP地址或者域名
port#                 HTTP服务器的默认端口是80，这种情况下端口号可以省略。如果使用了别的端口，必须指明，例如 http://www.cnblogs.com:8080/
path                   访问资源的路径
query-string       发送给http服务器的数据
anchor-             锚
URL 的一个例子
http://www.mywebsite.com/sj/test/test.aspx?name=sviergn&x=true#stuff
Schema:                 http
host:                   www.mywebsite.com
path:                   /sj/test/test.aspx
Query String:           name=sviergn&x=true
Anchor:                 stuff
```


*	Accept

作用： 浏览器端可以接受的媒体类型,

```
例如：  Accept: text/html  代表浏览器可以接受服务器回发的类型为 text/html  也就是我们常说的html文档,

如果服务器无法返回text/html类型的数据,服务器应该返回一个406错误(non acceptable)

通配符 * 代表任意类型

例如  Accept: */*  代表浏览器可以处理所有类型,(一般浏览器发给服务器都是发这个)
```

*	Referer

作用： 提供了Request的上下文信息的服务器，告诉服务器我是从哪个链接过来的，比如从我主页上链接到一个朋友那里，他的服务器就能够从HTTP Referer中统计出每天有多少用户点击我主页上的链接访问他的网站。

```
例如: Referer: http://translate.google.cn/?hl=zh-cn&tab=wT
```

*	Accept-Language

作用： 浏览器申明自己接收的语言。

语言跟字符集的区别：中文是语言，中文有多种字符集，比如big5，gb2312，gbk等等；

```
例如： Accept-Language: en-us
```

*	Content-Type

作用：

```
例如：Content-Type: application/x-www-form-urlencoded
```

*	Accept-Encoding：

作用： 浏览器申明自己接收的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate），（注意：这不是只字符编码）;

```
例如： Accept-Encoding: gzip, deflate
```

*	User-Agent

作用：告诉HTTP服务器， 客户端使用的操作系统和浏览器的名称和版本.
我们上网登陆论坛的时候，往往会看到一些欢迎信息，其中列出了你的操作系统的名称和版本，你所使用的浏览器的名称和版本，这往往让很多人感到很神奇，实际上，服务器应用程序就是从User-Agent这个请求报头域中获取到这些信息User-Agent请求报头域允许客户端将它的操作系统、浏览器和其它属性告诉服务器。

```
例如： User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; CIBA; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C; InfoPath.2; .NET4.0E)
```

*	Connection

```
例如：　Connection: keep-alive   当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接

例如：  Connection: close  代表一个Request完成后，客户端和服务器之间用于传输HTTP数据的TCP连接会关闭， 当客户端再次发送Request，需要重新建立TCP连接。
```

*	Content-Length

作用：发送给HTTP服务器数据的长度

```
例如： Content-Length: 38
```

*	Pragma

作用： 防止页面被缓存， 在HTTP/1.1版本中，它和Cache-Control:no-cache作用一模一样

```
Pargma只有一个用法， 例如： Pragma: no-cache
```

*	Cookie:

作用： 最重要的header, 将cookie的值发送给HTTP 服务器

*	Accept-Charset

作用：浏览器申明自己接收的字符集，如gb2312，utf-8（通常我们说Charset包括了相应的字符编码方案）；

*	If-Modified-Since

作用：把上次服务器告诉它的文件最后修改时间给服务器端

*	If-None-Match

Etag在服务器上生成后,客户端通过If-None-Match传递这个参数到服务端，来验证资源是否已修改


---

### Response相关

*	Cache-Control

作用: 这个是非常重要的规则。 这个用来指定Response-Request遵循的缓存机制。各个指令含义如下

```
Cache-Control:Public   可以被任何缓存所缓存
Cache-Control:Private     内容只缓存到私有缓存中
Cache-Control:no-cache  所有内容都不会被缓存
```

*	Content-Type

作用：WEB服务器告诉浏览器自己响应的对象的类型和字符集,

```
Content-Type: text/html; charset=utf-8
Content-Type:text/html;charset=GB2312
Content-Type: image/jpeg
```

*	Expires

作用: 浏览器会在指定过期时间内使用本地缓存

```
Expires: Tue, 08 Feb 2022 11:35:14 GMT
```


*	Last-Modified:

作用： 表示资源最后修改时间

```
例如: Last-Modified: Wed, 21 Dec 2011 09:09:10 GMT
```

* Etag

主要为了解决Last-Modified无法解决的一些问题，它比Last_Modified更加精确的知道文件是否被修改过。如果一个文件修改非常频繁，比如1秒内修改了10次，If-Modified-Since只能检查到秒级别的修改。

*	Server:

作用：指明HTTP服务器的软件信息

```
例如:Server: Microsoft-IIS/7.5
```

*	Connection

```
例如：　Connection: keep-alive   当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接

例如：  Connection: close  代表一个Request完成后，客户端和服务器之间用于传输HTTP数据的TCP连接会关闭， 当客户端再次发送Request，需要重新建立TCP连接。
```

*	Content-Length

指明实体正文的长度，以字节方式存储的十进制数字来表示。在数据下行的过程中，Content-Length的方式要预先在服务器中缓存所有数据，然后所有数据再一股脑儿地发给客户端。

```
例如: Content-Length: 19847
```


