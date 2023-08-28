---
title: 电商订单自动确认收货的N种实现
---

#  电商订单自动确认收货的N种实现


> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


在这个电子商务流行年代，24小时随时随地网购已经成为我们习以为常的生活习惯。看到不错的商品，我们会立即下单，完全不受时间、空间的限制，剁手，然后在家坐等收快递，那种感觉。。。。

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-1.png" width="260px">
</div>

细心的你是否发现，我们好像很少去主动点击‘’确认收货”，毕竟拿到了货，我总要先体验几天，谁知道它会不会坏，但时间一拖就忘了操作确认收货。而担保交易，如果买家不确认收货，交易订单无法完结，那商家是收不到货款的。有什么解决办法？

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-2.png" width="300px">
</div>

上面示图是淘宝APP的订单详情页，左上方的自动确认时间起到了关键作用。也就是说，到了目标时间系统会自动触发代替买家执行确认收货。对上述的任务，我们给一个专业的名字，那就是延迟任务。那么这里你可能会问，这个延迟任务和定时任务的区别究竟在哪里呢？


1、定时任务有固定的触发时间（比如每天的凌晨2点执行），延迟任务的执行时间不固定，严格依赖于业务事件的触发时间（比如：自动确认收货是在卖家发货那个时刻往后延15天）

2、定时任务有执行周期，而延迟任务在某事件触发后一段时间内执行，一般是一次性的，没有执行周期

3、定时任务一般执行的是批处理操作多个任务，而延迟任务一般是单个任务



**延迟任务的一些业务场景：**

1、当你下了一笔订单后，一直没有付款，一般超过30分钟后，系统会自动关闭订单并退还库存

2、购买一件商品，如果你不喜欢会申请退款，当卖家超过3天未处理，系统会自动退款成功

3、生成订单60秒后，自动给用户发短信


延迟任务不仅仅适用于电商业务，对于预先设定目标执行时间，当时间到了需要自动触发执行的业务场景都可以参考该设计方案。下面我们具体讲一讲延迟任务常见的技术实现，后面工作中你可能会用的上。。。


## 一、JDK 延迟队列


通过JDK提供的DelayQueue 类来实现。DelayQueue 是一个无界阻塞队列，支持延时获取元素，队列中的元素必须实现 Delayed 接口，并重写 getDelay(TimeUnit) 和 compareTo(Delayed) 方法，代码示例如下：

```java
public class DelayQueueTest {
    public static void main(String[] args) {
        DelayQueue<DelayTask> dq = new DelayQueue<DelayTask>();
        //生产者生产一个2秒的延时任务
        new Thread(new ProducerDelay(dq, 2000)).start();
        //开启消费者轮询
        new Thread(new ConsumerDelay(dq)).start();
    }

}

class ProducerDelay implements Runnable {
    DelayQueue<DelayTask> delayQueue;
    int delaySecond;
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public ProducerDelay(DelayQueue<DelayTask> delayQueue, int delaySecond) {
        this.delayQueue = delayQueue;
        this.delaySecond = delaySecond;
    }

    @Override
    public void run() {

        for (int i = 1; i < 6; i++) {
            delayQueue.add(new DelayTask(delaySecond, i + ""));
            System.out.println(sdf.format(new Date()) + " Thread " + Thread.currentThread() + " 添加了一个延迟任务，id=" + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

class ConsumerDelay implements Runnable {
    DelayQueue<DelayTask> delayQueue;
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public ConsumerDelay(DelayQueue<DelayTask> delayQueue) {
        this.delayQueue = delayQueue;
    }

    @Override
    public void run() {
        while (true) {
            DelayTask delayTask = null;
            try {
                delayTask = delayQueue.take();
            } catch (Exception e) {
                e.printStackTrace();
            }
            //如果Delay元素存在,则任务到达超时时间
            if (delayTask != null) {
                //处理任务
                System.out.println(sdf.format(new Date()) + " Thread " + Thread.currentThread() + " 消费了一个延迟任务，id=" + delayTask.getId());
            } else {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                }
            }
        }
    }
}

@Data
@AllArgsConstructor
class DelayTask implements Delayed {
    String id;

    // 延迟截止时间（单位：毫秒）
    long delayTime = System.currentTimeMillis();

    public DelayTask(long delayTime, String id) {
        this.delayTime = (this.delayTime + delayTime);
        this.id = id;
    }

    @Override
    // 获取剩余时间
    public long getDelay(TimeUnit unit) {
        return unit.convert(delayTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    @Override
    // 队列里元素的排序依据
    public int compareTo(Delayed o) {
        if (this.getDelay(TimeUnit.MILLISECONDS) > o.getDelay(TimeUnit.MILLISECONDS)) {
            return 1;
        } else if (this.getDelay(TimeUnit.MILLISECONDS) < o.getDelay(TimeUnit.MILLISECONDS)) {
            return -1;
        } else {
            return 0;
        }
    }

    @Override
    public String toString() {
        return DateFormat.getDateTimeInstance().format(new Date(delayTime));
    }
}

```

点评：

* 1、由于采用无界阻塞队列，占用本地内存，如果任务太多的话，很容易产生内存溢出（OOM）的风险；
* 2、另外该实现是单机版玩法，如果发生系统重启等情况会导致内存数据丢失，需要考虑将数据重新预热到缓存的操作，有额外实现成本


当然有人提过使用基于调度的线程池 `ScheduledExecutorService` 来实现，里面提三种维度的方法实现

* 1、schedule。单次延迟任务。
* 2、scheduleAtFixedRate。基于固定时间间隔进行循环延迟任务。如果上一次任务还没有结束，会等它结束后，才执行下一次任务，取间隔时间和任务执行时间的最大值。
* 3、scheduleWithFixedDelay。取决于每次任务执行的时间长短，是基于不固定时间间隔进行循环延迟任务，每次执行时间为上一次任务结束起向后推一个时间间隔，即每次执行时间为：initialDelay, initialDelay+executeTime+delay, initialDelay+2executeTime+2delay



点评：

* 1、上面提到的第二、三种，都是循环执行任务，区别在与执行的时间调度上有区别。不适合本文的业务场景
* 2、方法一，也就是schedule，属于单次执行，且时间支持灵活计算，本文业务场景的时间=（目标执行时间-当前时间）


```java
MyScheduledRunnable runnable = new MyScheduledRunnable();
// 业务运行2秒
runnable.setBizCostTime(2000L);

ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
// 单次任务，延迟1秒，开始执行任务
service.schedule(runnable, 1, TimeUnit.SECONDS);

```

## 二、数据库轮询扫描

按业务需求，我们会创建一个超时记录表，当业务执行时会插入一条记录到mysql表，并指定目标执行时间。

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-3.png" width="500px">
</div>

然后会启动一个定时任务，一般会采用 Quartz 框架来实现， 无限循环扫描该表记录，如果发现目标执行时间小于当前时间，会提取记录执行并修改状态。为什么要先修改状态呢？主要是考虑多线程并发问题，毕竟执行超时任务（如：自动确认收货）也要花费时间，待超时任务执行结束后，再修改状态标记为“已完成”。

缺点：采用主动发现机制，执行时间严重依赖扫描频率，如果定时任务配置的时间周期太长，那么任务真正执行时间可能会有较大延迟。反之，如果扫描周期时间太短，扫描频率过快，数据库的压力会比较大，还存在较大的系统资源浪费。

如果表的数据量过大，每次扫描任务负担会很重，我们会考虑采用分库分表机制，每张物理表都有独立的扫描线程，提高处理速度。另外，当任务已经执行完成，该记录基本没什么业务价值，会有归档任务，对历史数据定期清理。

优点： 实现简单、无技术难点、异常恢复、支持分布式/集群环境



## 三、Redis 有序集合实现延迟任务


Redis提供了丰富的数据存储结构，其中Zset支持按score对value值排序，这里的score可以采用超时记录的目标执行时间。也就是说集合列表中的记录是按执行时间排好序，我们只需要取小于当前时间的即可。

为了避免一次拉取的记录过多，导致程序处理压力过大，在调用 redisTemplate.opsForZSet().rangeByScoreWithScores(key, 0, max, 0, count);   一般我们会限制拉取的条数，比如一次只拉取最小的50条，降低单次处理的RT时长。


```java
@Test
public void test() throws InterruptedException {

    //清理数据
    cacheService.delKey(keyPrefix);

    // 模拟插入10条超时记录
    for (int i = 1; i <= 10; i++) {
        long delayTime = Instant.now().plusSeconds(i + 4).getEpochSecond();
        boolean result = cacheService.addData(keyPrefix, "v" + i, delayTime);
        if (result) {
            System.out.println("记录：" + i + " 插入成功！");
        }
    }

    // 启动延迟队列扫描
    while (true) {
        long nowtTime = Instant.now().getEpochSecond();
        // 一次扫描出小于当前时间且按时间排序的最小两条记录
        List<String> result = cacheService.scanData(keyPrefix, nowtTime, 3);
        if (result != null) {
            for (String record : result) {
                // 对ZREM的返回值进行判断，只有大于0的时候，才消费数据
                // 防止多个线程消费同一个资源的情况
                long affectRow = cacheService.removeData(keyPrefix, record);
                if (affectRow > 0) {
                    // 模拟业务处理
                    System.out.println("处理超时记录：" + record);
                }
            }
        }
        Thread.sleep(800);
    }
}
```


优点： 解耦、异常恢复、支持分布式/集群环境；


## 四、pulsa 消息实现延迟任务



当前公司使用 pulsa 消息中间件，我们来看下如何借助现成的消息框架来实现延迟任务。

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-4.png" width="500px">
</div>

当producer发出一个延迟消息，订阅方并不会立即收到消息，消息存储在BookKeeper中，DelayedDeliveryTracker将时间索引（time-> messageId）保存在内存中，一旦延迟时间到了，消息会被发布到一台broker，然后传递给订阅者。 


延迟消息传递仅在共享订阅模式下有效。在“独占”和“故障转移”订阅模式下，延迟的消息会立即分派。


代码示例：

```java
producer.newMessage().deliverAfter(3L, TimeUnit.Minute).value("Hello Pulsar!").send();
```


更多还是借助于pulsa消息框架本身机制来实现功能，你会发现调用的API非常简单。



## 五、ActiveMQ 消息实现延迟任务


ActiveMQ作为一个开箱即用的中间件，提供了扩展配置属性支持延迟消息。

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-5.png" width="650px">
</div>


示例1：延迟60秒发送消息

```java
MessageProducer producer = session.createProducer(destination);
TextMessage message = session.createTextMessage("test msg");
long time = 60 * 1000;
message.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_DELAY, time);
producer.send(message);
```


示例2：开始延迟30秒发送，重复发送10次，每次之间间隔10秒

```java
MessageProducer producer = session.createProducer(destination);
TextMessage message = session.createTextMessage("test msg");
long delay = 30 * 1000;
long period = 10 * 1000;
int repeat = 9;
message.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_DELAY, delay);
message.setLongProperty(ScheduledMessage.AMQ_SCHEDULED_PERIOD, period);
message.setIntProperty(ScheduledMessage.AMQ_SCHEDULED_REPEAT, repeat);
producer.send(message);
```

示例3：使用Cron 表示式定时发送消息

```java
MessageProducer producer = session.createProducer(destination);
TextMessage message = session.createTextMessage("test msg");
message.setStringProperty(ScheduledMessage.AMQ_SCHEDULED_CRON, "0 * * * *");
producer.send(message);
```


## 六、Netty 实现延迟任务


由于netty动辄管理10w+的连接，每一个连接都会有很多超时任务。比如发送超时、心跳检测间隔等，如果每一个定时任务都启动一个Timer，不仅低效，而且会消耗大量的资源。

<div align="left">
    <img src="https://offercome.cn/images/arch/business/3-7.png" width="500px">
</div>

时间轮是一种高效来利用线程资源来进行批量化调度的一种调度模型。把大批量的调度任务全部都绑定到同一个的调度器上面，使用这一个调度器来进行所有任务的管理（manager），触发（trigger）以及运行（runnable）。能够高效的管理各种延时任务，周期任务，通知任务等等。

缺点，时间轮调度器的时间精度可能不是很高，对于精度要求特别高的调度任务可能不太适合。因为时间轮算法的精度取决于，时间段“指针”单元的最小粒度大小，比如时间轮的格子是一秒跳一次，那么调度精度小于一秒的任务就无法被时间轮所调度。而且时间轮算法没有做宕机备份，因此无法再宕机之后恢复任务重新调度。


```java
// 初始化netty时间轮
HashedWheelTimer timer = new HashedWheelTimer(1, // 时间间隔
        TimeUnit.SECONDS,
        10); // 时间轮中的槽数

TimerTask task1 = new TimerTask() {
    @Override
    public void run(Timeout timeout) throws Exception {
        System.out.println("已经过了" + costTime() + " 秒，task1 开始执行");
    }
};

TimerTask task2 = new TimerTask() {
    @Override
    public void run(Timeout timeout) throws Exception {
        System.out.println("已经过了" + costTime() + " 秒，task2 开始执行");
    }
};

TimerTask task3 = new TimerTask() {
    @Override
    public void run(Timeout timeout) throws Exception {
        System.out.println("已经过了" + costTime() + " 秒，task3 开始执行");
    }
};

// 将任务添加到延迟队列
timer.newTimeout(task1, 0, TimeUnit.SECONDS);
timer.newTimeout(task2, 3, TimeUnit.SECONDS);
timer.newTimeout(task3, 15, TimeUnit.SECONDS);
```


## 项目代码

https://github.com/aalansehaiyang/project-example



