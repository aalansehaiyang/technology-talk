---
title: Spring Boot 集成 Dubbo
---

# Spring Boot 集成 Dubbo

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

Dubbo是阿里巴巴开源的分布式服务框架，它最大的特点是按照分层的方式来架构，这样可以使各层之间最大限度的松耦合，也就是我们常说的解耦。从服务模型的角度看，Dubbo采用的模型非常简单，服务提供方负责提供服务，消费方负责消费服务，所以可以很方便的抽象出服务提供方（Provider）和消费方(Consumer)两个角色。

## 核心能力

* 服务的自动注册和发现
* 面向接口的远程方法调用
* 智能容错和负载均衡

## 整体架构

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/24-3.jpg" width="800px">
</div>


## 核心步骤

* 服务器负责启动、加载、运行服务提供方。
* 服务方启动时，向注册中心注册自己提供的服务。
* 消费者在启动后，向注册中心订阅自己所需要的服务。
* 注册中心返回服务提供方地址列表给消费者，如果地址变更，注册中心将基于长连接推送变更数据给消费者。
* 消费方从远程接口列表中调用远程接口，Dubbo会基于负载均衡算法，选一台服务提供者进行调用，如果调用失败，会自动调用另一台服务。
* 服务方和消费方，在内存中累计调用次数和调用时间，定时（每分钟）发送一次统计数据到监控中心。

> 源码：https://github.com/apache/dubbo

> 官方文档：https://dubbo.apache.org/zh/docs/v2.7/user/preface/architecture

## 代码演示

上面让大家对dubbo的工作原理有了一定的认识，接下来我们通过一个简单demo示例讲解下dubbo如何使用，涉及三个子工程。

* spring-boot-bulking-dubbo-api  定义接口api
* spring-boot-bulking-dubbo-server  服务提供者
* spring-boot-bulking-dubbo-client  服务消费者


### 服务接口定义（spring-boot-bulking-dubbo-api）

pom文件只是依赖常用的基础jar包

```
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.31</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.6</version>
</dependency>
```

定义 `UserService` 接口

```
/**
 * @author 微信公众号：微观技术
 */
public interface UserService {

    public User queryUser(QueryUserParam queryUserParam);
}
```

### 服务提供方（spring-boot-bulking-dubbo-server）

pom文件内容如下

```
<!--引入dubbo的依赖-->
<dependency>
    <groupId>com.alibaba.spring.boot</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.0.0</version>
</dependency>

<!-- 引入zookeeper的客户端依赖 -->
<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.11</version>
</dependency>
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.4.6</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
        <exclusion>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

`application.yaml` 配置文件

```
dubbo:
  application:
    name: spring-boot-bulking-dubbo-server
  registry:
    address: zookeeper://127.0.0.1:2181
  protocol:
    name: dubbo
    port: 20880
  timeout: 10000
  scan:
    base-packages: com.weiguanjishu.service
```

接口实现类

```
@Component
@Service
public class DubboServiceImpl implements UserService {

    @Override
    public User queryUser(QueryUserParam queryUserParam) {

        System.out.println("请求参数，queryUserParam：" + queryUserParam.getName());

        User user = User.builder().id(1L).userName("微观技术").age(11).address("上海").build();
        return user;
    }
}
```
> 注意：@Service注解采用dubbo包中的

Server 端启动成功


<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/24-1.jpg" width="700px">
</div>



### 服务消费方（spring-boot-bulking-dubbo-client）

`application.yaml` 配置文件

```
dubbo:
  application:
    name: spring-boot-bulking-dubbo-client
  registry:
    address: zookeeper://127.0.0.1:2181
  protocol:
    name: dubbo
    port: 20888
  timeout: 10000
```

编写 Controller，调用远程接口服务

```
@RestController
public class UserController {

    @Reference
    UserService userService;

    @RequestMapping("/query")
    public User query() {
        QueryUserParam param = new QueryUserParam();
        param.setName("微观技术");
        User user = userService.queryUser(param);
        System.out.println(JSON.toJSONString(user));
        return user;
    }
}
```

Restful接口调用，访问：`http://localhost:8098/query`，运行结果：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/24-4.jpg" width="700px">
</div>


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

三个模块：
spring-boot-bulking-dubbo-api
spring-boot-bulking-dubbo-client
spring-boot-bulking-dubbo-server

```
