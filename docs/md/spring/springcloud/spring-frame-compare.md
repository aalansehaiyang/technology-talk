---
title: 讲一讲 Spring、SpringMVC、SpringBoot、SpringCloud 之间的关系？
---

# 讲一讲 Spring、SpringMVC、SpringBoot、SpringCloud 之间的关系？

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


大家好，我是Tom哥~

搞后端开发的同学，对 Spring 家族一定不陌生。

Spring 全家桶了为了解决不同场景的问题，逐渐演化出多套生态环框，如： Spring、SpringMVC、SpringBoot、SpringCloud 

它们之间的关系：

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/4-1.jpg" width="600px">
</div>

## Spring

Spring 一站式的轻量级的java开发框架，采用容器化管理，创建各种 Bean 实例，并维护着 bean 与bean之间的关系。

### 两大核心利器

* IOC（控制反转） 
* AOP（面向切面）

为Java应用程序开发提供了全面的基础架构支持。包含很多开箱即用的模块，如：SpringJDBC、SpringSecurity、SpringAOP、SpringORM，提高了应用开发的效率。


## Spring MVC

一个网站通常有前台页面和后台处理逻辑，为了打通这层关系，衍生出类似 struts2 框架。专门解决前台页面与后端数据处理之间的映射关系。

**当然，Spring 家族为了维护其生态地位，把这种 `MVC` 模式的优势吸收了进来，加以改造，于是就诞生了 `Spring MVC`**

Spring MVC是 Spring 的 web 框架。

通过`Dispatcher Servlet`、`ModelAndView `和`View Resolver `，开发web应用变得很容易。主要针对的是带页面的系统开发，URL路由、Session、模板引擎、静态Web资源等等。

> SpringMVC = Struts2 + Spring

**处理流程：**

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/4-2.jpg" width="600px">
</div>

Spring MVC 框架与其他 Web MVC 框架一样，是请求驱动的，围绕一个中央 Servlet 设计，该 Servlet 将请求分派给控制器并提供其他功能以促进 Web 应用程序的开发。然而，Spring 的 DispatcherServlet 不仅仅如此。它与 Spring IoC 容器完全集成，因此允许您使用 Spring 的其他功能。


## Spring Boot

Spring 配置复杂，xml文件有大量的bean定义，开发起来繁琐。

另外，分布式时代，微服务盛行，为了统一后端框架，便于运维维护，开始推行 Spring Boot。

Spring Boot 是Spring框架的扩展，提供更加 `丰富的注解`，可以参考之前文章 [Spring Boot 常用注解一网打尽](https://mp.weixin.qq.com/s/_hk_alSB0evyv80nw-mPsg)

同时，将Servlet容器集成到框架中，如：`Tomcat`、`Jetty`、`Undertow`，我们开发时不需要再手动在 IDEA 中配置 tomcat 的路径，只需要`main函数`启动。

Spring Boot 框架相对于 Spring MVC 框架来说，更专注于后端接口，不开发前端页面，推崇**前后分离**。

根据 **约定胜于配置** 原则，与市场主流的开源框架打通， 设计了 `Starter` 和 `AutoConfiguration` 机制，简化配置流程，通过简单的jar包引入，快速具备组件集成能力。大大提高了程序员的开发效率。


### 常用的 Starter 组件

* spring-boot-starter：核心启动器，包含了自动配置、日志和YAML

* spring-boot-starter-web：构建Web应用，使用 Tomcat 作为内嵌容器

* spring-boot-starter-amqp：通过spring-rabbit来支持AMQP协议（Advanced Message Queuing Protocol

* spring-boot-starter-aop：面向方面的编程即AOP，包括spring-aop和AspectJ

* spring-boot-starter-groovy-templates：支持Groovy模板引擎

* spring-boot-starter-data-redis：使用Redis 和 Spring Data Redis，以及Jedis 客户端

* spring-boot-starter-data-elasticsearch：支持ElasticSearch搜索和分析引擎

* spring-boot-starter-data-jpa：支持 Java Persistence API

* spring-boot-starter-data-mongodb：支持MongoDB数据

* spring-boot-starter-logging：Spring Boot默认的日志框架Logback

* 更多，这里就不一一列举了

**历史文章：**


* [一文读懂Spring Boot各模块组件依赖关系](https://mp.weixin.qq.com/s/7DgpAA--uuOaWbvJWwfM9w)


## Spring Cloud

分布式时代，系统间需要打通、组成集群，从而具备更大吞吐能力。我们会将一个单体项目拆分成多个微服务，每个微服务系统独立技术选型、开发、部署上线，各个微服务之间打通、相互协调，从而完成全流程服务。

当然，为了降低不同微服务系统间的差异化接入成本，通常都是统一基于 Spring Boot 构建微服务系统。

Spring Cloud 将多个 Spring Boot 单体微服务整合、管理，是一系列框架的有序集合，利用Spring Boot的开发便利性简化了分布式系统基础设施的开发。

Spring Cloud 关注 **微服务整合、管理的服务治理框架，具有生态定位**，提供丰富的组件框架，如：

* 服务注册、发现
* 服务间调用
* 负载均衡
* 网关
* 配置中心
* 断路器
* 消息总线
* 监控 等

<div align="left">
    <img src="https://offercome.cn/images/spring/springcloud/4-3.jpg" width="600px">
</div>

> 链接：https://www.springcloud.cc/


## 小结

1、Spring 框架就像一个家族，有众多衍生产品，如：Spring Boot 、Spring security、jpa等，但他们的基础都是Spring的IOC、AOP等，IOC提供了依赖注入的容器，AOP解决了面向切面编程，在此两者基础上实现其他延伸产品的高级功能

2、Spring MVC 是基于Servlet的一个MVC框架，主要解决Web开发问题，因为Spring的配置非常复杂，各种XML、JavaConfig、servlet处理起来比较繁琐

3、为了简化开发者的使用，从而创造性的推出了Spring Boot框架，约定胜于配置，简化Spring MVC的配置流程。

区别于Spring MVC的是，Spring Boot专注于微服务的接口开发，和前端解耦。虽然Spring Boot也可以做成Spring MVC前后台一起开发，但不符合Spring Boot框架的初衷。

4、对于Spring Cloud框架来说，它和Spring Boot一样，关注的是微服务的开发。但Spring Cloud更关注的是多个微服务系统的整合和管理，相当于多个Spring Boot框架的单体微服务。

