---
title: 第十五篇：RocketMQ ！顺序消费、堆积、事务、死信队列
---

# RocketMQ 那点破事！顺序消费、堆积、事务、死信队列

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



## 消息队列主要用途？<br /><br />
答案：<br />**1、解耦**：引入消息队列之前，下单完成之后，需要订单服务去调用库存服务减库存，调用营销服务加营销数据。引入消息队列之后，可以把订单完成的消息丢进队列里，下游服务自己去调用就行了，这样就完成了订单服务和其它服务的解耦合。<br />**2、异步：**订单支付之后，我们要扣减库存、增加积分、发送消息等等，这样一来这个链路就长了，链路一长，响应时间就变长了。引入消息队列，除了更新订单状态，其它的都可以**异步**去做，这样一来就来，就能降低响应时间。<br />**3、削峰**：消息队列合一用来削峰，例如秒杀系统，平时流量很低，但是要做秒杀活动，秒杀的时候流量疯狂怼进来，我们的服务器，Redis，MySQL各自的承受能力都不一样，直接全部流量照单全收肯定有问题啊，严重点可能直接打挂了。

## RocketMQ 是什么？<br /><br />
答案：<br />RocketMQ 是阿里巴巴开源的分布式消息中间件。支持事务消息、顺序消息、批量消息、定时消息、消息回溯等。它里面有几个区别于标准消息中件间的概念，如 Group、Topic、Queue等。系统组成则由Producer、Consumer、Broker、NameServer等。<br />**RocketMQ 特点：**

- 是一个队列模型的消息中间件，具有高性能、高可靠、高实时、分布式等特点
- Producer、Consumer、队列都可以分布式
- Producer 向一些队列轮流发送消息，队列集合称为 Topic，Consumer 如果做广播消费，则一个Consumer 实例消费这个 Topic 对应的所有队列，如果做集群消费，则多个 Consumer 实例平均消费这个 Topic 对应的队列集合
- 能够保证严格的消息顺序
- 支持拉（pull）和推（push）两种消息模式
- 高效的订阅者水平扩展能力
- 实时的消息订阅机制
- 亿级消息堆积能力
- 支持多种消息协议，如 JMS、OpenMessaging 等
- 较少的依赖

## RocketMQ 由哪些角色组成？<br /><br />
答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656165-e02fb10f-d8e3-4214-b48a-82cb6f87fb19.png#clientId=u906d7666-b438-4&from=paste&id=u14af0882&originHeight=446&originWidth=1386&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u808145ac-8ab5-4146-b596-2e5d6fb993b&title=)

**1、NameServer**<br />NameServer 是一个无状态的服务器，角色类似于 Kafka使用的 Zookeeper，但比 Zookeeper 更轻量。 **特点：**

- 每个 NameServer 结点之间是相互独立，彼此没有任何信息交互。
- Nameserver 被设计成几乎是无状态的，通过部署多个结点来标识自己是一个伪集群，Producer 在发送消息前从 NameServer 中获取 Topic 的路由信息也就是发往哪个 Broker，Consumer 也会定时从 NameServer 获取 Topic 的路由信息，Broker 在启动时会向 NameServer 注册，并定时进行心跳连接，且定时同步维护的 Topic 到 NameServer。

功能主要有两个：

- 1、和Broker 结点保持长连接。
- 2、维护 Topic 的路由信息。

**2、Broker**<br />消息存储和中转角色，负责存储和转发消息。

- Broker 内部维护着一个个 Consumer Queue，用来存储消息的索引，真正存储消息的地方是 CommitLog（日志文件）。

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656261-47f42fb3-315f-4a89-8f4a-a00954253795.png#clientId=u906d7666-b438-4&from=paste&id=u4dee2c71&originHeight=847&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubad68c61-8e5e-4f1e-b4e8-fe9f50b34b5&title=)<br />单个 Broker 与所有的 Nameserver 保持着长连接和心跳，并会定时将 Topic 信息同步到 NameServer，和 NameServer 的通信底层是通过 Netty 实现的。

**3、Producer**<br />消息生产者，业务端负责发送消息，由用户自行实现和分布式部署。

- **Producer**由用户进行分布式部署，消息由**Producer**通过多种负载均衡模式发送到**Broker**集群，发送低延时，支持快速失败。
- **RocketMQ** 提供了三种方式发送消息：同步、异步和单向
   - **单向发送**：单向发送是指只负责发送消息而不等待服务器回应且没有回调函数触发，适用于某些耗时非常短但对可靠性要求并不高的场景，例如日志收集。
   - **同步发送**：同步发送指消息发送方发出数据后会在收到接收方发回响应之后才发下一个数据包。一般用于重要通知消息，例如重要通知邮件、营销短信。
   - **异步发送**：异步发送指发送方发出数据后，不等接收方发回响应，接着发送下个数据包，一般用于可能链路耗时较长而对响应时间敏感的业务场景，例如用户视频上传后通知启动转码服务。

**4、Consumer**<br />消息消费者，负责消费消息，一般是后台系统负责异步消费。

- **Consumer**也由用户部署，支持PUSH和PULL两种消费模式，支持**集群消费**和**广播消费**，提供**实时的消息订阅机制**。
- **Pull**：拉取型消费者（Pull Consumer）主动从消息服务器拉取信息，只要批量拉取到消息，用户应用就会启动消费过程，所以 Pull 称为主动消费型。
- **Push**：推送型消费者（Push Consumer）封装了消息的拉取、消费进度和其他的内部维护工作，将消息到达时执行的回调接口留给用户应用程序来实现。所以 Push 称为被动消费类型，但其实从实现上看还是从消息服务器中拉取消息，不同于 Pull 的是 Push 首先要注册消费监听器，当监听器处触发后才开始消费消息。

## **RocketMQ的工作流程？**<br /><br />
答案：<br />RocketMQ 是一个分布式消息队列，也就是消息队列+分布式系统。<br />它主要的工作流程：RocketMQ由NameServer注册中心集群、Producer生产者集群、Consumer消费者集群和若干Broker（RocketMQ进程）组成：

1. Broker 在启动的时候去向所有的NameServer注册，并保持长连接，每30s发送一次心跳
2. Producer 在发送消息的时候从NameServer获取 Broker 服务器地址，根据负载均衡算法选择一台服务器来发送消息
3. Conusmer 消费消息的时候同样从 NameServer 获取Broker地址，然后主动拉取消息来消费

## **消息队列有哪些消息模型？**<br /><br />
答案：<br />**1、队列模型**<br />这是最初的一种消息队列模型，对应着消息队列“发-存-收”的模型。生产者往某个队列里面发送消息，一个队列可以存储多个生产者的消息，一个队列也可以有多个消费者，但是消费者之间是竞争关系，也就是说每条消息只能被一个消费者消费。

**2、发布/订阅模型**<br />消息的发送方称为发布者（Publisher），消息的接收方称为订阅者（Subscriber），服务端存放消息的容器称为主题（Topic）。发布者将消息发送到主题中，订阅者在接收消息之前需要先“订阅主题”。“订阅”在这里既是一个动作，同时还可以认为是主题在消费时的一个逻辑副本，每份订阅中，订阅者都可以接收到主题的所有消息。

## **RocketMQ 消息模型？**<br /><br />
答案：<br />RocketMQ 的消息模型是标准的发布-订阅模型，核心组成部分：

- **Message**

**Message**（消息）就是要传输的信息。一条消息必须有一个主题（Topic），主题可以看做是你的信件要邮寄的地址。一条消息也可以拥有一个可选的标签（Tag）和额处的键值对，它们可以用于设置一个业务 Key 并在 Broker 上查找此消息以便在开发期间查找问题。

- **Topic**

**Topic**（主题）可以看做消息的归类，它是消息的第一级类型。比如一个电商系统可以分为：交易消息、物流消息等，一条消息必须有一个 Topic 。<br />**Topic** 与生产者和消费者的关系非常松散，一个 Topic 可以有0个、1个、多个生产者向其发送消息，一个生产者也可以同时向不同的 Topic 发送消息。一个 Topic 也可以被 0个、1个、多个消费者订阅。

- **Tag**

**Tag**（标签）可以看作子主题，它是消息的第二级类型，用于为用户提供额外的灵活性。使用标签，同一业务模块不同目的的消息就可以用相同 Topic 而不同的 **Tag** 来标识。比如交易消息又可以分为：交易创建消息、交易完成消息等，一条消息可以没有 **Tag** 。<br />标签有助于保持你的代码干净和连贯，并且还可以为 **RocketMQ** 提供的查询系统提供帮助。

- **Group**

订阅者的概念是通过消费组（Consumer Group）来体现的。每个消费组都消费主题中一份完整的消息，不同消费组之间消费进度彼此不受影响，也就是说，一条消息被Consumer Group1消费过，也会给Consumer Group2消费。<br />消费组中包含多个消费者，同一个组内的消费者是竞争消费的关系，每个消费者负责消费组内的一部分消息。默认情况，如果一条消息被消费者Consumer1消费了，那同组的其他消费者就不会再收到这条消息。

- **Message Queue**

消息队列，一个 Topic 下可以设置多个消息队列 Message Queue ，如果一个 Consumer 需要获取 Topic下所有的消息，就要遍历所有的 Message Queue。

- **Offset**

在Topic的消费过程中，由于消息需要被不同的组进行多次消费，所以消费完的消息并不会立即被删除，这就需要RocketMQ为每个消费组在每个队列上维护一个消费位移（Consumer Offset），这个位置之前的消息都被消费过，之后的消息都没有被消费过，每成功消费一条消息，消费位置就加一。<br />也可以这么说，Queue 是一个长度无限的数组，**Offset** 就是下标。

## RocketMQ消费消息是push还是pull？<br /><br />
答案：<br />RocketMQ没有真正意义的push，都是pull，虽然有push类，但实际底层实现采用的是长轮询机制，即拉取方式

> broker端属性 longPollingEnable 标记是否开启长轮询。默认开启

## 为什么要主动拉取消息而不是事件监听方式？

答案：<br />事件驱动方式是建立好长连接，由事件（发送数据）的方式来实时推送。<br />如果broker主动推送消息的话有可能push速度快，消费速度慢的情况，那么就会造成消息在consumer端堆积过多，同时又不能被其他consumer消费的情况。而pull的方式可以根据当前自身情况来拉取，不会造成过多的压力而造成瓶颈，所以采取了pull的方式。

## RocketMQ 如何保证消息的顺序消费？<br /><br />
答案：<br />首先多个queue只能保证单个queue里的顺序，queue是典型的 FIFO，天然顺序。多个queue同时消费是无法绝对保证消息的有序性。<br />所以总结如下：同一topic，同一个QUEUE，发消息的时候一个线程去发送消息，消费的时候一个线程去消费一个queue里的消息。

## RocketMQ 如何保证消息不丢失？

答案：<br />首先在如下三个部分都可能会出现丢失消息的情况：

- Producer端
- Broker端
- Consumer端 



**1 、Producer端如何保证消息不丢失**

- 采取send()同步发消息，发送结果是同步感知的。
- 发送失败后可以重试，设置重试次数。默认3次。
- 集群部署，比如发送失败了的原因可能是当前Broker宕机了，重试的时候会发送到其他Broker上。 

**2、Broker端如何保证消息不丢失**

- 修改刷盘策略为同步刷盘。默认情况下是异步刷盘的
- 集群部署，主从模式，高可用

**3、Consumer端如何保证消息不丢失**

- 完全消费正常后在进行手动ack确认

## RocketMQ 消息堆积如何处理？

 答案：<br />首先要找到是什么原因导致的消息堆积，是Producer太多了，Consumer太少了导致的还是说其他情 况，总之先定位问题。<br />然后看下消息消费速度是否正常，正常的话，可以通过上线更多consumer临时解决消息堆积问题 

## **如何实现消息过滤？**<br /><br />
答案：<br />有两种方案：

- 一种是在 Broker 端按照 Consumer 的去重逻辑进行过滤，这样做的好处是避免了无用的消息传输到 Consumer 端，缺点是加重了 Broker 的负担，实现起来相对复杂。
- 另一种是在 Consumer 端过滤，比如按照消息设置的 tag 去重，这样的好处是实现起来简单，缺点是有大量无用的消息到达了 Consumer 端只能丢弃不处理。

> 一般采用Cosumer端过滤，如果希望提高吞吐量，可以采用Broker过滤。


**消息过滤有三种方式：**<br />1、根据Tag过滤：这是最常见的一种，用起来高效简单
```
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("CID_EXAMPLE");
consumer.subscribe("TOPIC", "TAGA || TAGB || TAGC");
```
2、SQL 表达式过滤：SQL表达式过滤更加灵活
```
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("please_rename_unique_group_name_4");
// 只有订阅的消息有这个属性a, a >=0 and a <= 3
consumer.subscribe("TopicTest", MessageSelector.bySql("a between 0 and 3");
consumer.registerMessageListener(new MessageListenerConcurrently() {
   @Override
   public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
       return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
   }
});
consumer.start();
```

- Filter Server 方式：最灵活，也是最复杂的一种方式，允许用户自定义函数进行过滤

## 什么是**延时消息？**<br /><br />
答案：<br />延时消息在电商场景中应用的较多，用户提交了一个订单，就可以发送一个延时消息，30 分钟后去检查这个订单的状态，如果还是未付款就取消订单。<br />RocketMQ是支持延时消息的，只需要在生产消息的时候设置消息的延时级别：
```
// 实例化一个生产者来产生延时消息
DefaultMQProducer producer = new DefaultMQProducer("ExampleProducerGroup");
// 启动生产者
producer.start();
int totalMessagesToSend = 100;
for (int i = 0; i < totalMessagesToSend; i++) {
    Message message = new Message("TestTopic", ("Hello scheduled message " + i).getBytes());
    // 设置延时等级3,这个消息将在10s之后发送(现在只支持固定的几个时间,详看delayTimeLevel)
    message.setDelayTimeLevel(3);
    // 发送消息
    producer.send(message);
}
```

RocketMQ支持的延时级别：
```
private String messageDelayLevel = "1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h";
```

## **如何实现延时消息？**

答案：<br />临时存储+定时任务。<br />Broker收到延时消息了，会先发送到主题（SCHEDULE_TOPIC_XXXX）的相应时间段的Message Queue中，然后通过一个定时任务轮询这些队列，到期后，把消息投递到目标Topic的队列中，然后消费者就可以正常消费这些消息。

## **事务消息是如何实现？**<br /><br />
答案：

- 1、生产者先发送一条半事务消息到MQ
- 2、MQ收到消息后返回ack确认
- 3、生产者开始执行本地事务
- 4、if 本地事务执行成功，发送commit到MQ；失败，发送rollback
- 5、如果MQ⻓时间未收到生产者的二次确认commit或rollback，MQ对生产者发起反向回查
- 6、生产者查询事务执行最终状态
- 7、根据查询事务状态，再次提交二次确认



![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656232-97a80908-f98e-4223-a1f1-5d81a0af5355.png#clientId=u906d7666-b438-4&from=paste&id=u215c645e&originHeight=403&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud6dd0f84-98c0-4884-a59f-26b4c179c9f&title=)

## 如果Consumer和Queue不对等，上线了多台短时间内无法消费完堆积的消息怎么办？<br /><br />
答案：

- 准备一个临时的topic，queue的数量是堆积的几倍，queue分布到多台 Broker中
- 上线一台Consumer做消息的搬运工，把原来Topic中的消息挪到新的Topic里，不做业务逻辑处 理，只是挪过去
- 上线N台Consumer同时消费临时Topic中的数据
- 改bug
- 恢复原来的Consumer，继续消费之前的Topic 

## 堆积时间过长消息超时了？<br /><br />
答案：<br />RocketMQ中的消息只会在commitLog被删除的时候才会消失，不会超时。<br />也就是说未被消费的消息不会存在超时删除这情况。

## 什么是死信队列？<br /><br />
答案：<br />死信队列用于处理无法被正常消费的消息，即死信消息。<br />当一条消息初次消费失败，**消息队列 RocketMQ 会自动进行消息重试**；达到最大重试次数后，若消费依然失败，则表明消费者在正常情况下无法正确地消费该消息，此时，消息队列 RocketMQ 不会立刻将消息丢弃，而是将其发送到该**消费者对应的特殊队列中**，该特殊队列称为**死信队列**。<br />**死信消息的特点**：

- 不会再被消费者正常消费。
- 有效期与正常消息相同，均为 3 天，3 天后会被自动删除。因此，需要在死信消息产生后的 3 天内及时处理。

**死信队列的特点**：

- 一个死信队列对应一个 Group ID， 而不是对应单个消费者实例。
- 如果一个 Group ID 未产生死信消息，消息队列 RocketMQ 不会为其创建相应的死信队列。
- 一个死信队列包含了对应 Group ID 产生的所有死信消息，不论该消息属于哪个 Topic。


> RocketMQ 控制台提供对死信消息的查询、导出和重发的功能。

## 堆积的消息会不会进死信队列？<br /><br />
答案：<br />不会，消息在消费失败后会进入重试队列（%RETRY%+ConsumerGroup）

## **Broker 如何保存数据？**<br /><br />
答案：<br />RocketMQ主要的存储文件包括CommitLog文件、ConsumeQueue文件、Indexfile文件。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656121-7f0ae4b5-5441-4833-bd94-1d8510069f68.png#clientId=u906d7666-b438-4&from=paste&id=u4aab1402&originHeight=352&originWidth=1060&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1989178c-f7eb-4f26-b4ca-f8e8836cfd4&title=)<br />消息存储的整体的设计：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656130-12819301-26f3-4138-816e-980e23d6a0bb.png#clientId=u906d7666-b438-4&from=paste&id=u12c01b6c&originHeight=847&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u73bf9c27-711a-47a6-b870-46579e3f025&title=)

- **CommitLog**：消息主体以及元数据的存储主体，存储Producer端写入的消息主体内容，消息内容不是定长的。单个文件大小默认1G, 文件名长度为20位，左边补零，剩余为起始偏移量，比如00000000000000000000代表了第一个文件，起始偏移量为0，文件大小为1G=1073741824；当第一个文件写满了，第二个文件为00000000001073741824，起始偏移量为1073741824，以此类推。消息主要是顺序写入日志文件，当文件满了，写入下一个文件。

<br /> CommitLog文件保存于${Rocket_Home}/store/commitlog目录中，从图中我们可以明显看出来文件名的偏移量，每个文件默认1G，写满后自动生成一个新的文件。

![](https://cdn.nlark.com/yuque/0/2022/jpeg/21503536/1666968656668-a3400414-f6ff-41a5-b252-a46cd9fb0e20.jpeg#clientId=u906d7666-b438-4&from=paste&height=99&id=uc43ad7eb&originHeight=162&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1354a7ef-9c5d-4195-84f6-2c32274341b&title=&width=662)

- **ConsumeQueue**：消息消费队列，引入的目的主要是提高消息消费的性能，由于RocketMQ是基于主题topic的订阅模式，消息消费是针对主题进行的，如果要遍历commitlog文件中根据topic检索消息是非常低效的。

<br /> Consumer即可根据ConsumeQueue来查找待消费的消息。其中，ConsumeQueue（逻辑消费队列）作为消费消息的索引，保存了指定Topic下的队列消息在CommitLog中的起始物理偏移量offset，消息大小size和消息Tag的HashCode值。

 ConsumeQueue文件可以看成是基于Topic的CommitLog索引文件，故ConsumeQueue文件夹的组织方式如下：topic/queue/file三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样ConsumeQueue文件采取定长设计，每一个条目共20个字节，分别为8字节的CommitLog物理偏移量、4字节的消息长度、8字节tag hashcode，单个文件由30W个条目组成，可以像数组一样随机访问每一个条目，每个ConsumeQueue文件大小约5.72M；

![](https://cdn.nlark.com/yuque/0/2022/jpeg/21503536/1666968656671-bb3c2e14-18ad-4431-b163-a255665950a7.jpeg#clientId=u906d7666-b438-4&from=paste&height=186&id=u7aabdd48&originHeight=328&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u96efeeec-2dc7-46fe-91ee-7ba0c7d96a5&title=&width=613)

- **IndexFile**：IndexFile（索引文件）提供了一种可以通过key或时间区间来查询消息的方法。Index文件的存储位置是：{fileName}，文件名fileName是以创建时的时间戳命名的，固定的单个IndexFile文件大小约为400M，一个IndexFile可以保存 2000W个索引，IndexFile的底层存储设计为在文件系统中实现HashMap结构，故RocketMQ的索引文件其底层实现为hash索引。

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656748-8dc98443-cac1-411f-bbd7-bcd34002a261.png#clientId=u906d7666-b438-4&from=paste&id=ubb86abf0&originHeight=483&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua38b32d6-67dd-4e7b-9e66-8e3c4bf13ae&title=)

总结一下：RocketMQ采用的是混合型的存储结构，即为Broker单个实例下所有的队列共用一个日志数据文件（即为CommitLog）来存储。<br />RocketMQ的混合型存储结构(多个Topic的消息实体内容都存储于一个CommitLog中)针对Producer和Consumer分别采用了数据和索引部分相分离的存储结构，Producer发送消息至Broker端，然后Broker端使用同步或者异步的方式对消息刷盘持久化，保存至CommitLog中。<br />只要消息被刷盘持久化至磁盘文件CommitLog中，那么Producer发送的消息就不会丢失。正因为如此，Consumer也就肯定有机会去消费这条消息。当无法拉取到消息后，可以等下一次消息拉取，同时服务端也支持长轮询模式，如果一个消息拉取请求未拉取到消息，Broker允许等待30s的时间，只要这段时间内有新消息到达，将直接返回给消费端。<br />这里，RocketMQ的具体做法是，使用Broker端的后台服务线程—ReputMessageService不停地分发请求并异步构建ConsumeQueue（逻辑消费队列）和IndexFile（索引文件）数据。

## **RocketMQ 如何对文件进行读写？**

答案：<br />RocketMQ对文件的读写巧妙地利用了操作系统的一些高效文件读写方式——PageCache、顺序读写、零拷贝。

**1、PageCache、顺序读取**<br />在RocketMQ中，ConsumeQueue逻辑消费队列存储的数据较少，并且是顺序读取，在page cache机制的预读取作用下，Consume Queue文件的读性能几乎接近读内存，即使在有消息堆积情况下也不会影响性能。而对于CommitLog消息存储的日志数据文件来说，读取消息内容时候会产生较多的随机访问读取，严重影响性能。如果选择合适的系统IO调度算法，比如设置调度算法为“Deadline”（此时块存储采用SSD的话），随机读的性能也会有所提升。<br />页缓存（PageCache)是OS对文件的缓存，用于加速对文件的读写。一般来说，程序对文件进行顺序读写的速度几乎接近于内存的读写速度，主要原因就是由于OS使用PageCache机制对读写访问操作进行了性能优化，将一部分的内存用作PageCache。对于数据的写入，OS会先写入至Cache内，随后通过异步的方式由pdflush内核线程将Cache内的数据刷盘至物理磁盘上。对于数据的读取，如果一次读取文件时出现未命中PageCache的情况，OS从物理磁盘上访问读取文件的同时，会顺序对其他相邻块的数据文件进行预读取。

**2、零拷贝**<br />另外，RocketMQ主要通过MappedByteBuffer对文件进行读写操作。其中，利用了NIO中的FileChannel模型将磁盘上的物理文件直接映射到用户态的内存地址中（这种Mmap的方式减少了传统IO，将磁盘文件数据在操作系统内核地址空间的缓冲区，和用户应用程序地址空间的缓冲区之间来回进行拷贝的性能开销），将对文件的操作转化为直接对内存地址进行操作，从而极大地提高了文件的读写效率（正因为需要使用内存映射机制，故 RocketMQ的文件存储都使用定长结构来存储，方便一次将整个文件映射至内存）。

## **什么是零拷贝?**<br /><br />
答案<br />在操作系统中，使用传统的方式，数据需要经历几次拷贝，还要经历用户态/内核态切换。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656749-a5ba0f1c-6693-4510-9109-d01a074fe3a7.png#clientId=u906d7666-b438-4&from=paste&height=390&id=u5424263a&originHeight=568&originWidth=914&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueaa8def1-403f-4555-a8b2-5ae53624b57&title=&width=628)

1. 从磁盘复制数据到内核态内存；
2. 从内核态内存复制到用户态内存；
3. 然后从用户态内存复制到网络驱动的内核态内存；
4. 最后是从网络驱动的内核态内存复制到网卡中进行传输。

所以，可以通过零拷贝的方式，**减少用户态与内核态的上下文切换**和**内存拷贝的次数**，用来提升I/O的性能。零拷贝比较常见的实现方式是**mmap**，这种机制在Java中是通过MappedByteBuffer实现的。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666968656772-92017037-26fd-4409-a28a-154dffc2a6b2.png#clientId=u906d7666-b438-4&from=paste&height=410&id=u57975f3c&originHeight=587&originWidth=925&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u888c25ef-9145-4844-ad2c-0ba5d25c4e2&title=&width=646)

## RocketMQ 消息**刷盘机制？**<br /><br />
答案：<br />RocketMQ提供了两种刷盘策略：同步刷盘和异步刷盘

- 同步刷盘：在消息达到Broker的内存之后，必须刷到commitLog日志文件中才算成功，然后返回Producer数据已经发送成功。
- 异步刷盘：异步刷盘是指消息达到Broker内存后就返回Producer数据已经发送成功，会唤醒一个线程去将数据持久化到CommitLog日志文件中。

## **RocketMQ 消息长轮询内部实现？**<br /><br />
答案：<br />所谓的长轮询，就是Consumer 拉取消息，如果对应的 Queue 如果没有数据，Broker 不会立即返回，而是把 PullReuqest hold起来，等待 queue 有了消息后，或者长轮询阻塞时间到了，再重新处理该 queue 上的所有 PullRequest。

- PullMessageProcessor#processRequest
```
//如果没有拉到数据
case ResponseCode.PULL_NOT_FOUND:
    // broker 和 consumer 都允许 suspend，默认开启
    if (brokerAllowSuspend && hasSuspendFlag) {
        long pollingTimeMills = suspendTimeoutMillisLong;
        if (!this.brokerController.getBrokerConfig().isLongPollingEnable()) {
            pollingTimeMills = this.brokerController.getBrokerConfig().getShortPollingTimeMills();
        }

        String topic = requestHeader.getTopic();
        long offset = requestHeader.getQueueOffset();
        int queueId = requestHeader.getQueueId();
        //封装一个PullRequest
        PullRequest pullRequest = new PullRequest(request, channel, pollingTimeMills,
                this.brokerController.getMessageStore().now(), offset, subscriptionData, messageFilter);
        //把PullRequest挂起来
        this.brokerController.getPullRequestHoldService().suspendPullRequest(topic, queueId, pullRequest);
        response = null;
        break;
    }
```
挂起的请求，有一个服务线程会不停地检查，看queue中是否有数据，或者超时。

- PullRequestHoldService#run()
```
@Override
public void run() {
    log.info("{} service started", this.getServiceName());
    while (!this.isStopped()) {
        try {
            if (this.brokerController.getBrokerConfig().isLongPollingEnable()) {
                this.waitForRunning(5 * 1000);
            } else {
                this.waitForRunning(this.brokerController.getBrokerConfig().getShortPollingTimeMills());
            }

            long beginLockTimestamp = this.systemClock.now();
            //检查hold住的请求
            this.checkHoldRequest();
            long costTime = this.systemClock.now() - beginLockTimestamp;
            if (costTime > 5 * 1000) {
                log.info("[NOTIFYME] check hold request cost {} ms.", costTime);
            }
        } catch (Throwable e) {
            log.warn(this.getServiceName() + " service has exception. ", e);
        }
    }

    log.info("{} service end", this.getServiceName());
}
```

## 为什么自研 nameserver 而不用 zk？<br /><br />
答案：<br />1、RocketMQ 只需要一个轻量级的维护元数据信息的组件，为此引入zk 增加维护成本还强依赖另一个中间件。<br />2、RocketMQ 追求的是 AP，而不是CP，也就是需要高可用。

- zk是CP，因为zk节点间通过zap协议有数据共享，每个节点数据会一致，但是zk集群当挂了一半以上的节点就没法使用了。
- nameserver是 AP，节点间不通信，这样会导致节点间数据信息会发生短暂的不一致。但每个broker都会定时向所有nameserver 上报路由信息和心跳。当某个broker下线了，nameserver也会延时30s才知道，而且不会通知客户端（生产和消费者），只能靠客户端自己来拉，RocketMQ 是靠消息重试机制解决这个问题，所以是最终一致性。

> nameserver集群只要有一个节点存活就可以保证 RocketMQ 集群可用





