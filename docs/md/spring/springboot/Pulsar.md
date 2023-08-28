---
title: 为什么放弃 Kafka，选择 Pulsar 
---

# 为什么放弃Kafka，选择Pulsar?

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## Pulsar 介绍

Pulsar 是 Yahoo 在 2013 年创建的，2016年贡献给了 Apache 基金会，目前已经是 Apache 的顶级项目。Yahoo、Verizon、Twitter 等很多公司都在使用 Pulsar 来处理海量消息。

Pulsar 声称比 Kafka 更快、运行成本更低、解决了很多 Kafka 的痛点。

Pulsar 非常灵活，可以像`Kafka` 一样作为分布式日志系统，也可以作为类似`RabbitMQ` 这类简单的消息系统。

Pulsar 有多种订阅类型、传递保障、保存策略。


##  特性

* 内置多租户

不同的团队可以使用同一个集群，互相隔离。支持隔离、认证授权、配额。

* 多层架构

Pulsar 使用特定的数据层来存储 topic 数据，使用了 Apache BookKeeper 作为数据账本。Broker 与存储分离。

使用分隔机制可以解决集群的扩展、再平衡、维护等问题。也提升了可用性，不会丢失数据。

因为使用了多层架构，对于 topic 数量没有限制，topic 与存储是分离的，也可以创建非持久化的 topic。

* 多层存储

Kafka 中存储是很昂贵的，所以很少存储冷数据。Pulsar 使用了多层存储，可以自动把旧数据移动到专门的存储设备，例如 Amazon S3，但是对于客户端来讲是透明的，还可以正常使用。

* Functions

Pulsar Function 是一种部署简单，轻量级计算、对开发人员友好的 API，无需像 Kafka 那样运行自己的流处理引擎。

* 安全

内置了代理、多租户安全机制、可插入的身份验证等功能。

* 快速再平衡

partition 被分为了小块儿，所以再平衡时非常快。

* 多系统集成

例如 Kafka、RabbitMQ 等系统都可以轻松集成。

* 支持多种开发语言

例如 Go、Java、Scala、Node、Python 等等


## 为什么选择 Pulsar

目前业界使用比较多的是 Kafka，主要场景是大数据日志处理，较少用于金融场景。RocketMQ 对 Topic 运营不太友好，特别是不支持按 Topic 删除失效消息，以及不具备宕机 Failover 能力。选 Pulsar 是因为其原生的高一致性，基于 BookKeeper 提供高可用存储服务，采用了存储和服务分离架构方便扩容，同时还支持多种消费模式和多域部署模式。Kafka、RocketMQ 和 Pulsar 的对比如下：

<div align="left">
    <img src="https://offercome.cn/images/spring/springboot/10-1.jpg" width="700px">
</div>

##  代码演示

### 外部依赖

在 `pom.xml` 中添加 `Pulsar` 依赖：

```
<dependency>
    <groupId>org.apache.pulsar</groupId>
    <artifactId>pulsar-client</artifactId>
    <version>2.4.0</version>
</dependency>
```

### 配置文件

在配置文件 `application.yaml`中配置 Pulsar 的相关参数，具体内容如下：

```
pulsar:
  service:
    url: pulsar://127.0.0.1:6650
```

### Producer 发送消息

生产端提供了一个restful接口，模拟发送一条创建新用户消息。

```
Long id = Long.valueOf(new Random().nextInt(1000));
User user = User.builder().id(id).userName("TomGE").age(29).address("上海").build();
userPulsarMsgProducer.send(user);
```

内部通过 `@PostConstruct` 在应用启动时，初始化 `org.apache.pulsar.client.api.Producer` 实例，并交由 Spring 容器统一管理。

```
public void send(T msg) {
    String msgBody = JSON.toJSONString(msg);
    try {
        MessageId messageId = producer.send(msgBody.getBytes(StandardCharsets.UTF_8));
        log.info("pulsar msg send success, topic:{}, messageId:{}, msg:{}", getTopic(), messageId, msgBody);
    } catch (Throwable e) {
        log.error("pulsar msg send failed, topic:{}, msg:{}", getTopic(), msgBody);
    }
}
```

### Producer 发送延迟消息

适用于一些有`延迟处理`要求的业务场景，比如电商交易的`自动确认收货`，在卖家发出货品后，有15天的观察期，这期间如果买家没有发起逆向流程/申请退款，将会由系统自动触发`超时确认收货`。

不同业务场景，设定不同的延迟时间值，可以让消费端在延迟指定时间后才能拉取到消息并进行消费。借助于该框架特性，有效节省开发成本和难度。

```
producer.newMessage().deliverAfter(delay, unit)
        .value(msgBody.getBytes(StandardCharsets.UTF_8))
        .send();
```

### Consumer 消费消息

系统启动时，自动创建 consumer 消费实例，并埋入 `org.apache.pulsar.client.api.MessageListener` 接口实现，用于具体的消息消费处理逻辑。

```
@PostConstruct
void init() throws PulsarClientException {
    consumer = client.createConsumer(getTopic(), getSubscriptionName(), new DefaultJsonMsgListener());
}

 class DefaultJsonMsgListener implements MessageListener<byte[]> {

        @Override
        public void received(Consumer<byte[]> consumer, Message<byte[]> message) {
            if (null != message && null != message.getData() && message.getData().length != 0) {
                String msgBody = new String(message.getValue(), StandardCharsets.UTF_8);

                log.warn("topic:{} receive message:{}", getTopic(), msgBody);
                try {
                    T msg = JSON.parseObject(msgBody, clazzT);
                    handleMsg(msg);
                } catch (Exception e) {
                    log.error("handle msg failed, topic:{}, message:{}", getTopic(), msgBody, e);
                    return;
                }
            }

            try {
                // 提交消费位移
                consumer.acknowledge(message);
            } catch (PulsarClientException e) {
                log.error("topic:{} ack failed", getTopic(), e);
            }
        }
    }
```


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-pulsar
```

