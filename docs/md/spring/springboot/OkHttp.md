---
title: Spring Boot 集成 OkHttp
---

# Spring Boot 集成 OkHttp

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

OKHttp 是 Square 公司开发的一款网络框架，其设计和实现的目的就是高效。OkHttp框架完整的实现了 HTTP 协议，支持的协议有 HTTP/1.1、SPDY、HTTP/2.0 。在 Android 4.4 的源码中HttpURLConnection 已经被替换成OkHttp。

既然 OkHttp 的招牌是高效，那它是如何实现的呢？

* 采用连接池技术减少
* 默认使用 GZIP 数据压缩格式，降低传输内容的大小
* 采用缓存避免重复的网络请求
* 支持SPDY、HTTP/2.0，对于同一主机的请求可共享同一socket连接
* 若SPDY或HTTP/2.0 不可用，还会采用连接池提高连接效率
* 网络出现问题、会自动重连（尝试连接同一主机的多个ip地址）
* 使用 okio 库简化数据的访问和存储

## 常用概念


### OkHttpClient

OkHttpClient 可以说是整个OkHttp 框架的一个门面（Facade 模式），在使用 OkHttp 框架时只需同OkHttpClient 打交道，而不用考虑其内部复杂的构成。这个类的职责就是配置参数和生成 Call 对象，配置参数包括：超时时间（连接、读、写）、代理服务器、Dns、协议和连接规范、缓存配置，拦截器、证书验证等。


### Request

Request 是 一个基本的 HTTP 网络请求，包括要请求的URL，同 HTTP 规范一样，它需要包含请求行，请求头，请求体（可以为空）。

### Response

Response 即为网络响应，包括响应行，响应头和响应体（允许为空）, 响应体只能被消费一次，且除响应体外的属性不可变。

### Call

Call 是一个接口，实现了对 Request 的封装，可以看做是一次请求任务，可以同步(execute)、异步(enqueue)执行，也可以取消 (cancel) 或者查询当前任务状态 。RealCall 是 Call 的一个子类，对其接口中定义的方法做了实现。

**Cache & CacheStrategy**

Cache 即缓存，是对于某一特定 Request 的缓存，缓存的内容为该 Request 的 Response ，缓存多以<请求、响应>键值对的形式存在。缓存可以为内存，也可以为硬盘，缓存可以进行失效时间、最大容量、缓存目录等设置。
CacheStrategy 即缓存策略，即当用 OkHttp 请求一个 Request 时，是采用缓存还是网络还是两者皆用。

## 核心流程


* 构建`OkHttpClient`对象
* 构建`Request`对象
* 由前两步创建的`OkHttpClient`和`Request`对象创建`Call`对象
* 通过`Call`对象发起请求，并得到一个`Response`对象，解析得到最终返回的结果。


## 代码演示

在pom.xml中添加以下依赖项：

```
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>3.10.0</version>
</dependency>
```

> 官方建议是一个工程只配置一个 OKHttpClient 来处理所有的网络请求。

初始化 `OkHttpClient` 客户端实例

```
client = new OkHttpClient.Builder()
        .connectTimeout(connTimeout, TimeUnit.MILLISECONDS)
        .readTimeout(readTimeout, TimeUnit.MILLISECONDS)
        .writeTimeout(writeTime, TimeUnit.MILLISECONDS)
        .sslSocketFactory(createSslSocketFactory(), x509TrustManager())
        .connectionPool(createConnectionPool())
        .build();
```

发送post请求

```
public static String post(String url, String message, Map<String, String> headers) {
    RequestBody requestBody = RequestBody.create(JSON_TYPE, message);
    Builder builder = new Builder();
    builder.url(url).post(requestBody).build();
    Response response = null;
    String result = "";
    try {
        // 添加header
        if (headers != null && !headers.isEmpty()) {
            Iterator iterator = headers.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry entry = (Map.Entry) iterator.next();
                builder.addHeader((String) entry.getKey(), (String) entry.getValue());
            }
        }
        Request request = builder.build();
        response = client.newCall(request).execute();
        if (response.code() == 200) {
            result = response.body() == null ? "" : response.body().string();
        }

    } catch (IOException var3) {
        log.error("[HttpPost JSON Exception] URL:{}, error:{}", url, var3);
        throw new RuntimeException(var3);

    } finally {
        if (response != null) {
            response.close();
        }
    }
    return result;
}
```
> 同步请求使用的是call.execute()，只有当整个请求完成时才会从.execute()方法返回。

> 而对于异步请求来说，.enqueue(Callback)方法只要调用完就立即返回了，当网络请求返回之后会回调Callback的onResponse/onFailure方法，并且这两个回调方法是在子线程执行的，这也是异步请求和同步请求之间最主要的差别。


本地跑单元测试，发送post模拟请求，请求参数采用`json`格式数据，`content-type = "application/json;charset=utf-8"`

```
@Test
public void queryUser() {
    User user = User.builder().userName("TomGE").age(29).address("北京").build();

    String url = "http://localhost:8090/queryUser";
    String requestJson = JSON.toJSONString(user);
//        System.out.println(requestJson);
    String result = OkHttpUtil.post(url, requestJson, null);
    System.out.println("响应结果：");
    System.out.println(result);
}
```

响应结果：

```
已经接收到请求，用户名：TomGE , 年龄：29 , 地址：北京。响应：sucess!
```


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-okhttp
```
