---
title: Spring Boot 集成 HttpClient
---

# Spring Boot 集成 HttpClient

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

HTTP 协议可能是现在 Internet 上使用得最多、最重要的协议了，越来越多的 Java 应用程序需要直接通过 HTTP 协议来访问网络资源。虽然在 JDK 的 java net包中已经提供了访问 HTTP 协议的基本功能，但是对于大部分应用程序来说，JDK 库本身提供的功能还不够丰富和灵活。HttpClient 是Apache HttpComponents 下的子项目，用来提供高效的、最新的、功能丰富的支持 HTTP 协议的客户端编程工具包，并且它支持 HTTP 协议最新的版本和建议。


## 使用流程

* 创建一个`HttpClient`对象
* 创建请求方法的实例，并指定请求`URL`。
	* 如果需要发送`GET`请求，创建`HttpGet`对象；
	* 如果需要发送`POST`请求，创建`HttpPost`对象。
* 如果需要发送请求参数，可调用`HttpGet.setParams`方法来添加请求参数；对于`HttpPost`对象而言，可调用`setEntity(HttpEntity entity)`方法来设置请求参数。
* 使用`HttpClient`对象的`execute(HttpUriRequest request)`发送请求，该方法返回一个`HttpResponse`对象。
* 调用`HttpResponse`的`getAllHeaders()`、`getHeaders(String name)`等方法可获取服务器的响应头；调用`HttpResponse`的`getEntity()`方法可获取`HttpEntity`对象，该对象包装了服务器的响应内容。程序可通过该对象获取服务器的响应内容。
* 释放连接。无论执行方法是否成功，都必须释放连接


## 代码演示

### 外部依赖

在pom.xml中添加以下依赖项：

```
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.10</version>
</dependency>
```

### 初始化

初始化 `CloseableHttpClient` 客户端实例

```
ConnectionKeepAliveStrategy myStrategy = new ConnectionKeepAliveStrategy() {
    @Override
    public long getKeepAliveDuration(HttpResponse response, HttpContext context) {
        Args.notNull(response, "HTTP response");
        final HeaderElementIterator it = new BasicHeaderElementIterator(
                response.headerIterator(HTTP.CONN_KEEP_ALIVE));
        while (it.hasNext()) {
            final HeaderElement he = it.nextElement();
            final String param = he.getName();
            final String value = he.getValue();
            if (value != null && "timeout".equalsIgnoreCase(param)) {
                try {
                    return Long.parseLong(value) * 1000;
                } catch (final NumberFormatException ignore) {
                }
            }
        }
        return 1;
    }

};
httpClient = HttpClients.custom().setConnectionManagerShared(true)
        .setConnectionManager(cm)
        .setKeepAliveStrategy(myStrategy)
        .evictExpiredConnections()
        .build();
return httpClient;
```

目前最新版的 HttpClient 的实现类为 CloseableHttpClient

**创建 CloseableHttpClient 实例有两种方式：**

* 使用`CloseableHttpClient`的工厂类`HttpClients`的方法来创建实例。`HttpClients`提供了根据各种默认配置来创建`CloseableHttpClient`实例的快捷方法。最简单的实例化方式是调用`HttpClients.createDefault()`。

* 使用`CloseableHttpClient`的builder类`HttpClientBuilder`，先对一些属性进行配置（采用装饰者模式，不断的.setxxxxx().setxxxxxxxx()就行了），再调用build方法来创建实例。上面的`HttpClients.createDefault()`实际上调用的也就是`HttpClientBuilder.create().build()`。

build()方法最终是根据各种配置来new一个`InternalHttpClient`实例（`CloseableHttpClient`抽象类的子类）。


### 发送post请求

```
private static String doPost(String url, String postData, Map<String, String> mapHeader, HttpHost proxy) {
    HttpPost httpPost = null;
    CloseableHttpResponse response = null;
    try {
        httpPost = new HttpPost(url);
        httpPost.setConfig(requestConfig);
        for (Map.Entry<String, String> entry : mapHeader.entrySet()) {
            httpPost.setHeader(entry.getKey(), entry.getValue());
        }
        httpPost.setEntity(new StringEntity(postData, DEFAULT_CHARSET));
        if (proxy == null) {
            response = getHttpClient().execute(httpPost,
                    HttpClientContext.create());
        } else {
            response = getHttpClient().execute(proxy, httpPost,
                    HttpClientContext.create());
        }

        String result = getContent(response);
        return result;
    } catch (Exception e) {
        log.error("post error, e:{}, url:{},parameterMap:{}", e.getMessage(), url,
                postData, e);
        return null;
    } finally {
        release(httpPost, response);
    }
}
```


本地跑单元测试，发送`post`模拟请求，请求参数采用`json`格式数据，`content-type = "application/json;charset=utf-8"`

```
@Test
public void queryUser() {
    User user = User.builder().userName("TomGE").age(29).address("北京").build();
    String url = "http://localhost:8090/queryUser";
    String requestJson = JSON.toJSONString(user);
    String result = HttpClientUtil.postJsonRequest(url, requestJson, null);
    System.out.println("响应结果：");
    System.out.println(result);
}
```

响应结果：

```
已经接收到请求，用户名：TomGE , 年龄：29 , 地址：北京。响应：sucess!
```

## 注意事项

* 连接池最大连接数，不配置为20
* 同个route的最大连接数，不配置为2
* 去连接池中取连接的超时时间，不配置则无限期等待
* 与目标服务器建立连接的超时时间，不配置则无限期等待
* 去目标服务器取数据的超时时间，不配置则无限期等待
* 要fully consumed entity，才能正确释放底层资源
* 同个host但ip有多个的情况，请谨慎使用单例的HttpClient和连接池
* HTTP1.1默认支持的是长连接，如果想使用短连接，要在request的header上加`Connection:close`，不然长连接是不可能自动被关掉的！


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-httpclient
```
