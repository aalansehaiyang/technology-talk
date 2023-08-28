---
title: 第十四篇：Kafka ！分区、副本、消费组、高可靠性
---

# Kafka 那点破事！分区、副本、消费组、高可靠性

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



## **Kafka 是什么？**

答案：<br />Kafka 是一个分布式的流式处理平台，它以高吞吐、可持久化、可水平扩展、支持流数据处理等多种特性而被广泛使用<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942521-1e262f78-d331-4349-9e0c-45714524ad8a.png#clientId=ua41a3794-5c73-4&from=paste&height=209&id=ua0ed81c5&originHeight=459&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4e87f618-00df-4e04-a78f-3ad31d2f9ca&title=&width=491)<br />主要功能体现于三点：

- **消息系统**：kafka与传统的消息中间件都具备**系统解耦、冗余存储、流量削峰、缓冲、异步通信、扩展性、可恢复性**等功能。与此同时，kafka还提供了大多数消息系统难以实现的消息顺序性保障及回溯性消费的功能。
- **存储系统**：kafka把**消息持久化到磁盘**，相比于其他基于内存存储的系统而言，有效的降低了消息丢失的风险。这得益于其消息持久化和多副本机制。也可以将kafka作为长期的存储系统来使用，只需要把对应的数据保留策略设置为“永久”或启用主题日志压缩功能。
- **流式处理平台**：kafka为流行的流式处理框架提供了可靠的数据来源，还提供了一个完整的流式处理框架，比如窗口、连接、变换和聚合等各类操作。

## **Kafka 核心架构？**<br /><br />
答案：<br />一个典型的 kafka 体系架构包括若干 **Producer**、若干 **Consumer**、以及一个 **Zookeeper** 集群（在2.8.0版本中移，除了 Zookeeper，通过 **KRaft** 进行自己的集群管理）<br />Producer 将消息发送到 Broker，Broker 负责将受到的消息存储到磁盘中，而 Consumer 负责从 Broker 订阅并消费消息。<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942546-3b9a01af-9570-429e-8c6a-bc2a26148816.png#clientId=ua41a3794-5c73-4&from=paste&height=363&id=u1ac1f286&originHeight=658&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue64094f7-fef5-4b48-9016-7218229abd2&title=&width=595)

**Kafka 名词术语，一网打尽：**

- **Producer** ：生产者，负责将消息发送到 Broker
- **Consumer** ：消费者，从 Broker 接收消息
- **Consumer Group** ：消费者组，由**多个 Consumer 组成**。消费者组内每个消费者负责消费不同分区的数据，**一个分区只能由一个组内消费者消费**；消费者组之间互不影响。所有的消费者都属于某个消费者组，即消费者组是逻辑上的一个订阅者。
- **消费者位移**：Consumer Offset。表示消费者消费进度，每个消费者都有自己的消费者位移。offset保存在broker端的内部topic中，不是在clients中保存
- **Broker** ：可以看做一个独立的 **Kafka 服务节点或 Kafka 服务实例**。如果一台服务器上只部署了一个 Kafka 实例，那么我们也可以将 Broker 看做一台 Kafka 服务器。
- **Topic** ：一个逻辑上的概念，包含很多 Partition，**同一个 Topic 下的 Partiton 的消息内容是不相同的**。
- **Partition** ：为了实现扩展性，一个非常大的 topic **可以分布到多个 broker 上，一个 topic 可以分为多个 partition**，每个 partition 是一个有序的队列。
- **消息**：这里的消息就是指 Kafka 处理的主要对象。
- **消息位移**：Offset。表示分区中每条消息的位置信息，是一个单调递增且不变的值。
- **Replica** ：副本，**同一分区的不同副本保存的是相同的消息**，为保证集群中的某个节点发生故障时，该节点上的 partition 数据不丢失，且 kafka 仍然能够继续工作，kafka 提供了副本机制，一个 topic 的每个分区都有若干个副本，一个 leader 和若干个 follower。
- **Leader** ：每个分区的多个副本中的"主副本"，**生产者以及消费者只与 Leader 交互**。
- **Follower** ：每个分区的多个副本中的"从副本"，**负责实时从 Leader 中同步数据，保持和 Leader 数据的同步**。Leader 发生故障时，从 Follower 副本中重新选举新的 Leader 副本对外提供服务。
- **重平衡**：Rebalance。消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区

## 如何保证高可用？<br /><br />
答案：<br />在 Kafka 0.8 以后，提供了 HA 机制，就是 replica 副本机制。每个 partition 上的数据都会同步到其它机器，形成自己的多个 replica 副本。所有 replica 会选举一个 leader 出来，消息的生产者和消费者都跟这个 leader 打交道，其他 replica 作为 follower 。写的时候， leader 会负责把数据同步到所有 follower 上去，读的时候就直接读 leader 上的数据即可。 Kafka 负责均匀的将一个 partition 的所有 replica 分布在不同的机器上，这样才可以提高容错性。<br />拥有了 replica 副本机制，如果某个 broker 宕机了，这个 broker 上的 partition 在其他机器上还存在副本。如果这个宕机的 broker 上面有某个 partition 的 leader ，那么此时会从其follower 中重新选举一个新的 leader 出来，由这个新 leader 继续提供读写服务，从而达到了所谓的高可用性。 <br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942538-22430d80-14e5-4bcb-affe-e151d06f9332.png#clientId=ua41a3794-5c73-4&from=paste&height=337&id=u784d93ba&originHeight=660&originWidth=1286&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5ff74075-b1e7-4af2-9368-08600d40f1f&title=&width=656)

写数据的时候，生产者只将数据写入 leader 节点， leader 会将数据写入本地磁盘，接着其他follower 会主动从 leader 来拉取数据， follower 同步好数据了，就会发送 ack 给 leader ，leader 收到所有 follower 的 ack 之后，就会返回写成功的消息给生产者。

消费数据的时候，消费者只会从 leader 节点去读取消息，但是只有当一个消息已经被所有 follower都同步成功返回 ack 的时候，这个消息才会被消费者读到。

## **Kafka 为什么这么快？**

答案：<br />**1、顺序读写**  <br />磁盘分为顺序读写与随机读写，基于磁盘的随机读写确实很慢，但磁盘的顺序读写性能却很高，kafka 采用的就是顺序读写。<br />**2、Page Cache**  <br />为了优化读写性能，Kafka 利用了操作**系统本身的 Page Cache**，就是利用操作系统自身的内存而不是JVM空间内存。<br />**3、零拷贝**  <br />Kafka使用了零拷贝技术，也就是**直接将数据从内核空间的读缓冲区直接拷贝到内核空间的 socket 缓冲区**，然后再写入到 NIC 缓冲区，避免了在内核空间和用户空间之间穿梭。<br />**4、分区分段+索引** <br />Kafka 的 message 是按 topic分 类存储的，topic 中的数据又是按照一个一个的 partition 即分区存储到不同 broker 节点。每个 partition 对应了操作系统上的一个文件夹，partition 实际上又是按照segment分段存储的。<br />通过这种分区分段的设计，Kafka 的 message 消息实际上是分布式存储在一个一个小的 segment 中的，每次文件操作也是直接操作的 segment。为了进一步的查询优化，Kafka 又默认为分段后的数据文件建立了索引文件，就是文件系统上的.index文件。这种分区分段+索引的设计，不仅提升了数据读取的效率，同时也提高了数据操作的并行度。<br />**5、批量读写**  <br />Kafka **数据读写也是批量的而不是单条，**这样可以避免在网络上频繁传输单个消息带来的延迟和带宽开销。假设网络带宽为 10MB/S，一次性传输 10MB 消息比传输1KB的消息 1万次显然要快得多。<br />**6、批量压缩**  <br />Kafka 把所有的消息都变成一个**批量的文件**，并且进行合理的**批量压缩**，减少网络 IO 损耗，通过 mmap 提高 I/O 速度，写入数据的时候由于单个Partion是末尾添加所以速度最优；读取数据的时候配合 sendfile 进行直接读取。

## ISR、AR代表什么？

答案<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942543-ac16f79c-ece0-4c08-9e31-21569255f13e.png#clientId=ua41a3794-5c73-4&from=paste&height=188&id=u40aef77f&originHeight=516&originWidth=982&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0a82dcee-d23f-41b1-898a-209da8642c2&title=&width=358)

- AR: 分区中的**所有 Replica 统称为 AR**
- ISR: 所有与 Leader 副本**保持一定程度同步**的 Replica (包括 Leader 副本在内) 组成 ISR
- OSR: 与 Leader 副本**同步滞后过多的** Replica 组成了 OSR

Leader 负责维护和跟踪 ISR 集合中所有 Follower 副本的滞后状态，当 Follower 副本落后过多时，就会将其放入 OSR 集合，当 Follower 副本追上了 Leader 的进度时，就会将其放入 ISR 集合。

:::info
只有 ISR 中的副本才有资格晋升为 Leader。
:::

## Leader 和 Follower 副本的区别？<br /><br />
答案：<br />Kafka副本当前分为 Leader 副本和 Follower 副本。只有Leader副本才能对外提供读写服务，响应Clients端的请求。Follower 副本只是采用拉（PULL）的方式，被动地同步Leader副本中的数据，并且在Leader副本所在的Broker宕机后，随时准备竞选Leader副本。

## **生产者发送消息有哪些方式？**<br /><br />
答案：

1. **发后即忘**（fire-and-forget）
   - 它只管往 Kafka 里面发送消息，但是**不关心消息是否正确到达**，这种方式的效率最高，但是可靠性也最差，比如当发生某些不可充实异常的时候会造成消息的丢失
2. **同步**（sync）
   - producer.send() 返回一个Future对象，调用get()方法变回进行同步等待，就知道消息是否发送成功，**发送一条消息需要等上个消息发送成功后才可以继续发送**
3. **异步**（async）
   - Kafka支持 producer.send() 传入一个回调函数，消息不管成功或者失败都会调用这个回调函数，这样就算是异步发送，我们也知道消息的发送情况，然后再回调函数中选择记录日志还是重试都取决于调用方

## 生产者发送数据，ack为 0，1，-1 的含义？

答案：<br />这个参数用来指定分区中有多少个副本收到这条消息，生产者才认为这条消息是写入成功的，这个参数有三个值：

- acks = 1，默认为1。生产者发送消息，**只要 leader 副本成功写入消息，就代表成功**。这种方案的问题在于，当返回成功后，如果 leader 副本和 follower 副本还**没有来得及同步**，leader 就崩溃了，那么在选举后新的 leader 就没有这条**消息，也就丢失了**。
- acks = 0。生产者发送消息后直接算写入成功，不需要等待响应。这个方案的问题很明显，**只要服务端写消息时出现任何问题，都会导致消息丢失**。
- acks = -1 或 acks = all。生产者发送消息后，需要等待 ISR 中的所有副本都成功写入消息后才能收到服务端的响应。毫无疑问这种方案的**可靠性是最高**的，但是如果 ISR 中只有leader 副本，那么就和 acks = 1 毫无差别了。

## Producer 发送消息？

答案：<br />Producer 使用带回调通知的发送 API， producer.send(msg, callback)。<br />设置 acks = all。Producer 的一个参数，表示所有副本都成功接收到消息，该消息才算是“已提交”，最高等级，acks的其它值说明。min.insync.replicas > 1，表示消息至少要被写入到多少个副本才算是“已提交”<br />retries 是 Producer 的参数。当出现网络的瞬时抖动时，消息发送可能会失败，此时配置了 retries > 0 的 Producer 能够自动重试消息发送，避免消息丢失。

## 幂等性 Producer？<br /><br />
答案：<br />设置参数props.put(“enable.idempotence”, ture)，Producer 自动升级成幂等性 Producer，其他所有的代码逻辑都不需要改变。Kafka 自动帮你做消息的重复去重。<br />原理很简单，就是经典的空间换时间，即在 Broker 端多保存一些字段。当 Producer 发送了具有相同字段值的消息后，Broker 能够自动知晓这些消息已经重复了，可以在后台默默地把它们“丢弃”掉。<br />只能保证单分区、单会话上的消息幂等性。一个幂等性 Producer 能够保证某个topic的一个分区上不出现重复消息，但无法实现多个分区的幂等性。比如采用轮询，下一次提交换了一个分区就无法解决

## 事务型 Producer?<br /><br />
答案：<br />能够保证将消息原子性地写入到多个分区中。这批消息要么全部写入成功，要么全部失败。能够保证跨分区、跨会话间的幂等性。
```
producer.initTransactions();
try {
            producer.beginTransaction();
            producer.send(record1);
            producer.send(record2);
            //提交事务
            producer.commitTransaction();
} catch (KafkaException e) {
            //事务终止
            producer.abortTransaction();
}
```
实际上即使写入失败，Kafka 也会把它们写入到底层的日志中，也就是说 Consumer 还是会看到这些消息。要不要处理在 Consumer 端设置 isolation.level ，这个参数有两个值:

- read_uncommitted：这是默认值，表明 Consumer 能够读取到 Kafka 写入的任何消息
- read_committed：表明 Consumer 只会读取事务型 Producer 成功提交事务写入的消息

## 什么是消息位移（offset）？<br /><br />
答案：<br />在Kafka中，每个主题分区下的每条消息都被赋予了一个唯一的ID数值，用于标识它在分区中的位置。这个ID数值，就被称为位移，或者叫偏移量。一旦消息被写入到分区日志，它的位移值将不能被修改。

## **Kafka 如何实现负载均衡？**<br /><br />
答案：<br />Kafka 的负载均衡主要是**通过分区来实现**的，我们知道 Kafka 是**主写主读**的架构，如下图:<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942555-118cbba0-3250-4370-83ff-6771a36ae158.png#clientId=ua41a3794-5c73-4&from=paste&height=395&id=u06e2198e&originHeight=669&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9e9c4ec7-09e2-43d9-8913-d39799fac69&title=&width=638)

共三个 broker ，里面各有三个副本，总共有三个 partation， 深色的是 leader，浅色的是 follower，上下灰色分别代表生产者和消费者，虚线代表 follower 从 leader 拉取消息。<br />我们从这张图就可以很明显的看出来，**每个 broker 都有消费者拉取消息，每个 broker 也都有生产者发送消息，每个 broker 上的读写负载都是一样的**，这也说明了 kafka 独特的架构方式可以通过主写主读来实现负载均衡。

## Kafka Broker 如何存储数据？<br /><br />
答案：<br />Kafka 使用消息日志（Log）来保存数据，一个日志就是磁盘上一个只能追加写（Append-only）消息的物理文件。因为只能追加写入，故避免了缓慢的随机 I/O 操作，改为性能较好的顺序 I/O 写操作，这也是实现 Kafka 高吞吐量特性的一个重要手段。<br />不过如果你不停地向一个日志写入消息，最终也会耗尽所有的磁盘空间，因此 Kafka 必然要定期地删除消息以回收磁盘。怎么删除呢？<br />简单来说就是通过日志段（Log Segment）机制。在 Kafka 底层，一个日志又近一步细分成多个日志段，消息被追加写到当前最新的日志段中，当写满了一个日志段后，Kafka 会自动切分出一个新的日志段，并将老的日志段封存起来。Kafka 在后台还有定时任务会定期地检查老的日志段是否能够被删除，从而实现回收磁盘空间的目的。

## 消息传输协议？<br /><br />
答案：<br />消息消费有两种模式：推和拉。Kafka的消费是属于**拉模式**的，而此模式的消息消费方式有两种**：点对点和发布订阅**。<br />**1、点对点**<br />系统 A 发送的消息只能被系统 B 接收，其他任何系统都不能读取 A 发送的消息<br />**2、发布/订阅模型**<br />该模型也有发送方和接收方，只不过提法不同。发送方也称为发布者（Publisher），接收方称为订阅者（Subscriber）。和点对点模型不同的是，这个模型可能存在多个发布者向相同的主题发送消息，而订阅者也可能存在多个，它们都能接收到相同主题的消息。

## 消息压缩？<br /><br />
答案：<br />生产者程序中配置compression.type 参数即表示启用指定类型的压缩算法。<br />props.put(“compression.type”, “gzip”)，它表明该 Producer 的压缩算法使用的是GZIP。这样 Producer 启动后生产的每个消息集合都是经 GZIP 压缩过的，故而能很好地节省网络传输带宽以及 Kafka Broker 端的磁盘占用。<br />但如果Broker又指定了不同的压缩算法，如：Snappy，会将生产端的消息解压然后按自己的算法重新压缩。
> 各压缩算法比较：吞吐量方面：LZ4 > Snappy > zstd 和 GZIP；而在压缩比方面，zstd > LZ4 > GZIP > Snappy。

kafka默认不指定压缩算法。

## 消息解压缩？

答案：<br />当 Consumer pull消息时，Broker 会原样发送出去，当消息到达 Consumer 端后，由 Consumer 自行解压缩还原成之前的消息。

## 分区策略？<br /><br />
答案：<br />编写一个类实现org.apache.kafka.clients.Partitioner接口。实现内部两个方法：partition()和close()。然后显式地配置生产者端的参数partitioner.class<br />**常见的策略：**

- 轮询策略（默认）。保证消息最大限度地被平均分配到所有分区上。
- 随机策略。随机策略是老版本生产者使用的分区策略，在新版本中已经改为轮询了。
- 按key分区策略。key可能是uid或者订单id，将同一标志位的所有消息都发送到同一分区，这样可以保证一个分区内的消息有序
- 其他分区策略。如：基于地理位置的分区策略

## 什么是消费者组？

答案：<br />消费者组（Consumer Group）允许你分割数据，一个消费者组中可以包含多个消费者进程，他们共同消费该topic的数据。<br />同一个组下的每个实例都配置有相同的组 ID，被分配订阅不同的 topic 分区。当某个实例挂掉的时候，其他实例会自动地承担起它负责消费的分区。 因此，消费者组在一定程度上也保证了消费者程序的高可用性。

## **消费端当前能读到哪一条消息？**

答案：<br />分区相当于一个日志文件<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943079-0344bf10-49e4-4b73-b6dd-08553ea6817d.png#clientId=ua41a3794-5c73-4&from=paste&height=260&id=ueeba08ad&originHeight=525&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub59f66ec-19b2-4e49-a9b9-12d6b44ef7c&title=&width=535)<br />如上图是一个分区日志文件

- 标识**共有7条消息**，offset (消息偏移量)分别是0~6
- 0 代表这个日志文件的**开始**
- HW(High Watermark) 为4，0~3 代表这个日志文件**可以消费的区间**，消费者只能消费到这四条消息
- LEO 代表即将要写入消息的偏移量 offset

**分区 ISR 集合中的每个副本都会维护自己的 LEO，而 ISR 集合中最小的LEO 即为分区的 HW**

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966942924-0c5e68c4-4358-450a-a269-7d8b83a76984.png#clientId=ua41a3794-5c73-4&from=paste&height=286&id=uc3ce1972&originHeight=544&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5c1fda36-25da-40ae-aa4d-7d85d9d09ec&title=&width=568)

如上图: 三个分区副本都是 ISR集合当中的，最小的 LEO 为 3，就代表分区的 HW 为3，所以当前分区只能消费到 0~2 之间的三条数据，如下图

![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943097-87e73a92-25cb-4987-9592-b8a945bc17ef.png#clientId=ua41a3794-5c73-4&from=paste&height=277&id=u105ce1e4&originHeight=536&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u21038c1d-0648-4e02-9f4a-c458c1c09c6&title=&width=559)

## 消费端拉取（批量）、ACK？

答案：<br />消费端先拉取并消费消息，然后再ack更新offset。<br />1）消费者程序启动多个线程，每个线程维护专属的 KafkaConsumer 实例，负责完整的消息拉取、消息处理流程。一个KafkaConsumer负责一个分区，能保证分区内的消息消费顺序。<br />缺点：线程数受限于 Consumer 订阅topic的总分区数。<br />2）任务切分成了消息获取和消息处理两个部分。消费者程序使用单或多线程拉取消息，同时创建专门线程池执行业务逻辑。优点：可以灵活调节消息获取的线程数，以及消息处理的线程数。<br />缺点：无法保证分区内的消息消费顺序。另外引入多组线程，使得整个消息消费链路被拉长，最终导致正确位移提交会变得异常困难，可能会出现消息的重复消费或丢失。

## 消费端 offset 管理？<br /><br />
答案：<br />1）老版本的 Consumer组把位移保存在 ZooKeeper 中，但很快发现zk并不适合频繁的写更新。<br />2）在新版本的 Consumer Group 中，Kafka 社区重新设计了 Consumer组的位移管理方式，采用了将位移保存在 Broker端的内部topic中，也称为“位移主题”，由kafka自己来管理。<br />原理很简单， Consumer的位移数据作为一条条普通的 Kafka 消息，提交到__consumer_offsets 中。它的消息格式由Kafka 自己定义，用户不能修改。位移主题的 Key 主要包括 3 部分内容：<Group ID，topic名，分区号 ><br />Kafka Consumer 提交位移的方式有两种：自动提交位移和手动提交位移。<br />Kafka 使用Compact策略来删除位移主题中的过期消息，避免该topic无限期膨胀。提供了专门的后台线程定期地巡检待 Compact 的主题，看看是否存在满足条件的可删除数据。

## 分区再分配是做什么的？<br /><br />
答案：<br />分区再分配主要是用来**维护 kafka 集群的负载均衡**<br />既然是分区再分配，那么 kafka 分区有什么问题呢？<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943050-f067c92e-da8a-4523-b8d1-b8df48a829c2.png#clientId=ua41a3794-5c73-4&from=paste&height=240&id=u17272f4d&originHeight=392&originWidth=892&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u06187419-1307-429b-80f2-3c18f836688&title=&width=546)

- 问题1: 当集群中的一个节点下线了
   - 如果该节点的分区是单副本的，那么分区将会变得不可用
   - 如果是多副本的，就会进行 leader 选举，在其他机器上选举出新的 leader

**kafka 并不会将这些失效的分区迁移到其他可用的 broker 上**，这样就会影响集群的负载均衡，甚至也会影响服务的可靠性和可用性<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943237-44fcbda1-d733-4eb5-8aa6-2328e15bbc4d.png#clientId=ua41a3794-5c73-4&from=paste&height=240&id=uabea12a3&originHeight=412&originWidth=994&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5f29c7fe-ef80-4dc6-a076-69436c6b2c2&title=&width=578)

- 问题2: 当集群新增 broker 时，只有新的主题分区会分配在该 broker 上，而老的主题分区不会分配在该 broker 上，就造成了**老节点和新节点之间的负载不均衡**。

为了解决该问题就出现了分区再分配，它可以在集群扩容，broker 失效的场景下进行分区迁移。<br />**分区再分配的原理就是通过控制器给分区新增新的副本，然后通过网络把旧的副本数据复制到新的副本上，在复制完成后，将旧副本清除。** 当然，为了不影响集群正常的性能，在此复制期间还会有一些列保证性能的操作，比如**复制限流**。

## 副本 leader 是怎么选举的？<br /><br />
答案：<br />当分区 leader 节点崩溃时，其中一个 follower 节点会成为新的 leader 节点，这样会**导致集群的负载不均衡，从而影响服务的健壮性和稳定性**。<br />如下:
```
Topic: test Partation:0 Leader:1 Replicas:1,2,0 Isr:1,2,0
Topic: test Partation:1 Leader:2 Replicas:2,0,1 Isr:2,0,1
Topic: test Partation:2 Leader:0 Replicas:0,1,2 Isr:0,1,2
```
我们可以看到

- 0 分区 1 是 leader
- 1 分区 2 是 leader
- 2 分区 0 是 leader

如果此时中间的**节点重启**
```
Topic: test Partation:0 Leader:1 Replicas:1,2,0 Isr:1,0,2
Topic: test Partation:1 Leader:0 Replicas:2,0,1 Isr:0,1,2
Topic: test Partation:2 Leader:0 Replicas:0,1,2 Isr:0,1,2
```
我们又可以看到:

- 0 分区 1 是 leader
- 1 分区 0 是 leader
- 2 分区 0 是 leader

我们会发现，原本 1 分区有两个 ledaer，经过重启后 leader 都消失了，如此就**负载不均衡**了。<br />为了解决这种问题，就引入了`优先副本`的概念<br />优先副本就是说在 AR 集合中的第一个副本。比如分区 2 的 AR 为 0，1，2，那么分区 2 的优先副本就为0。理想情况下优先副本就是 leader 副本。优先副本选举就是促使优先副本成为 leader 副本，从而维护集群的负载均衡。

## 分区数越多越好吗？吞吐量就会越高吗？

答案：<br />一般类似于这种问题的答案，都是持否定态度的。<br />但是可以说，**在一定条件下，分区数的数量是和吞吐量成正比的，分区数和性能也是成正比的**。<br />那么为什么说超过了一定限度，就会对性能造成影响呢？原因如下:<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943332-f155dc0c-b407-49be-8c86-d03a29aabf03.png#clientId=ua41a3794-5c73-4&from=paste&height=235&id=u1dce99b2&originHeight=463&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud49020f6-a594-4d89-bdb5-f5e97710dec&title=&width=547)<br />**1、客户端/服务器端需要使用的内存就越多**

- 服务端在很多组件中都维护了分区级别的缓存，分区数越大，**缓存成本**也就越大。
- 消费端的消费线程数是和分区数挂钩的，分区数越大消费线程数也就越多，**线程的开销成本**也就越大
- 生产者发送消息有缓存的概念，会为每个分区缓存消息，当积累到一定程度或者时间时会将消息发送到分区，**分区越多，这部分的缓存**也就越大

**2、文件句柄的开销**  <br />**每个 partition 都会对应磁盘文件系统的一个目录**。在 Kafka 的数据日志文件目录中，每个日志数据段都会分配两个文件，一个索引文件和一个数据文件。**每个 broker 会为每个日志段文件打开一个 index 文件句柄和一个数据文件句柄**。因此，随着 partition 的增多，所需要保持打开状态的文件句柄数也就越多，最终可能超过底层操作系统配置的文件句柄数量限制。<br />**3、越多的分区可能增加端对端的延迟**  <br />Kafka 会将分区 HW 之前的消息暴露给消费者。**分区越多则副本之间的同步数量就越多**，在默认情况下，每个 broker 从其他 broker 节点进行数据副本复制时，该 broker 节点只会为此工作分配一个线程，该线程需要完成该 broker 所有 partition 数据的复制。<br />**4、降低高可用性**  <br />在第 13 问我们提到了分区再分配，会将数据复制到另一份副本当中，**分区数量越多，那么恢复时间也就越长**，而如果发生宕机的 broker 恰好是 controller 节点时：在这种情况下，新 leader 节点的选举过程在 controller 节点恢复到新的 broker 之前不会启动。controller 节点的错误恢复将会自动地进行，但是新的 controller 节点需要从 zookeeper 中读取每一个 partition 的元数据信息用于初始化数据。例如，假设一个Kafka 集群存在 10000个partition，从 zookeeper 中恢复元数据时每个 partition 大约花费 2 ms，则 controller 的恢复将会增加约 20 秒的不可用时间窗口。

## 如何提升消费者的消费能力？

答案：

- 1.可以考虑增加 topic 的分区数，并且同时提升消费组的消费者数量，消费者数=分区数。
- 2.如果是消费者消费不及时，可以采用多线程的方式进行消费，并且优化业务方法流程。

## 消费者与 topic 的分区分配策略有哪些？

答案：<br />![](https://cdn.nlark.com/yuque/0/2022/png/21503536/1666966943464-979b5978-dc65-48ad-ba95-3f3ccb6648e8.png#clientId=ua41a3794-5c73-4&from=paste&height=232&id=u0e06b4cd&originHeight=458&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2cbc278f-c674-4f59-a34b-5caaf830382&title=&width=547)<br />**1、RangeAssignor 分配策略**<br />该分配策略是按照**消费者总数和分区总数进行整除运算**来获得一个跨度，然后分区按照跨度来进行平均分配，尽可能保证分区均匀的分配给所有的消费者。<br />对于每个 topic，该策略会讲消费者组内所有订阅这个主题的消费者**按照名称的字典顺序排序**，然后为每个消费者划分固定过的区域，**如果不够平均分配，那么字典排序考前的就会多分配一个分区**。<br />比如 2 个消费者属于一个消费者组，有 2 个 topic t1，t2，每个 topic 都有 3 个分区，p1，p2，p3，那么分配的情况如下:
```
  消费者A:t0-p0，t0-p1，t1-p0，t1-p1，
  消费者B:t0-p2，t1-p2
```
这样就会出现非配不均匀的情况

**2、RoundRobinAssignor 分配策略**<br />该分配策略是**按将消费者组内所有消费者及消费者订阅的所有主题的分区按照字典排序，然后通过轮询的方式分配给每个消费者**。<br />比如有 3 个消费者 A，B，C，订阅了 3 个 topic ，t0，t1，t2，每个 topic 各有 3 个分区 p0，p1，p2。如果 A 订阅了 t0，B 订阅了 t0 和 t1，C 订阅了 t0，t1，t2，那么分配的情况如下:
```
  消费者A:t0-p0
  消费者B:t1-p0
  消费者C:t1-p1，t2-p0，t2-p1，t2-p2
```
这样也会出现分配不均匀的情况，按照订阅情况来讲完全可以吧 t1p1 分配给消费者B

**3、StickyAssignor分配策略**<br />这种分配策略有两个目的

- 分区的分配要尽可能的均匀
- 分区的分配尽可能的与上次分配的保持相同。

当两者发生冲突时，第一个目标优先于第二个目标。<br />假设消费组内有3个消费者：**C0、C1、C2，**它们都订阅了4个主题：**t0、t1、t2、t3** <br />并且每个主题有2个分区，也就是说整个消费组订阅了，**t0p0、t0p1、t1p0、t1p1、t2p0、t2p1、t3p0、t3p1** 这8个分区。<br /> 最终的分配结果如下：
```
消费者C0：t0p0、t1p1、t3p0

消费者C1：t0p1、t2p0、t3p1

消费者C2：t1p0、t2p1
```
这样初看上去似乎与采用RoundRobinAssignor策略所分配的结果相同<br />此时假设消费者C1脱离了消费组，那么消费组就会执行再平衡操作，进而消费分区会重新分配。如果采用RoundRobinAssignor策略，那么此时的分配结果如下：
```
消费者C0：t0p0、t1p0、t2p0、t3p0

消费者C2：t0p1、t1p1、t2p1、t3p1
```
如分配结果所示，RoundRobinAssignor策略会按照消费者C0和C2进行重新轮询分配。而如果此时使用的是StickyAssignor策略，那么分配结果为：
```
消费者C0：t0p0、t1p1、t3p0、t2p0

消费者C2：t1p0、t2p1、t0p1、t3p1
```
可以看到分配结果中保留了上一次分配中对于消费者C0和C2的所有分配结果，并将原来消费者C1的“负担”分配给了剩余的两个消费者C0和C2，最终C0和C2的分配还保持了均衡。

**如果发生分区重分配，那么对于同一个分区而言有可能之前的消费者和新指派的消费者不是同一个，对于之前消费者进行到一半的处理还要在新指派的消费者中再次复现一遍，这显然很浪费系统资源。StickyAssignor策略如同其名称中的“sticky”一样，让分配策略具备一定的“粘性”，尽可能地让前后两次分配相同，进而减少系统资源的损耗以及其它异常情况的发生**。

到目前为止所分析的都是消费者的订阅信息都是相同的情况，我们来看一下订阅信息不同的情况下的处理。<br />举例：同样消费组内有3个消费者：**C0、C1、C2** <br />集群中有3个主题 **t0、t1、t2** <br />这3个主题分别有 **1、2、3**个分区 <br />也就是说集群中有 **t0p0、t1p0、t1p1、t2p0、t2p1、t2p2** 这6个分区 <br />消费者**C0订阅了主题t0，消费者C1订阅了主题t0和t1，消费者C2订阅了主题t0、t1和t2** <br />如果此时采用RoundRobinAssignor策略：
```
消费者C0：t0p0

消费者C1：t1p0

消费者C2：t1p1、t2p0、t2p1、t2p2
```
如果此时采用的是StickyAssignor策略：
```
消费者C0：t0p0

消费者C1：t1p0、t1p1

消费者C2：t2p0、t2p1、t2p2
```
此时消费者C0脱离了消费组，那么RoundRobinAssignor策略的分配结果为：
```
消费者C1：t0p0、t1p1

消费者C2：t1p0、t2p0、t2p1、t2p2
```
StickyAssignor策略，那么分配结果为：
```
消费者C1：t1p0、t1p1、t0p0

消费者C2：t2p0、t2p1、t2p2
```
可以看到StickyAssignor策略保留了消费者C1和C2中原有的5个分区的分配：
```
t1p0、t1p1、t2p0、t2p1、t2p2。
```
从结果上看StickyAssignor策略比另外两者分配策略而言显得更加的优异，这个策略的代码实现也是异常复杂。

**4、自定义分区分配策略**<br />可以通过实现 org.apache.kafka.clients.consumer.internals.PartitionAssignor 接口来实现

## **Kafka 控制器有什么作用？**<br /><br />
答案：<br />在 Kafka 集群中会有一个或多个 broker，其中有一个 broker 会被选举为控制器，**它负责管理整个集群中所有分区和副本的状态**，kafka 集群中**只能有一个控制器**。

- 当某个分区的 leader 副本出现故障时，由控制器负责**为该分区选举新的 leader 副本**。
- 当检测到某个分区的ISR集合发生变化时，由控制器**通知所有 broker 更新其元数据信息**。
- 当为某个 topic 增加分区数量时，由控制器**负责分区的重新分配**。

## **kafka 控制器如何进行选举？**<br /><br />
答案：<br />kafka 中的控制器选举工作**依赖于 Zookeeper**，成功竞选成为控制器的 broker 会在Zookeeper中创建/controller临时节点。<br />每个 broker 启动的时候会去尝试读取/controller 节点的 brokerid的值

- **如果**读取到的 **brokerid 的值不为-1**，表示已经有其他broker 节点成功竞选为控制器，所以当前 broker **就会放弃竞选**；

如果Zookeeper中**不存在**/controller 节点，**或者**这个节点的数据**异常**，那么**就会尝试去创建**/controller 节点，**创建成功的那个 broker 就会成为控制器**。<br />每个 broker 都会在内存中保存当前控制器的 brokerid 值，这个值可以标识为 activeControllerId。<br />Zookeeper 中还有一个与控制器有关的/controller_epoch 节点，这个节点是**持久节点**，节点中存放的是一个整型的 controller_epoch 值。controller_epoch 值用于**记录控制器发生变更的次数**。<br />controller_epoch 的**初始值为1**，即集群中的第一个控制器的纪元为1，当控制器发生变更时，**每选出一个新的控制器就将该字段值加1**。<br />每个和控制器交互的请求都会携带 controller_epoch 这个字段，

- **如果请求的 controller_epoch 值**小于**内存中的 controller_epoch值**，**则**认为这个请求是向已经过期的控制器发送的请求，那么这个请求会**被认定为无效的请求**。
- 如果请求的 controller_epoch 值**大于**内存中的 controller_epoch值，那么说明**已经有新的控制器当选**了

## **如何保证消息不丢失?**<br /><br />
答案：<br />Kafka 有三次消息传递的过程：生产者发消息给 Broker、Broker 同步消息和持久化消息、Broker 将消息传递给消费者。<br />这其中每一步都有可能丢失消息：

**1、生产者发送数据**

- 当 acks 为 0，**只要服务端写消息时出现任何问题，都会导致消息丢失**。
- 当 acks 配置为 1 时，生产者发送消息，只要 leader 副本成功写入消息，就代表成功。这种方案的问题在于，当返回成功后，**如果 leader 副本和 follower 副本还没有来得及同步，leader 崩溃了，那么在选举后的新 leader 没有这条消息，也就丢失了**。

:::info
通过在 producer 端设置 acks=all 来处理，这个参数是要求 leader 接收到消息后，需要等到所有的 follower 都同步到了消息之后，才认为本次写成功了。如果没满足这个条件，生产者会自动不断的重试。
:::

**2、Broker 存储数据**<br />  kafka 通过 Page Cache 将数据写入磁盘。<br />  Page Cache 就是当往磁盘文件写入的时候，系统会先将数据流写入缓存中，但是**什么时候将缓存的数据写入磁盘文件中是由操作系统自行决定**。所以**如果此时机器突然挂了，也会丢失消息**。<br />对于这个问题， Kafka 可以设置如下 4 个参数，来尽量避免消息丢失：

- 给 topic 设置 replication.factor 参数：这个值必须大于 1 ，要求每个 partition 必须有至少 2 个副本；
- 在 Kafka 服务端设置 min.insync.replicas 参数：这个值必须大于 1 ，这个参数的含义是一个leader 至少感知到有至少一个 follower 还跟自己保持联系，没掉队，这样才能确保 leader挂了还有一个 follower 节点。
- 在 producer 端设置 acks=all ，这个是要求每条数据，必须是写入所有 replica 之后，才能认为是写成功了；
- 在 producer 端设置 retries=MAX （很大很大很大的一个值，无限次重试的意思）：这个参数的含义是一旦写入失败，就无限重试，卡在这里了。

**3、消费者消费数据**<br />  **开启自动提交 offset**，只要消费者消费到消息，那么就会自动提交偏移量，**如果业务还没有来得及处理，那么消息就会丢失**。<br />只要关闭自动提交 offset ，消费者在处理完之后手动提交 offset ，就可以保证消息不会丢失。但是此时需要注意重复消费问题，比如消费者刚处理完，还没提交 offset ，这时自己宕机了，此时这条消息肯定被重复消费一次，这就需要消费者根据实际情况保证幂等性。

更多资料参考文章： [硬核 | Kafka 如何解决消息不丢失？](https://mp.weixin.qq.com/s/ppJ6asrbT-r3_9T3SHOGTw)

## 如何保证消息的顺序性？

答案：<br />在某些业务场景下，我们需要保证对于有逻辑关联的多条MQ消息被按顺序处理，比如对于某一条数据，正常处理顺序是 新增-更新-删除 ，最终结果是数据被删除。如果消息没有按序消费，处理顺序可能是 删除-新增-更新 ，最终数据没有被删掉，可能会产生一些逻辑错误。对于如何保证消息的顺序性，主要需要考虑如下两点： <br />**1、如何保证消息在 Kafka 中顺序性**<br />对于 Kafka ，如果我们创建了一个 topic ，默认有三个 partition 分区。生产者在写数据的时候，可以指定一个 key ，比如在订单 topic 中我们可以指定订单 id 作为 key ，那么相同订单 id 的数据，会被分发到同一个 partition 中，这个 partition 中的数据一定是有顺序的。消费者从partition 中取出来数据的时候，也一定是有顺序的。通过制定 key 的方式首先可以保证在 kafka 内部消息是有序的。 <br />**2、如何保证消费者处理消费的顺序性**<br />对于某个 topic 的一个 partition ，只能被同组内部的一个 consumer 消费，如果这个 consumer内部还是单线程处理，那么其实只要保证消息在 MQ 内部是有顺序的就可以保证消费也是有顺序的。但是单线程吞吐量太低，在处理大量 MQ 消息时，我们一般会开启多线程消费机制，那么如何保证消息在多个线程之间是被顺序处理的呢？对于多线程消费我们可以预先设置 N 个内存 Queue ，具有相同 key的数据都放到同一个内存 Queue 中；然后开启 N 个线程，每个线程分别消费一个内存 Queue 的数据即可，这样就能保证顺序性。当然，消息放到内存 Queue 中，有可能还未被处理， consumer 发生宕机，内存 Queue 中的数据会全部丢失，这就转变为上面提到的如何保证消息的可靠传输的问题了

## **关于Kafka，面试官一般喜欢考察哪些问题？**

答案：

- 消息压缩
- 消息解压缩
- 分区策略
- 生产者如何实现幂等、事务
- Kafka Broker 是如何存储数据？备份机制
- 为什么要引入消费组？
- 详细内容，参考之前写的 [聊聊 Kafka 那点破事！](https://mp.weixin.qq.com/s?__biz=Mzg2NzYyNjQzNg==&mid=2247485551&idx=1&sn=533259fc15567b9f44e169943be4a305&scene=21#wechat_redirect)

## **为什么不支持读写分离？**

答案：<br />Kafka **不支持读写分离**，那么读写分离的好处是什么？主要就是让一个节点去承担另一个节点的负载压力，也就是能做到一定程度的负载均衡，而且 Kafka 不通过读写分离也可以一定程度上去实现负载均衡。<br />但是对于 Kafka 的架构来说，读写分离有两个很大的**缺点：**<br />1、数据不一致的问题。一主多从，leader副本的数据同步到follower副本有一定的延时，因此每个follower副本的消息位移也不一样，而消费端是通过消费位移来控制消息拉取进度，多个副本间要维护同一个消费位移的一致性。如果引入分布式锁，保证并发安全，非常耗费性能。<br />2、实时性。leader副本的数据同步到follower副本有一定的延时，如果网络较差，延迟会很严重，无法满足实时性业务需求。

**生产端写入消息、消费端拉取消息都是与leader 副本交互的，并没有像mysql数据库那样，master负责写，slave负责读。**

## 为什么采用 Pull 模式，还是 Push 模式？<br /><br />
答案：<br />消费者使用pull模式从 Broker 订阅消息。 <br />push模式很难适应消费速率不同的消费者，如果push的速度太快，容易造成消费者拒绝服务或网络拥 塞；如果push的速度太慢，容易造成消费者性能浪费。<br />但是采用pull的方式也有一个缺点，就是当Broker没有消息时，消费者会陷入不断地轮询中，为了避免这点，kafka有个参数可以让消费者阻塞知道是否有新消息到达。

## 哪些场景使用零拷贝？<br /><br />
答案：<br />**1、基于 mmap 的索引**<br />索引都是基于MappedByteBuffer的，也就是让用户态和内核态共享内核态的数据缓冲区，此时，数据不需要复制到用户态空间。不过，mmap 虽然避免了不必要的拷贝，但不一定就能保证很高的性能。在不同的操作系统下，mmap的创建和销毁成本可能是不一样的。很高的创建和销毁开销会抵消Zero Copy带来的性能优势。由于这种不确定性，在Kafka中，只有索引应用了mmap，最核心的日志并未使用mmap机制。

**2、日志文件读写所用的 TransportLayer**<br />TransportLayer是Kafka传输层的接口。它的某个实现类使用了FileChannel的transferTo方法。该方法底层使用sendfile实现了Zero Copy。对Kafka而言，如果I/O通道使用普通的PLAINTEXT，那么，Kafka就可以利用Zero Copy特性，直接将页缓存中的数据发送到网卡的Buffer中，避免中间的多次拷贝。相反，如果I/O通道启用了SSL，那么，Kafka便无法利用 Zero Copy 特性。

## 在Kafka中，ZooKeeper 作用是什么？<br /><br />
答案：<br />Kafka 使用 ZooKeeper 存放集群元数据、成员管理、Controller 选举，以及其他一些管理类任务。

- 存放元数据：是指主题分区的所有数据都保存在 ZooKeeper 中，且以它保存的数据为准
- 成员管理：指 Broker 节点的注册、注销以及属性变更，等等。
- Controller 选举：是指选举集群 Controller，而其他管理类任务包括但不限于主题删除、参数配置 等。

## 历史数据清理策略？

答案：

- 基于保存时间，log.retention.hours
- 基于日志大小的清理策略。通过log.retention.bytes控制
- 组合方式



