---
title: Spring Boot 集成 RabbitMQ
---

# Spring Boot 集成 RabbitMQ

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

RabbitMQ 是使用 Erlang 语言来编写的，并且 RabbitMQ 是基于 AMQP 协议的。Erlang语言在数据交互方面性能优秀，有着和原生Socket一样的延迟，这也是RabbitMQ高性能的原因所在。

## RabbitMQ 有哪些特点

* 开源、性能优秀，稳定性保障
* 提供可靠性消息投递模式、返回模式
* 与Spring AMQP完美整合，API丰富
* 集群模式丰富，表达式配置，HA模式，镜像队列模型
* 保证数据不丢失的前提做到高可靠性、可用性

## 应用场景

* 异步处理。把消息放入消息中间件中，等到需要的时候再去处理。
* 流量削峰。例如秒杀活动，在短时间内访问量急剧增加，使用消息队列，当消息队列满了就拒绝响应，跳转到错误页面，这样就可以使得系统不会因为超负载而崩溃。
* 日志处理
* 应用解耦。假设某个服务A需要给许多个服务（B、C、D）发送消息，当某个服务（例如B）不需要发送消息了，服务A需要改代码再次部署；当新加入一个服务（服务E）需要服务A的消息的时候，也需要改代码重新部署；另外服务A也要考虑其他服务挂掉，没有收到消息怎么办？要不要重新发送呢？是不是很麻烦，使用MQ发布订阅模式，服务A只生产消息发送到MQ，B、C、D从MQ中读取消息，需要A的消息就订阅，不需要了就取消订阅，服务A不再操心其他的事情，使用这种方式可以降低服务或者系统之间的耦合。

> 提到RabbitMQ，就不得不提AMQP协议。AMQP协议是二进制协议。是一个提供统一消息服务的应用层标准高级消息队列协议，是应用层协议的一个开放标准，为面向消息的中间件设计。

## 常用术语

* Server：接收客户端的连接，实现AMQP实体服务。
* Connection：连接，应用程序与Server的网络连接，TCP连接。
* Channel：信道，消息读写等操作在信道中进行。客户端可以建立多个信道，每个信道代表一个会话任务。
* Message：消息，应用程序和服务器之间传送的数据，消息可以非常简单，也可以很复杂。有Properties和Body组成。Properties为外包装，可以对消息进行修饰，比如消息的优先级、延迟等高级特性；Body就是消息体内容。
* Virtual Host：虚拟主机，用于逻辑隔离。一个虚拟主机里面可以有若干个Exchange和Queue，同一个虚拟主机里面不能有相同名称的Exchange或Queue。
* Exchange：交换器，接收消息，按照路由规则将消息路由到一个或者多个队列。如果路由不到，或者返回给生产者，或者直接丢弃。RabbitMQ常用的交换器常用类型有direct、topic、fanout、headers四种。
* Binding：绑定，交换器和消息队列之间的虚拟连接，绑定中可以包含一个或者多个RoutingKey。
* RoutingKey：路由键，生产者将消息发送给交换器的时候，会发送一个RoutingKey，用来指定路由规则，这样交换器就知道把消息发送到哪个队列。路由键通常为一个“.”分割的字符串，例如“com.rabbitmq”。
* Queue：消息队列，用来保存消息，供消费者消费。


## 代码演示

### 外部依赖

在 pom.xml 文件中添加 RabbitMQ 依赖：

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

### 配置文件

在配置文件 application.yaml 中配置 RabbitMQ 的相关参数，具体内容如下：

```
spring:
  application:
    name: spring-boot-bulking-rabbitmq

  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: guest
    password: guest
```

### 支持自动创建队列

```
@Configuration
public class RabbitMQConfig {

    @Getter
    public static String NEW_USER_TOPIC = "new-user";

    /**
     * 自动创建队列
     */
    @Bean
    public Queue createQueue() {
        return new Queue(NEW_USER_TOPIC, true);
    }
}
```

### 发送消息

```
Long id = Long.valueOf(new Random().nextInt(1000));
User user = User.builder().id(id).userName("TomGE").age(29).address("上海").build();
byte[] useByte = JSON.toJSONString(user).getBytes(StandardCharsets.UTF_8);

// 指定消息类型
MessageProperties props = MessagePropertiesBuilder.newInstance()
        .setContentType(MessageProperties.CONTENT_TYPE_TEXT_PLAIN).build();

rabbitTemplate.send(RabbitMQConfig.NEW_USER_TOPIC, new Message(useByte, props));
```

### 消费消息

```
@RabbitListener(queues = "new-user")
public void onMessage(Message message, Channel channel) throws Exception {
    String s = new String(message.getBody(), StandardCharsets.UTF_8);
    System.out.println("消费内容 : " + s);
    // 提交消息ack
    channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
}
```

## RabbitMQ 控制台

控制台地址：

http://localhost:15672/#/queues

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/12-1.jpg" width="700px">
</div>


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-rabbitmq
```

