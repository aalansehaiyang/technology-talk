---
title: Spring Boot 集成 Nacos
---

# Spring Boot 集成 Nacos

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

Nacos 是阿里巴巴的开源的项目，全称 Naming Configuration Service ，专注于服务发现和配置管理领域。

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

客户端语言方面目前支持 Java，go 、python、 C# 和 C++等主流语言

> 开源地址：https://github.com/alibaba/nacos

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/17-4.jpg" width="700px">
</div>


目前 Github上已经有近 **18K** 的 start，又有阿里巴巴复杂的业务做背书，在开源市场非常受欢迎。最近一次 commits 时间在2021年5月6日，社区维护投入力度很大，一些bug也能及时修复。

## 核心功能

* 动态配置服务

动态配置服务让您能够以中心化、外部化和动态化的方式管理所有环境的配置。动态配置消除了配置变更时重新部署应用和服务的需要。配置中心化管理让实现无状态服务更简单，也让按需弹性扩展服务更容易。

* 服务发现及管理

动态服务发现对以服务为中心的（例如微服务和云原生）应用架构方式非常关键。Nacos支持DNS-Based和RPC-Based（Dubbo、gRPC）模式的服务发现。Nacos也提供实时健康检查，以防止将请求发往不健康的主机或服务实例。借助Nacos，您可以更容易地为您的服务实现断路器。

* 动态DNS服务

通过支持权重路由，动态DNS服务能让您轻松实现中间层负载均衡、更灵活的路由策略、流量控制以及简单数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以DNS协议为基础的服务发现，以消除耦合到厂商私有服务发现API上的风险。


## Nacos 2.x 优点

在Nacos 1.X 基础上，对通讯层做了优化，目前采用了`gRPC`实现了长连接和配置推动，使用长链接的好处大幅度减少了 1.x 轮询心跳频繁导致 JVM Full GC。

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/17-5.jpg" width="700px">
</div>


1、客户端不再需要定时发送实例心跳，只需要有一个维持连接可用 `keepalive` 消息即可。重复 TPS 可以大幅降低。

2、TCP 连接断开可以被快速感知到，提升反应速度。

3、长连接的流式推送，比 UDP 更加可靠；nio 的机制具有更高的吞吐量，而且由于可靠推送，可以加长客户端用于对账服务列表的时间，甚至删除相关的请求。重复的无效 QPS 可以大幅降低。

4、长连接避免频繁连接开销，可以大幅缓解 `TIME_WAIT` 问题。

5、真实的长连接，解决配置模块 GC 问题。

6、更细粒度的同步内容，减少服务节点间的通信压力。


## 代码演示

### 外部依赖

Spring Boot 已经为 Nacos 封装了starter组件，只需在 pom.xml 文件中添加jar版本依赖即可：

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-config-spring-boot-starter</artifactId>
    <version>0.2.1</version>
</dependency>
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-config-spring-boot-actuator</artifactId>
    <version>0.2.1</version>
</dependency>

```

### 配置文件

在配置文件 application.yaml 中配置 Nacos 的相关参数，具体内容如下：

```
nacos:
  config:
    server-addr: 127.0.0.1:8848
```

就像Maven用`groupId`、`artifactId`、`version`三者来定位一个`jar`包在仓库中的位置一样。Nacos也提供了 Namespace (命名空间) 、Data ID (配置集ID)、 Group (组) 来确定一个配置文件。


### 启动类，添加dataId

```
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class})
@NacosPropertySource(dataId = "bulking-nacos-example", autoRefreshed = true)
public class StartApplication {

    public static void main(String[] args) {
        SpringApplication.run(StartApplication.class, args);
    }
}
```

### 注解方式，动态获取最新值

```
@Controller
@RequestMapping("config")
public class ConfigController {

    @NacosValue(value = "${useLocalCache}", autoRefreshed = true)
    private boolean useLocalCache;

    @RequestMapping(value = "/get", method = GET)
    @ResponseBody
    public boolean get() {
        return useLocalCache;
    }
}
```


## 操作演示

### 管理后台

Nacos是一个用Java语言编写的web项目，Tomcat默认端口是8848，访问8848端口可以打开Nacos管理台。 

访问地址：http://localhost:8848/nacos/#/login

> 用户名和密码：nacos/nacos

**新增动态配置**

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/17-1.jpg" width="700px">
</div>

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/17-2.jpg" width="700px">
</div>



当应用启动时，会将当前节点注册到nacos中

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/17-3.jpg" width="700px">
</div>


首次访问：http://localhost:9071/config/get

返回结果：

```
true
```

将nacos中 `Data Id`：` bulking-nacos-example` 中的 `useLocalCache` 设置成`false`

演示工程在不重启的情况下，能实时感知配置项的变化。


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-nacos
```


## 参考资料

* [https://mp.weixin.qq.com/s/Q7L6EhO8o4daC3yZPe-e7Q](https://mp.weixin.qq.com/s/Q7L6EhO8o4daC3yZPe-e7Q)