---
title: 第十二篇：Spring Cloud ！Gateway、注册发现、Hystrix、Ribbon
---

# Spring Cloud 那点破事！Gateway、注册发现、Hystrix、Ribbon

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



## 什么是 Spring Cloud？

答案：<br />Spring Cloud 是一个服务治理平台，是若干个框架的集合，提供了全套的分布式系统解决方案。<br />包含：服务注册与发现、配置中心、服务网关、智能路由、负载均衡、断路器、监控跟踪、分布式消息队列等等。

## Spring Cloud 的优缺点？

答案<br />微服务的框架那么多⽐如：dubbo、Kubernetes，为什么还要使⽤Spring Cloud呢？<br />**优点：**<br />1、出自 Spring家族，应用广泛，可以保证后续的更新、完善<br />2、组件丰富，功能⻬全。Spring Cloud 为微服务架构提供了⾮常完整的⽀持。如：配置管理、服务发现、断路器、微服务⽹关等；<br />3、Spring Cloud 社区活跃度很⾼，遇到问题很容易找到解决⽅案<br />4、服务拆分粒度更细，耦合度⽐较低，有利于资源重复利⽤，提⾼开发效率<br />5、可以更精准的制定优化服务⽅案，提⾼系统的可维护性<br />6、减轻团队的成本，前期预先定义好接口规范，并⾏开发<br />7、跨平台性，可以⽤任何⼀种语⾔开发<br />8、适于互联⽹时代的快节奏，产品迭代周期更短<br />**缺点：**<br />1、微服务过多，系统治理成本⾼，不利于维护系统<br />2、分布式系统开发的成本⾼（容错，分布式事务等）对团队挑战⼤

## 服务注册和发现是什么？

答案：<br />当我们开始⼀个项⽬时，我们通常在属性⽂件中进⾏相应的配置。随着越来越多的服务开发和部署，添加和修改这些属性变得更加复杂。有些服务可能会下线，⽽有些服务地址可能会发⽣变化。⼿动更改成本高。<br />Eureka 服务注册和发现可以解决这个问题。所有服务都在 Eureka 服务器上注册并通过调⽤ Eureka 服务器完成查找，因此⽆需处理服务单点的任何更改和处理。

## **Eureka 和 ZooKeeper 的区别？**

答案：<br />1、ZooKeeper 保证的是CP；Eureka 保证的是AP。ZooKeeper在选举期间注册服务瘫痪，虽然服务最终会恢复，但是选举期间不可用的。Eureka 各个节点是平等关系，只要有一台Eureka就可以保证服务可用，而查询到的数据并不是最新的；自我保护机制会导致Eureka不再从注册列表移除因长时间没收到心跳而应该过期的服务，Eureka仍然能够接受新服务的注册和查询请求，但是不会被同步到其他节点(高可用)；当网络稳定时，当前实例新的注册信息会被同步到其他节点中(最终一致性)。Eureka可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像ZooKeeper一样使得整个注册系统瘫<br />2、ZooKeeper有Leader和Follower角色；Eureka 各个节点平等<br />3、ZooKeeper采用过半数存活原则；Eureka 采用自我保护机制解决分区问题

## **Eureka 心跳检查机制？**<br /><br />
答案：<br />Eureka Client 向 Eureka Server 注册完服务信息以后，Eureka Server 会通过心跳检测机制来检测当前这个客户端服务是否还存活着。<br />默认的检测机制是 Eureka Client每隔 30s 向Eureka Server发送一个心跳检查包。如果Eureka Server在90s之内没有收到 Eureka Client 所发送的心跳检查包，那么此时Eureka Server将该Eureka Client从服务列表中剔除掉。

## **Eureka 自我保护机制?**<br /><br />
答案：<br />自我保护模式正是一种针对网络异常波动的安全保护措施，使用自我保护模式能使Eureka 集群更加的健壮、稳定的运行。<br />Eureka 自我保护机制的工作机制是：如果在15分钟内超过85%的客户端节点都没有正常的心跳，那么Eureka 就认为客户端与注册中心出现了网络故障，Eureka Server自动进入自我保护机制。

**此时会出现以下几种情况：**<br />1、Eureka Server不再从注册列表中移除因为长时间没收到心跳而应该过期的服务。<br />2、Eureka Server 仍然能够接受新服务的注册和查询请求，但是不会被同步到其它节点上，保证当前节点依然可用。<br />3、当网络稳定时，当前Eureka Server新的注册信息会被同步到其它节点。

:::info
Eureka Server可以很好的应对因网络故障导致部分节点失联的情况，不会像 ZK 那样如果有一半不可用的情况会导致整个集群不可用而变成瘫痪。
:::

**自我保护的开关配置：**
```
# 开启自我保护机制，值设置为false关闭自我保护机制
eureka.server.enable-self-preservation = true    
```

## **Spring Cloud 如何实现服务注册?**

答案：<br />1、服务发布时，指定对应的服务名，将服务注册到注册中心(eureka 或 zookeeper)<br />2、服务提供方添加 @EnableEurekaServer，服务调用方添加 @EnableDiscoveryClient，然后用 ribbon或feign进行服务的调用发现。

## **什么是 Ribbon？**

答案：<br />1、Spring Cloud Ribbon 是基于Netﬂix Ribbon 实现的客户端 负载均衡的工具。<br />2、Ribbon 客户端组件提供一系列完善的配置项，如：连接超时，重试等。简单的说，就是在配置文件中列出Load Balancer（简称LB）后面所有的机器，Ribbon会自动的帮助你基于某种规则（如：轮询，随机等）去连接这些机器。我们也很容易使用Ribbon实现自定义的负载均衡算法。

**基本流程：**

- 拦截我们的RestTemplate请求 ，如：http://user-service/user/queryById
- RibbonLoadBalancerClient会从请求url中获取服务名称，也就是user-service
- DynamicServerListLoadBalancer根据 user-service 到 eureka 拉取服务列表，如 ip1:8081、ip2: 8082 等
- IRule利用内置负载均衡规则，从列表中选择一个 ，如 ip1:8081
- RibbonLoadBalancerClient修改请求地址，用 ip1:8081替换 user-service，向 http://ip1:8081/user/queryById 发起真实请求

## **Ribbon 常用的负载均衡算法？**<br /><br />
答案：<br />1、RoundRobinRule：简单轮询服务列表来选择服务器<br />2、WeightedResponseTimeRule： 为每一个服务器赋予一个权重值。服务器响应时间越长，这个服务器的权重就越小。这个规则会随机选择服务器，这个权重值会影响服务器的选择。<br />3、ZoneAvoidanceRule：以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个 Zone 可以理解为一个机房、一个机架等。然后再对Zone内的多个服务做轮询。它是 Ribbon默认的负载均衡规则。<br />4、BestAvailableRule：忽略那些短路的服务器，并选择并发数较低的服务器。<br />5、RandomRule： 随机选择一个可用的服务器。<br />6、RetryRule：重试机制的选择逻辑。

## **什么是 Feign ？**
答案：<br />1、fegin 是一个声明式的http的客户端工具用来简化远程调用，基于接口注解的方式来声明一个http的客户端<br />2、feign 整合了 ribbon，具有负载均衡的能力<br />3、整合 Hystrix，具有熔断的能力

**使用:**

- 添加pom依赖
```
<dependency>
    <groupId>org.springframework.cloud</groupId>    
    <artifactId>spring-cloud-starter-openfeign</artifactId>
 </dependency>
```

- 启动类上添加`@EnableFeignClients`
- 定义一个接口，通过 @FeignClient(name=“xxx”) 指定调用哪个服务

## **Ribbon 和 Feign 的区别？**

答案：<br />1、Ribbon都是调用其他服务的，但方式不同。<br />2、服务指定的位置不同，Ribbon是在@RibbonClient 注解上声明，Feign则是在定义抽象方法的接口中使用@FeignClient声明。<br />3、调用方式不同，Ribbon需要自己构建http请求，模拟http请求然后使用RestTemplate发送给其他服务，步骤相当繁琐。Feign 需要将调用的方法定义成抽象方法即可。

## **什么是服务熔断 ?**<br /><br />
答案：<br />在复杂的分布式系统中，微服务之间的相互调用，有可能出现各种各样的原因导致服务的阻塞，在高并发场景下，服务的阻塞意味着线程的阻塞，导致当前线程不可用，服务器的线程全部阻塞，导致服务器崩溃，由于服务之间的调用关系是同步的，会对整个微服务系统造成服务雪崩。<br />为了解决某个微服务的调用响应时间过长或者不可用进而占用越来越多的系统资源引起雪崩效应就需要进行服务熔断和服务降级处理。<br />**服务熔断**指的是某个服务故障或异常一起类似现实世界中的“保险丝"，当某个异常条件被触发就直接熔断整个服务，而不是一直等到此服务超时。

## 什么是 **Hystrix？**

答案：<br />Hystrix 是⼀个延迟和容错开源框架，用于隔离远程系统，服务和第三⽅库的访问点，出现不可避免的故障时，停⽌级联故障并在复杂的分布式系统中实现弹性。

## **Hystrix 的核心注解？**<br /><br />
答案：<br />1、@EnableHystrix： 开启熔断<br />2、@HystrixCommand (fallbackMethod=”XXX”)：声明一个失败回滚处理函数XXX，当被注解的方法执行超时（默认是1000毫秒），就会执行fallback函数，返回错误提示。

## **什么是 Spring Cloud Config ？**

答案：<br />集中配置管理工具，分布式系统中统一的外部配置管理，默认使用Git来存储配置，可以支持客户端配置的刷新及加密、解密操作。<br />在分布式系统中，由于服务数量巨多，为了方便服务配置文件统一管理，实时更新，所以需要分布式配置中心组件。在Spring Cloud中，有分布式配置中心组件 Spring Cloud Config ，它支持配置服务放在配置服务的内存中（即本地），也支持放在远程Git仓库中。在spring cloud config 组件中，分两个角色，一是config server，二是config client。<br />**使用：**<br />1、添加 pom 依赖<br />2、配置文件添加相关配置<br />3、启动类添加注解@EnableConfigServer

## **什么是 Spring Cloud Bus ？**<br /><br />
答案：<br />用于传播集群状态变化的消息总线，使用轻量级消息代理链接分布式系统中的节点，可以用来动态刷新集群中的服务配置。 <br />**使用:**<br />1、添加依赖<br />2、配置RabbitMQ

## **什么是 Spring Cloud OpenFeign ？**

答案：<br />基于Ribbon和Hystrix的声明式服务调用组件，可以动态创建基于Spring MVC注解的接口实现用于服务调用，在Spring Cloud 2.0 中已经取代 Feign 成为了一等公民。

## 什么是 **Spring Cloud Gateway?**<br /><br />
答案：<br />Spring Cloud Gateway是Spring Cloud官⽅推出的第⼆代⽹关框架，取代Zuul⽹关。⽹关作为流量入口，在微服务系统中有着⾮常作⽤，⽹关常⻅的功能有路由转发、权限校验、限流控制等作⽤。使⽤了⼀个RouteLocatorBuilder的bean去创建路由，除了创建路由RouteLocatorBuilder可以让你添加各种predicates和filters，predicates断⾔的意思，顾名思义就是根据具体的请求的规则，由具体的route去处理，filters是各种过滤器，⽤来对请求做各种判断和修改。

## **Spring Cloud 和 Spring Boot**的区别？<br /><br />
答案：<br />1、SpringBoot 专注于快速⽅便的开发单个微服务。<br />2、SpringCloud是关注全局的微服务协调整理治理框架，它将SpringBoot开发的⼀个个单体微服务整合并管理起来，为各个微服务之间提供，配置管理、服务发现、断路器、路由等集成服务<br />3、SpringBoot 可以离开 SpringCloud 独⽴使⽤开发项⽬， 但是SpringCloud离不开SpringBoot ，属于依赖的关系<br />4、SpringBoot 专注于快速、⽅便的开发单个微服务个体，SpringCloud 关注全局的服务治理框架。

## **Spring Cloud**和 **dubbo**区别 ? 

答案：<br />1、服务调⽤⽅式 dubbo 是RPC； Spring Cloud 是 Rest Api<br />2、注册中⼼，dubbo 是zookeeper ；Spring Cloud 是eureka，也可以是zookeeper<br />3、服务⽹关，dubbo 本身没有实现，只能通过其他第三⽅技术整合；Spring Cloud 有Zuul路由⽹关，作为路由服务器，进⾏消费者的请求分发

## 什么是 Spring Cloud Alibaba ？<br /><br />
答案：<br />Spring Cloud Alibaba 也是一套微服务解决方案，同 Spring Cloud 一样。Spring Cloud Alibaba 致力于提供微服务开发的一站式解决方案。此项目包含开发分布式应用微服务的必需组件，方便开发者通过 Spring Cloud 编程模型轻松使用这些组件来开发分布式应用服务。

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666960647347-0ab1d39e-ed82-45a6-a977-53dd0550b66a.png#clientId=uf295ffc6-aac8-4&from=paste&id=ucaef4a71&originHeight=1018&originWidth=1612&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u27183b81-18a4-4a04-8fc0-b001fdbd07c&title=)

**阿里开源组件**

- Nacos：阿里巴巴开源产品，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
- Sentinel：面向分布式服务架构的轻量级流量控制产品，把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
- RocketMQ：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
- Dubbo：Apache Dubbo™ 是一款高性能 Java RPC 框架，用于实现服务通信。
- Seata：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。

 更多内容：[【万字长文】创业公司就应该技术选型 Spring Cloud Alibaba ， 开箱即用](https://mp.weixin.qq.com/s/MATrMbBWFVbyWzSmNsOmMQ)

