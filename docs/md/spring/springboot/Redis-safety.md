---
title: Redis 实现分布式锁真的安全吗
---

# Redis 实现分布式锁真的安全吗？

> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学



`Spring Boot 作为主流微服务框架，拥有成熟的社区生态。市场应用广泛，为了方便大家，整理了一个基于spring boot的常用中间件快速集成入门系列手册，涉及RPC、缓存、消息队列、分库分表、注册中心、分布式配置等常用开源组件，大概有几十篇文章，陆续会开放出来，感兴趣同学可以关注&收藏`


锁的种类非常多。之前写过一篇文章，对工作中常用锁做了总结，如：乐观锁、悲观锁、分布式锁、可重入锁、自旋锁、独享锁、共享锁、互斥锁、读写锁、阻塞锁、公平锁、非公平锁、分段锁、对象锁、类锁、信号量、行锁。

之前文章： [一文全面梳理各种锁机制](https://mp.weixin.qq.com/s/VUwexGERUjTeMnDEpRMB3g)


## 什么是分布式锁

Java中常用的锁有 synchronized、Lock锁，并发编程中，我们通过锁实现多个线程竞争同一个共享资源或者变量而造成的数据不一致问题，但是JVM锁只适用于单体应用。

随着互联网业务快速发展，软件架构开始向分布式集群演化。由于分布式系统的多线程分布在不同的服务器上，为了跨JVM控制全局共享资源的访问，于是诞生了分布式锁。

**定义：**

分布式锁是控制分布式系统之间同步访问共享资源的一种方式。在分布式系统中，常常需要协调他们的动作，如果不同的系统或是同一个系统的不同服务器之间共享了一个或一组资源，那么访问这些资源的时候，往往需要互斥来防止彼此干扰来保证一致性，在这种情况下，便需要使用到分布式锁。


**特点：**

* 互斥性。任意时刻，只有一个客户端能持有锁。
* 锁超时。和本地锁一样支持锁超时，防止死锁
* 高可用。加锁和解锁要保证性能，同时也需要保证高可用防止分布式锁失效，可以增加降级。
* 支持阻塞和非阻塞。和`ReentrantLock` 一样支持 lock 和 trylock 以及 tryLock(long timeOut)。


**实现方式：**

* 数据库锁
* 基于Redis的分布式锁
* 基于Zookeeper的分布式锁

> 考虑到性能要求，一般采用redis来实现分布式锁。另外，在实际的业务应用中，如果你想要提升分布式锁的可靠性，可以通过 `Redlock` 算法来实现。


## 代码示例

通过redis原子命令 `set key value [NX|XX] [EX seconds | PX milliseconds]` 来是实现加锁操作。

**参数解释：**

* EX seconds：设置失效时长，单位秒
* PX milliseconds：表示这个 key 的存活时间，称作锁过期时间，单位毫秒。当资源被锁定超过这个时间时，锁将自动释放。
* NX：key不存在时设置value，成功返回OK，失败返回(nil)
* XX：key存在时设置value，成功返回OK，失败返回(nil)
* value：必须是全局唯一的值。这个随机数在释放锁时保证释放锁操作的安全性。

> 原理：只有在某个 key 不存在的情况下才能设置（set）成功该 key。于是，这就可以让多个线程并发去设置同一个 key，只有一个线程能设置成功。而其它的线程因为之前有人把 key 设置成功了，而导致失败（也就是获得锁失败）。

```
/**
 * 获取锁
 * <p>
 * true：成功获取锁
 * false：本次请求没有拿到锁
 */
public boolean lock(String key, String value, long expireTime) {
    key = prefixKey + key;

    boolean lock = false;
    try {
        lock = redisTemplate.opsForValue().setIfAbsent(key, value, expireTime, TimeUnit.MILLISECONDS);
    } catch (Exception e) {
        e.printStackTrace();
        lock = false;
    }

    if (lock) {
        System.out.println(String.format("%s 已经拿到了锁，当前时间：%s", Thread.currentThread().getName(), System.currentTimeMillis() / 1000));
    }
    return lock;
}

```

分布式锁使用结束后需要手动来释放锁。可以直接通过 `del` 命令删除key即可，但是从高可用性上讲，如果业务的执行时间超过了锁释放的时间，导致 redis 中的key 自动超时过期，锁被动释放。然后被其他线程竞争获取了锁，此时之前的线程再释放的就是别人的锁，会引发混乱。

> 为了避免该问题，我们通过lua脚本，在释放锁时，先进行值比较判断，只能释放自己的锁！！！

```
public boolean unLock(String key, String value) {
    key = prefixKey + key;
    Long result = -1L;
    String luaScript =
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
             "  return redis.call('del', KEYS[1]) " +
             "else " +
             "  return 0 " +
             "end";

    DefaultRedisScript<Long> redisScript = new DefaultRedisScript(luaScript, Long.class);
    try {
        // del 成功返回 1
        result = (Long) redisTemplate.execute(redisScript, Lists.list(key), value);
        // System.out.println(result);
    } catch (Exception e) {
        e.printStackTrace();

    }
    return result == 1 ? true : false;
}
```

> 在这种场景（主从结构）中存在明显的竞态: 客户端A从master获取到锁， 在master将锁同步到slave之前，master宕掉了。slave节点被晋升为新的master节点， 客户端B取得了同一个资源被客户端A已经获取到的另外一个锁。「安全失效」！


## Redisson 实现分布式锁

为了避免 Redis 实例故障而导致的锁无法工作的问题，Redis 的开发者 Antirez 提出了分布式锁算法`Redlock`。

Redlock 算法的基本思路，是让客户端和多个独立的 Redis 实例依次请求加锁，如果客户端能够和半数以上的实例成功地完成加锁操作，那么我们就认为，客户端成功地获得分布式锁了，否则加锁失败。这样一来，即使有单个 Redis 实例发生故障，因为锁变量在其它实例上也有保存，所以，客户端仍然可以正常地进行锁操作。

**执行步骤：**

1、第一步，客户端获取当前时间。

2、第二步，客户端按顺序依次向 N 个 Redis 实例执行加锁操作。

这里的加锁操作和在单实例上执行的加锁操作一样，使用 SET 命令，带上 NX，EX/PX 选项，以及带上客户端的唯一标识。当然，如果某个 Redis 实例发生故障了，为了保证在这种情况下，Redlock 算法能够继续运行，我们需要给加锁操作设置一个超时时间。

如果客户端在和一个 Redis 实例请求加锁时，一直到超时都没有成功，那么此时，客户端会和下一个 Redis 实例继续请求加锁。加锁操作的超时时间需要远远地小于锁的有效时间，一般为几十毫秒。

3、第三步，一旦客户端完成了和所有 Redis 实例的加锁操作，客户端就要计算整个加锁过程的总耗时。只有在满足下面的这两个条件时，才能认为是加锁成功。

* 条件一：客户端从超过半数（大于等于 N/2+1）的 Redis 实例上成功获取到了锁；
* 条件二：客户端获取锁的总耗时没有超过锁的有效时间。

在满足了这两个条件后，我们需要重新计算这把锁的有效时间，计算的结果是锁的最初有效时间减去客户端为获取锁的总耗时。如果锁的有效时间已经来不及完成共享数据的操作了，我们可以释放锁，以免出现还没完成数据操作，锁就过期了的情况。

当然，如果客户端在和所有实例执行完加锁操作后，没能同时满足这两个条件，那么，客户端向所有 Redis 节点发起释放锁的操作。

在 Redlock 算法中，释放锁的操作和在单实例上释放锁的操作一样，只要执行释放锁的 Lua 脚本就可以了。这样一来，只要 N 个 Redis 实例中的半数以上实例能正常工作，就能保证分布式锁的正常工作了。

**代码示例：**

首先引入`Redisson`依赖的Jar包

```
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.9.1</version>
</dependency>
```

`Redisson` 支持3种方式连接redis，分别为单机、Sentinel 哨兵、Cluster 集群，项目中使用的连接方式是 Sentinel。

Sentinel配置，首先创建`RedissonClient`客户端实例

```
Config config = new Config();
config.useSentinelServers().addSentinelAddress("127.0.0.1:6479", "127.0.0.1:6489").setMasterName("master").setPassword("password").setDatabase(0);
RedissonClient redisson = Redisson.create(config);
```

加锁、释放锁

```
RLock lock = redisson.getLock("test_lock");
try{
    boolean isLock=lock.tryLock();
    if(isLock){
        // 模拟业务处理
        doBusiness();
    }
}catch(exception e){
}finally{
    lock.unlock();
}
```


## 项目源码


```
https://github.com/aalansehaiyang/spring-boot-bulking  

模块：spring-boot-bulking-redis-lock
```
