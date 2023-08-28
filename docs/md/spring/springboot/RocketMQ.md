---
title: Spring Boot 集成 RocketMQ
---

# Spring Boot 集成 RocketMQ

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`



## 简介

Apache RocketMQ 是阿里开源的一款高性能、高吞吐量的分布式消息中间件。

RocketMQ主要由 Producer、Broker、Consumer 三部分组成，其中Producer 负责生产消息，Consumer 负责消费消息，Broker 负责存储消息。每个 Broker 可以存储多个Topic的消息，每个Topic的消息也可以分片存储于集群中的不同的Broker Group。


> 快速安装：
> <br/> https://rocketmq.apache.org/docs/quick-start/

> 源代码：
> <br/> https://github.com/apache/rocketmq-spring

## 适用场景

1、业务解耦。采用发布订阅模式，生产端发送消息到MQ Server，下游的消费端订阅接收消息。异步形式，系统解耦，提升系统扩展性

2、削峰限流。由于消息中间件的吞吐量很高，过量的请求会暂时放在 MQ server，下游慢慢消费，避免过量请求冲垮系统

3、亿级消息的堆积能力，单个队列中的百万级消息的累积容量。

4、高可用性：Broker服务器支持多Master多Slave的同步双写以及Master多Slave的异步复制模式，其中同步双写可保证消息不丢失。

5、高可靠性：生产者将消息发送到Broker端有三种方式，同步、异步和单向。Broker在对于消息刷盘有两种策略：同步刷盘和异步刷盘，其中同步刷盘可以保证消息成功的存储到磁盘中。消费者的消费模式也有集群消费和广播消费两种，默认集群消费，如果集群模式中消费者挂了，一个组里的其他消费者会接替其消费。

6、分布式事务消息：这里是采用半消息确认和消息回查机制来保证分布式事务消息。

7、支持消息过滤：建议采用消费者业务端的tag过滤

8、支持顺序消息：消息在Broker中是采用队列的`FIFO`模式存储的，也就是发送是顺序的，只要保证消费的顺序性即可。

9、支持定时消息和延迟消息：Broker中由定时消息的机制，消息发送到Broker中，不会立即被Consumer消费，会等到一定的时间才被消费。延迟消息也是一样，延迟一定时间之后才会被Consumer消费。


## 核心组件

1、Namesrv

Namesrv充当路由消息的提供者。Namesrv是一个几乎无状态节点，多个Namesrv实例组成集群，但相互独立，没有信息交换。Namesrv主要作用是：为producer和consumer提供关于topic的路由信息。管理broker节点：监控更新broker的实时状态。路由注册、路由删除（故障剔除）。

2、Broker

负责存储消息、转发消息。Broker是以group为单位提供服务。一个group里面分Master和Slave。Master和Slave存储的数据一样，slave从master同步数据（同步双写或异步复制看配置）。一个Master可以对应多个Slave，一个Slave只能对应一个Master。Master与Slave的对应关系通过指定相同的BrokerName、不同的BrokerId来定义，BrokerId为0表示Master，非0表示Slave。


## 常用术语

1、主题（Topic） 表示一类消息的集合，每个主题包含若干条消息，每条消息只能属于一个主题，是RocketMQ进行消息订阅的基本单位。每个topic可分为若干个分区（queue）

2、生产者组（Producer Group） 同一类Producer的集合，这类Producer发送同一类消息且发送逻辑一致。如果发送的是事务消息且原始生产者在发送之后崩溃，则Broker服务器会联系同一生产者组的其他生产者实例以提交或回溯消费。

3、消费者组（Consumer Group） 同一类Consumer的集合，这类Consumer通常消费同一类消息且消费逻辑一致。消费者组使得在消息消费方面，实现负载均衡和容错的目标变得非常容易。要注意的是，消费者组的消费者实例必须订阅完全相同的Topic。RocketMQ 支持两种消息模式：集群消费（Clustering）和广播消费（Broadcasting）。

4、普通顺序消息（Normal Ordered Message） 普通顺序消费模式下，消费者通过同一个消费队列收到的消息是有顺序的，不同消息队列收到的消息则可能是无顺序的。

5、严格顺序消息（Strictly Ordered Message） 严格顺序消息模式下，消费者收到的所有消息均是有序的。

6、消息（Message） 消息系统所传输信息的物理载体，生产和消费数据的最小单位，每条消息必须属于一个主题。RocketMQ中每个消息拥有唯一的`Message ID`，且可以携带具有业务标识的Key。系统提供了通过Message ID和Key查询消息的功能。

7、标签（Tag） 为消息设置的标志，用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化RocketMQ提供的查询系统。消费者可以根据Tag实现对不同子主题的不同消费逻辑，实现更好的扩展性。


## RocketMQ 特性

* 同步发送
* 异步发送
* 单向方式发送
* 发送有序消息
* 发送批量消息
* 发送事务信息
* 发送延迟消息
* 消费有序消息
* 使用标签或sql92表达式过滤消息
* 支持消息跟踪
* 支持身份验证和授权
* 支持请求-回复消息交换模式
* 消费消息支持推、拉模式



## 代码演示

### 外部依赖

Spring boot 已经为RocketMQ 封装了starter组件，只需在 pom.xml 文件中添加jar版本依赖即可：

```
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
    <version>2.0.3</version>
</dependency>
```

### 配置文件

在配置文件 application.yaml 中配置 RocketMQ 的相关参数，具体内容如下：

```
rocketmq:
  name-server: localhost:9876
  consumer:
    topic: maker-order-topic
    group: my-group1
  producer:
    group: p-my-group1
```

### 消息生产

```
@Resource
private RocketMQTemplate rocketMQTemplate;
private static String makerOrderTopic = "maker-order-topic";

@GetMapping("/send_make_order_message")
public Object send_make_order_message() {
    try {
        Long orderId = Long.valueOf(new Random().nextInt(1000000));
        OrderModel orderModel = OrderModel.builder().orderId(orderId).buyerUid(200000L).amount(26.8).shippingAddress("上海").build();
        SendResult sendResult = rocketMQTemplate.syncSend(makerOrderTopic, orderModel);
        System.out.printf("Send message to topic %s , sendResult=%s %n", makerOrderTopic, sendResult);
        return "消息发送成功";
    } catch (Exception e) {
        e.printStackTrace();
        return "消息发送失败";
    }
}
```

### 消息消费

```
@Service
@RocketMQMessageListener(nameServer = "${rocketmq.name-server}", topic = "${rocketmq.consumer.topic}", consumerGroup = "${rocketmq.consumer.group}")
public class OrderConsumer implements RocketMQListener<OrderModel> {

    @Override
    public void onMessage(OrderModel orderModel) {
        System.out.printf("consumer received message: %s \n", JSON.toJSONString(orderModel));
    }
}
```

### 操作演示

浏览器访问： `http://localhost:9071/send_make_order_message`，模拟生产端发送消息到MQ Server中。

消费端接收消息日志：

```
Send message to topic maker-order-topic , sendResult=SendResult [sendStatus=SEND_OK, msgId=C0A80069816F14DAD5DC73A75B9F0014, offsetMsgId=C0A8006900002A9F0000000000058841, messageQueue=MessageQueue [topic=maker-order-topic, brokerName=192.168.0.105, queueId=2], queueOffset=0] 
consumer received message: {"amount":26.8,"buyerUid":200000,"orderId":895586,"shippingAddress":"上海"} 
```

## 发送类型

### 同步发送

同步发送是指消息发送方发出一条消息后，在收到服务端返回响应后，线程才会执行后续代码

```
OrderModel orderModel = mockOrderModel();
Message message = new Message(makerOrderTopic, "TageA", JSON.toJSONString(orderModel).getBytes());
SendResult sendResult = rocketMQTemplate.getProducer().send(message);
```

### 异步发送

异步发送是指发送方发出一条消息后，不需要等服务端返回响应。异步发送，需要实现异步发送回调接口（SendCallback），通过回调接口接收服务端响应，并处理结果

```
OrderModel orderModel = mockOrderModel();
rocketMQTemplate.asyncSend(makerOrderTopic, orderModel, new SendCallback() {
    @Override
    public void onSuccess(SendResult sendResult) {
        System.out.println("消息发送成功，msgId=" + sendResult.getMsgId());
    }

    @Override
    public void onException(Throwable throwable) {
        System.out.println("发送失败，" + throwable);
    }
});
```

### 顺序消息

对于指定的一个Topic，所有消息根据`Sharding Key`分区。同一个分区内的消息按照严格的FIFO顺序进行发布和消费。`Sharding Key`是顺序消息中用来区分不同分区的关键字段，和普通消息的Key是完全不同的概念。

比如：电商的订单创建，以`订单ID`作为Sharding Key，那么同一个订单相关的消息，如创建订单、付款、发货、订单退款消息、订单物流消息都会按照发布的先后顺序来消费。

```
for (long orderId = 0; orderId < 20; orderId++) {
    String shardingKey = String.valueOf(orderId % 5);
    OrderModel orderModel = OrderModel.builder().orderId(orderId).build();
    SendResult sendResult = rocketMQTemplate.syncSendOrderly(makerOrderTopic, orderModel, shardingKey);
    if (sendResult != null) {
        System.out.println(orderId + " ，发送成功");
    }
}
```

### 延时消息

Producer将消息发送到消息队列RocketMQ服务端，但并不期望立马投递这条消息，而是延迟一定时间后才投递到Consumer进行消费，该消息称为延时消息。

```
OrderModel orderModel = mockOrderModel();
org.springframework.messaging.Message message = MessageBuilder.withPayload(JSON.toJSONString(orderModel).getBytes()).build();
//延时等级 3, 这个消息将在10s之后发送，现在只支持固定的几个时间值
//delayTimeLevel = "1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h";
SendResult sendResult = rocketMQTemplate.syncSend(makerOrderTopic, message, 8000, 3);
```

### 事务消息

RocketMQ提供类似X/Open XA的分布式事务功能，通过消息队列RocketMQ事务消息能达到分布式事务的最终一致。

由于网络闪断、生产者应用重启等原因，导致某条事务消息的二次确认丢失，消息队列RocketMQ服务端通过扫描发现某条消息长期处于“半事务消息”时，主动向生产者查询该消息的最终状态（Commit或Rollback），该过程称之为消息回查。

典型场景：在电商购物车下单时，涉及到购物车系统和交易系统，这两个系统之间的数据最终一致性可以通过分布式事务消息的异步处理实现。在这种场景下，交易系统是最为核心的系统，需要最大限度地保证下单成功。而购物车系统只需要订阅消息队列RocketMQ的交易订单消息，做相应的业务处理，即可保证最终的数据一致性。

**发送步骤：**

* 发送方将半事务消息发送至 MQ Server。
* MQ 服务端将消息持久化成功之后，向发送方返回Ack确认消息已经发送成功，此时消息为半事务消息。
* 发送方开始执行本地事务逻辑
* 发送方根据本地事务执行结果向服务端提交二次确认（Commit或Rollback），服务端收到`Commit`状态则将半事务消息标记为可投递，订阅方将收到该消息；服务端收到`Rollback`状态则删除半事务消息，订阅方不会收到该消息。

**回查步骤：**

* 在断网或者应用重启的特殊情况下，上述步骤4提交的二次确认最终未到达服务端，经过固定时间后服务端将对该消息发起消息回查。
* 发送方收到消息回查后，需要检查对应消息的本地事务执行的最终结果。
* 发送方根据检查得到的本地事务的最终状态再次提交二次确认，服务端仍按照步骤4对半事务消息进行操作。

**发送半事务消息，示例代码如下：**

```
OrderModel orderModel = mockOrderModel();
org.springframework.messaging.Message message = MessageBuilder.withPayload(JSON.toJSONString(orderModel)).build();
TransactionSendResult transactionSendResult = rocketMQTemplate.sendMessageInTransaction("tx_order_message", makerOrderTopic, message, null);
SendStatus sendStatus = transactionSendResult.getSendStatus();
LocalTransactionState localTransactionState = transactionSendResult.getLocalTransactionState();
System.out.println("send message status： " + sendStatus + " ,  localTransactionState： " + localTransactionState);
```
编写`RocketMQLocalTransactionListener`接口实现类，实现执行本地事务和事务回查两个方法。

```
@Component
@RocketMQTransactionListener(txProducerGroup = "tx_order_message")
public class TXProducerListener implements RocketMQLocalTransactionListener {

    @Override
    public RocketMQLocalTransactionState executeLocalTransaction(Message message, Object arg) {
        // 执行本地事务
        System.out.println("TXProducerListener 开始执行本地事务。。。");
        RocketMQLocalTransactionState result;
        try {
            // 模拟业务处理（ 如：创建订单 ）
            // int i = 1 / 0;  //模拟异常
            result = RocketMQLocalTransactionState.COMMIT;  // 成功
        } catch (Exception e) {
            System.out.println("本地事务执行失败。。。");
            result = RocketMQLocalTransactionState.ROLLBACK;
        }
        return result;
    }

    @Override
    public RocketMQLocalTransactionState checkLocalTransaction(Message msg) {
        // 检查本地事务（ 例如检查下订单是否成功 ）
        System.out.println("检查本地事务。。。");
        RocketMQLocalTransactionState result;
        try {
            //模拟业务处理（ 根据检查结果，决定是COMMIT或ROLLBACK ）
            result = RocketMQLocalTransactionState.COMMIT;
        } catch (Exception e) {
            // 异常就回滚
            System.out.println("检查本地事务 error");
            result = RocketMQLocalTransactionState.ROLLBACK;
        }
        return result;
    }

}
```


## 项目源码

```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-rocketmq
```

## 面试考点

### 如何保证顺序消息？

顺序由producer发送到broker的消息队列是满足FIFO的，所以发送是顺序的，单个queue里的消息是顺序的。多个Queue同时消费是无法绝对保证消息的有序性的。所以，同一个topic，同一个queue，发消息的时候一个线程发送消息，消费的时候一个线程去消费一个queue里的消息。

### 怎么保证消息发到同一个queue里？

RocketMQ给我们提供了MessageQueueSelector接口，可以重写里面的接口，实现自己的算法，比如判断i%2==0，那就发送消息到queue1否则发送到queue2。

### 如何实现消息过滤？

有两种方案，一种是在broker端按照Consumer的去重逻辑进行过滤，这样做的好处是避免了无用的消息传输到Consumer端，缺点是加重了Broker的负担，实现起来相对复杂。另一种是在Consumer端过滤，比如按照消息设置的tag去重，这样的好处是实现起来简单，缺点是有大量无用的消息到达了Consumer端只能丢弃不处理。

### 如果由于网络等原因，多条重复消息投递到了Consumer端，你怎么进行消息去重？

这个得先说下消息的幂等性原则：就是用户对于同一种操作发起的多次请求的结果是一样的，不会因为操作了多次就产生不一样的结果。只要保持幂等性，不管来多少条消息，最后处理结果都一样，需要Consumer端自行实现。

去重的方案：因为每个消息都有一个MessageId, 保证每个消息都有一个唯一键，可以是数据库的主键或者唯一约束，也可以是Redis缓存中的键，当消费一条消息前，先检查数据库或缓存中是否存在这个唯一键，如果存在就不再处理这条消息，如果消费成功，要保证这个唯一键插入到去重表中。

### RocketMQ 怎么实现分布式事务消息的？

* Producer向broker发送半消息
* Producer端收到响应，消息发送成功，此时消息是半消息，标记为“不可投递”状态，Consumer消费不了。
* Producer端执行本地事务。
* 正常情况本地事务执行完成，Producer向Broker发送Commit/Rollback，如果是Commit，Broker端将半消息标记为正常消息，Consumer可以消费，如果是Rollback，Broker丢弃此消息。
* 异常情况，Broker端迟迟等不到二次确认。在一定时间后，会查询所有的半消息，然后到Producer端查询半消息的执行情况。
* Producer 端查询本地事务的状态
* 根据事务的状态提交commit/rollback到broker端。

### 从Producer角度分析，如何确保消息成功发送到了Broker？

* 采用同步发送，即发送一条数据等到接受者返回响应之后再发送下一个数据包。如果返回响应OK，表示消息成功发送到了broker，状态超时或者失败都会触发二次重试。MQ Server端会有幂等控制。

* 可以采用分布式事务消息的投递方式。

* 如果一条消息发送之后超时，也可以通过查询日志的API，来检查是否在Broker存储成功。
总的来说，Producer还是采用同步发送来保证的。

### 从Broker角度分析，如何确保消息持久化?

* 消息只要持久化到CommitLog（日志文件）中，即使Broker宕机，未消费的消息也能重新恢复再消费。
* Broker的刷盘机制：同步刷盘和异步刷盘，不管哪种刷盘都可以保证消息一定存储在page cache，但是同步刷盘更可靠，它是Producer发送消息后等数据持久化到磁盘之后再返回响应给Producer。
* Broker支持多Master多Slave同步双写和多Master多Slave异步复制模式，消息都是发送给Master主机，但是消费既可以从Master消费，也可以从Slave消费。同步双写模式可以保证即使Master宕机，消息肯定在Slave中有备份，保证了消息不会丢失。

### 从Consumer角度分析，如何保证消息被成功消费？

Consumer自身维护了个持久化的offset（对应Message Queue里的min offset），用来标记已经成功消费且已经成功发回Broker的消息下标。如果Consumer消费失败，它会向Broker发回消费失败的状态，发回成功才会更新自己的offset。如果发回给broker时broker挂掉了，Consumer会定时重试，如果Consumer和Broker一起挂掉了，消息还在Broker端存储着，Consumer端的offset也是持久化的，重启之后继续拉取offset之前的消息进行消费。

