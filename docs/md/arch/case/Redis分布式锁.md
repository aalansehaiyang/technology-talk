---
title: 如何设计一个 Redis 分布式锁？
---

#  如何设计一个 Redis 分布式锁？

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



多线程并发在我们做系统架构设计中经常遇到，例如：抽奖、秒杀、库存 等。

面对多个请求同时对一个`共享资源` 修改，如何保证数据安全，这里就需要引入 `锁` 来解决临界资源的访问安全。

JDK 中提供了 `synchronized` 和 `Lock` 两种锁。

无论哪一种锁，有一个前提条件，都是解决同一个 JVM 进程下的线程安全问题。

面对当下分布式微服务系统架构，多个系统，多台机器，多个进程，JDK 提供的锁已经无法解决这个问题。

这时，我们需要一个分布式锁

> 在实现 JVM 锁时，我们将锁的状态保存在 Java 的对象头中，分布式锁也是类似的道理，将锁的状态保存在一个外部存储，比如：MySQL、Redis 等存储服务中。


## 一、分布式锁都要考虑哪些因素？

1、互斥性，这个是锁的最基本要求
2、可重入性，同一个线程可以重复多次获得锁
3、支持阻塞、非阻塞两种特性
4、支持锁超时，为了防止线程意外退出，没有正常释放锁，导致其他线程无法正常获取到锁。加锁时间超过一定时间，会自动释放锁


## 二、Redis 实现分布式锁

加锁通常使用 set 命令来实现，伪代码如下

```
set key value PX milliseconds NX
```

参数说明：

- key、value：键值对；
- PX milliseconds：设置键的过期时间为 milliseconds 毫秒；
- NX：只在键不存在时，才对键进行设置操作。SET key value NX 效果等同于 SETNX key value；
- PX、expireTime：用于解决没有解锁导致的死锁问题。因为如果没有过期时间，万一程序员写的代码有 bug 导致没有解锁操作，则就出现了死锁，因此该参数起到了一个“兜底”的作用；

Spring Data Redis 已经帮我们封装好了现成的方法，拿来开箱直接使用即可。代码如下：

### 1、加锁

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-1.png" width="750px">
</div>


首次加锁，Redis 中 key 是空的，键值对关联成功后，调用结果返回 True，表示加锁成功。

为了防止一些特殊情况出现，导致锁没有正常释放，这里为 Key 设置了一个过期时间，作为一个兜底策略，超时锁会自动释放

### 2、释放锁

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-2.png" width="600px">
</div>

删除key，表示释放分布式锁。

简单几行代码，就可以实现一个分布式锁，感觉也没什么复杂的。

根据二八原则，80% 的时间都花费在少数几件重要的事情上。我们做系统开发也是一样道理，功能编码可能只需要几天时间，但是优化其中的性能、稳定性、高可用 等可能要花上一周甚至更长时间。

那我们看看上面的方案有没有瑕疵呢？

加锁和解锁这种通用性操作一般都是以公共组件形式存在，比如封装成一个工具类方法，供上层业务直接调用，避免重复建设。

这就带来一个问题，如果一个新同学没有调用 lock() 方法，上来直接先调用了 unLock() 方法，此时会将别人的锁释放掉，引发数据安全问题。

为了解决这个问题，我们要求哪个线程加的锁，同样必须那个线程才能释放锁。


## 三、安全解锁

如何才能达到加锁和释放锁绑定到同一个线程呢？

这里提供了一个简单思路

- 我们在加锁的时候，会将线程的 id 编号存到 Redis 缓存中，预埋了个线索
- 我们释放锁时，需再次传入线程 id，比较操作的 key 是否归属于这个线程 id
- 如果匹配成功，才能执行删除操作

释放锁有多个操作，为了保证操作的原子性，这里采用 Lua 脚本

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-3.png" width="450px">
</div>

**演示代码：**

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-4.png" width="750px">
</div>

现在貌似`加锁` 和`释放锁 `基本能满足需求，但是一个方法内部调用逻辑通常是复杂的。

如果上层已经获得了锁，那后面的方法对同一个 key 将无法再次获得锁了，我们要考虑锁的可重入性。


## 四、支持可重入性


为了便于理解，画了个流程图，在第四步内部业务逻辑处理完后，会把锁释放了。

这时，回到最外层第六步，再释放锁时，已经没有锁可以释放了，虽然删除本身具有幂等性。

但这个期间，由于锁已经被内部方法早早的释放了，其他线程就可以重新拿到锁，从而导致数据安全问题。

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-5.png" width="450px">
</div>


参考 `ReentrantLock` 锁的可重入性设计思路，在加锁、释放锁的方法中加入计数器

- 首先，查询 key1 关联的值
- 如果为空，说明该线程能拿到锁，将 value 值关联到 key1 上
- 同时，定义了一个计数器 key2，将其关联的数值 加 1 ，初始为空，默认为 0
- 最后，将 key1、key2 设置过期时间

### 加锁 Lua 脚本

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-6.png" width="450px">
</div>

### 释放锁 Lua 脚本

释放锁时，除了比较 `线程标识` 来判断是否当前线程持有的锁外，还增加了一些逻辑

对锁计数器减一，当值变为0时，对分布式锁的 key 做清理动作

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-7.png" width="450px">
</div>

结果描述：

> 返回 1，表示解锁成功。返回 0，表示解锁失败，不是自己的锁

## 五、阻塞锁/非阻塞锁

Number count = redisTemplate.execute(RedisScriptConfig.getReentrantScript(), keys, value, 30);

上面提供的都是`非阻塞锁` ，不管是否能获取锁，都会立即返回。

对于阻塞锁，我们可以参考 JUC 并发包的 Atomic 实现方式，采用`自旋锁`

<div align="left">
    <img src="https://offercome.cn/images/arch/case/1-8.png" width="750px">
</div>

## 代码地址

https://github.com/aalansehaiyang/redis-limit-demo
