---
title: Spring Boot 集成 Guava
---

# Spring Boot 集成 Guava

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



本地缓存一般位于应用服务器的部署机器上，使用应用服务器本身的少量内存。它是应用层获取数据的第一道缓存，应用层获取数据时先访问本地缓存，如果未命中，再通过远程从 L1 缓存层获取，最终获取到的数据再预热到本地缓存中。

相比远程缓存，本地缓存离应用和用户设备更近，性能会更好。

今天，我们主要介绍一款非常流行的本地缓存框架 —— Guava缓存

## 什么是 Guava

Guava 是 Google 开发的一款 Java 开源框架。

提供了一些 JDK 没有提供的功能，以及对 JDK 已有功能的增强功能。

包括：集合（Collections）、缓存（Caching）、原生类型支持（Primitives Support）、并发库（Concurrency Libraries）、通用注解（Common Annotation）、字符串处理（Strings Processing）、数学计算（Math）、I/O、事件总线（EventBus）等等。


## 项目集成

在 pom.xml 文件引入相应的二方包依赖

```
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>23.0</version>
</dependency>
```

初始化本地缓存类实例，并设置各种参数，满足个性化业务场景需求。

```
public class LocalCacheService {
    // 缓存接口这里是LoadingCache，LoadingCache在缓存项不存在时可以自动加载缓存
    public static LoadingCache<Long, User> userCache
            = CacheBuilder.newBuilder()
            .concurrencyLevel(8)
            .expireAfterWrite(5, TimeUnit.SECONDS)
            .expireAfterAccess(20, TimeUnit.SECONDS)
            .refreshAfterWrite(3, TimeUnit.SECONDS)
            .initialCapacity(5)
            .maximumSize(10)
            .recordStats()
            .removalListener(new RemovalListener<Object, Object>() {
                @Override
                public void onRemoval(RemovalNotification<Object, Object> notification) {
                    System.out.println(notification.getKey() + " 被移除了，原因： " + notification.getCause());
                }
            })
            .build(
                    new CacheLoader<Long, User>() {
                        @Override
                        public User load(Long id) throws Exception {
                            System.out.println("缓存未命中，从数据库加载，用户id：" + id);
                            return User.builder().id(id).userName("Lily").age(new Random().nextInt(20)).build();
                        }
                    }
            );

}
```

**参数解释：**

* expireAfterWrite  指定key在一定时间内没有创建/覆盖时，会移除该key，下次取的时候从loading中取
* expireAfterAccess 指定key在一定时间内没有读写，会移除该key，下次取的时候从loading中取
* refreshAfterWrite 指定key在一定时间内没有创建/覆盖时，则指定时间过后，再次访问时，会去刷新该缓存，在新值没有到来之前，始终返回旧值


> 主要区别：指定时间后，expire 是 remove 该 key，下次访问时同步去获取返回新值。
> <br/> 而 refresh 则是指定时间后，不会 remove 该key，下次访问会触发刷新，新值没有拿到前返回旧值

* concurrencyLevel(8)  设置并发级别为8，并发级别是指可以同时写缓存的线程数
* initialCapacity(5)  缓存容器的初始容量为5
* maximumSize(10)  缓存最大容量为 10，超过之后就会按照LRU 移除缓存项
* recordStats()  统计缓存的命中率，线上环境一般不需要
* removalListener(new RemovalListener<Object, Object>()  设置缓存的移除通知
* build()  指定CacheLoader，在缓存不存在时通过CacheLoader的实现自动加载缓存

**构造LoadingCache对象，里面提供了很多方法来操作缓存，比如 `getIfPresent` 、`put`、`invalidate`等，详细可以参考下图：**

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/6-1.jpg" width="800px">
</div>

**Guava 缓存失效的方法：**

* invalidate(key)：废弃缓存中 key对应的 value值。
* invalidateAll()：废弃缓存中所有的value值。
* invalidateAll(Iterable<?> keys)：废弃传入key集合对应的所有缓存中的value值。

**CacheStats 支持的监控统计维度：**

* requestCount()：返回Cache的lookup方法查找缓存的次数，不论查找的值是否被缓存。
* hitCount()：返回Cache的lookup方法命中缓存的次数。
* hitRate()：返回缓存请求的命中率，命中次数除以请求次数。
* missCount()：返回缓存请求的未命中的次数。
* missRate()：返回缓存请求未命中的比率，未命中次数除以请求次数。
* loadCount()：返回缓存调用load方法加载新值的次数。
* loadSuccessCount()：返回缓存加载新值的成功次数。
* loadExceptionCount()：返回缓存加载新值出现异常的次数。
* loadExceptionRate()：返回缓存加载新值出现异常的比率。
* totalLoadTime()：返回缓存加载新值所耗费的总时间。
* averageLoadPenalty()：缓存加载新值耗费的平均时间，加载的总时间除以加载的次数。
* evictionCount()：返回缓存中条目被移除的次数。
* minus(CacheStats other)：返回一个新的表示当前CacheStats与传入CacheStats之间差异的CacheStats实例。
* plus(CacheStats other)：返回一个新的表示当前CacheStats与传入CacheStats之间总计的CacheStats实例。


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-guava
```

