## 基于zookeeper实现的分布式锁

---

用zk原生api实现的锁，大致思想：

每个客户端对某个方法加锁时，在zookeeper上的与该方法对应的指定节点的目录下，生成一个唯一的瞬时有序临时节点。 判断是否获取锁的方式很简单，只需要判断有序节点中序号最小的一个。 当释放锁的时候，只需将这个瞬时节点删除即可。可以避免服务宕机导致的锁无法释放，而产生的死锁问题。

```
示例：http://www.cnblogs.com/liuyang0/p/6800538.html

```

来看下Zookeeper可能存在一些问题：

* 锁无法释放？使用Zookeeper可以有效的解决锁无法释放的问题，因为在创建锁的时候，客户端会在ZK中创建一个临时节点，一旦客户端获取到锁之后突然挂掉（Session连接断开），那么这个临时节点就会自动删除掉。其他客户端就可以再次获得锁。

* 非阻塞锁？使用Zookeeper可以实现阻塞的锁，客户端可以通过在ZK中创建顺序节点，并且在节点上绑定监听器，一旦节点有变化，Zookeeper会通知客户端，客户端可以检查自己创建的节点是不是当前所有节点中序号最小的，如果是，那么自己就获取到锁，便可以执行业务逻辑了。

* 不可重入？使用Zookeeper也可以有效的解决不可重入的问题，客户端在创建节点的时候，把当前客户端的主机信息和线程信息直接写入到节点中，下次想要获取锁的时候和当前最小的节点中的数据比对一下就可以了。如果和自己的信息一样，那么自己直接获取到锁，如果不一样就再创建一个临时的顺序节点，参与排队。

* 单点问题？使用Zookeeper可以有效的解决单点问题，ZK是集群部署的，只要集群中有半数以上的机器存活，就可以对外提供服务。

#### 缺点

* 性能上不如使用缓存实现分布式锁。因为每次在创建锁和释放锁的过程中，都要动态创建、销毁瞬时节点来实现锁功能。ZK中创建和删除节点只能通过Leader服务器来执行，然后将数据同步到所有的Follower机器上。


* 另外Zookeeper也有可能存在并发问题，只是不常见而已。由于网络抖动，客户端与ZK集群的session连接断了，那么zk以为客户端挂了，就会删除临时节点，这时候其他客户端就可以获取到分布式锁了，从而导致并发问题。解决方案，zk有重试机制，一旦zk集群检测不到客户端的心跳，就会重试，Curator客户端支持多种重试策略。多次重试之后还不行的话才会删除临时节点。（所以，选择一个合适的重试策略也比较重要，要在锁的粒度和并发之间找一个平衡。）


#### 优点

有效的解决单点问题，不可重入问题，非阻塞问题以及锁无法释放的问题。实现起来较为简单。

#### 三者比较

* 从理解的难易程度角度（从低到高）

数据库 > 缓存 > Zookeeper

* 从实现的复杂性角度（从低到高）

Zookeeper >= 缓存 > 数据库

* 从性能角度（从高到低）

缓存 > Zookeeper >= 数据库

* 从可靠性角度（从高到低）

Zookeeper > 缓存 > 数据库




#### 可以直接使用zookeeper第三方库Curator方便地实现分布式锁，代码示例


https://github.com/xuyang0902/zklock/blob/master/src/main/java/com/tongbanjie/zk/lock/core/ZkDistributedLock.java


```
Curator提供的InterProcessMutex是分布式锁的实现。

//获取锁（阻塞，直到抢到锁）
public void acquire() 
Acquire the mutex - blocking until it's available. Note: the same thread can call acquire re-entrantly. Each call to acquire must be balanced by a call to release() 

//提供带入参方法，支持超时释放
public boolean acquire(long time,TimeUnit unit) 
Acquire the mutex - blocks until it's available or the given time expires. Note: the same thread can call acquire re-entrantly. Each call to acquire that returns true must be balanced by a call to release() 
Parameters: 
time - time to wait 
unit - time unit 
Returns: 
true if the mutex was acquired, false if not

// 释放锁
public void release()
```

官方提供的示例：

https://github.com/apache/curator/blob/master/curator-examples/src/main/java/locking/ExampleClientThatLocks.java


