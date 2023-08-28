---
title: Redis Cluster集群，当master宕机，主从切换，客户端报错 timed out
---

# Redis Cluster集群，当master宕机，主从切换，客户端报错 timed out


> 作者：Tom哥
> <br/>公众号：微观技术
> <br/> 博客：[https://offercome.cn](https://offercome.cn)
> <br/> 人生理念：知道的越多，不知道的越多，努力去学


---


大家好，我是Tom哥

性能不够，缓存来凑

一个高并发系统肯定少不了缓存的身影，为了保证缓存服务的高可用，我们通常采用 Redis Cluster 集群模式。


<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-1.jpg" width="600px">
</div>

**描述：**

集群部署采用了 `3主3从` 拓扑结构，`数据读写`访问master节点， slave节点负责备份。

随便登录一台 redis 节点，都可以看到集群的slot的槽位分步区间，以及对应的主从节点映射关系。

```
127.0.0.1:8001> cluster slots
1) 1) (integer) 10923
   2) (integer) 16383
   3) 1) "127.0.0.1"
      2) (integer) 8003
      3) "6c574c9d1323c69ebc73a5977bcbd3d4c073a4d4"
   4) 1) "127.0.0.1"
      2) (integer) 8006
      3) "123d0b157078925743ac1deb96be8c3395d7d038"
2) 1) (integer) 0
   2) (integer) 5460
   3) 1) "127.0.0.1"
      2) (integer) 8001
      3) "99bc05e81ef0035a4ab2d13cbae2599425b7ed7d"
   4) 1) "127.0.0.1"
      2) (integer) 8004
      3) "402e900ef364ce9382beddf92747cf28e3ea9c2f"
3) 1) (integer) 5461
   2) (integer) 10922
   3) 1) "127.0.0.1"
      2) (integer) 8002
      3) "fda6a9e49205a52418c0bca4c66c981066017a3c"
   4) 1) "127.0.0.1"
      2) (integer) 8005
      3) "24a1e23f6cbfb761234970b66043d562e79e3d9c"
```

人为模拟，master-1 机器意外宕机

```
docker stop c1dff012392d
```

此时，Redis Cluster 集群能自动感知，并自动完成主备切换，对应的slave会被选举为新的master节点


<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-2.jpg" width="600px">
</div>

看下 redis cluster 集群最新的主从关系


<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-3.jpg" width="460px">
</div>

看似也没什么问题，一切正常

此时 Spring Boot 应用依然在线服务，当我们再尝试操作缓存时，会报错

<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-4.jpg" width="600px">
</div>

问题边界还是非常清晰的。

Redis Cluster 集群已经完成了切换。

但是 Spring Boot 客户端`没有动态感知到` Redis Cluster 的最新集群信息

**原因分析：**

SpringBoot 2.X 版本， Redis默认的连接池采用 `Lettuce`

当Redis 集群节点发生变化后，Letture默认是不会刷新节点拓扑

**解决方案：**

将 `Letture` 二方包仲裁掉

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <version>2.3.12.RELEASE</version>
    <exclusions>
        <exclusion>
            <groupId>io.lettuce</groupId>
            <artifactId>lettuce-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

然后，引入 `Jedis` 相关二方包

```
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
```

编译代码，并重新启动 SpringBoot 微服务，万事俱备，只欠再次验证

<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-5.jpg" width="240px">
</div>

重新模拟将 `127.0.0.1：8001` master 节点宕机，看看系统的日志

```
[2022-03-17 18:03:34:595] [redisson-netty-2-4] [INFO]  - master /127.0.0.1:8001 used as slave
[2022-03-17 18:03:34:596] [redisson-netty-2-4] [INFO]  - slave redis://127.0.0.1:8004 removed for slot ranges: [[0-5460]]
[2022-03-17 18:03:34:611] [redisson-netty-2-12] [INFO]  - 1 connections initialized for /127.0.0.1:8004
[2022-03-17 18:03:34:639] [redisson-netty-2-8] [INFO]  - /127.0.0.1:8001 master and related slaves: [addr=redis://127.0.0.1:8004] removed
[2022-03-17 18:03:34:641] [redisson-netty-2-8] [INFO]  - 24 connections initialized for /127.0.0.1:8004
[2022-03-17 18:03:34:655] [redisson-netty-2-9] [INFO]  - 1 connections initialized for /127.0.0.1:8004
[2022-03-17 18:03:34:678] [redisson-netty-2-27] [INFO]  - master: redis://127.0.0.1:8004 added for slot ranges: [[0-5460]]
[2022-03-17 18:03:34:678] [redisson-netty-2-27] [INFO]  - 24 connections initialized for /127.0.0.1:8004
```

从打印的日志来看，客户端已经感知到了`主备切换`，并与最新的主节点 `127.0.0.1:8004` 初始化了 24 个连接。

然后，回归业务功能，`读写缓存` 数据也都是操作最新的主节点。


<div align="left">
    <img src="https://offercome.cn/images/middleware/redis/9-6.jpg" width="240px">
</div>

还有一种方案：**刷新节点拓扑视图**

Lettuce 官方描述：

> https://github.com/lettuce-io/lettuce-core/wiki/Redis-Cluster#user-content-refreshing-the-cluster-topology-view

> Lettuce 处理 Moved 和 Ask 永久重定向，由于命令重定向，必须刷新节点拓扑视图。而自适应拓扑刷新（Adaptive updates）与定时拓扑刷新（Periodic updates）默认关闭

解决方案：

* 调用 RedisClusterClient.reloadPartitions
* 后台基于时间间隔的周期刷新
* 后台基于持续的`断开` 和 `移动、重定向` 的自适应更新


编写代码

```
@Bean(destroyMethod = "destroy")
public LettuceConnectionFactory lettuceConnectionFactory() {

    //开启 自适应集群拓扑刷新和周期拓扑刷新
    ClusterTopologyRefreshOptions clusterTopologyRefreshOptions =  ClusterTopologyRefreshOptions.builder()
            // 开启自适应刷新。否则，Redis集群变更后将会导致连接异常
            .enableAllAdaptiveRefreshTriggers() 
            // 自适应刷新超时时间(默认30秒)
            .adaptiveRefreshTriggersTimeout(Duration.ofSeconds(30)) 
            // 开周期刷新
            .enablePeriodicRefresh(Duration.ofSeconds(20))  
            .build();

    ClientOptions clientOptions = ClusterClientOptions.builder()
            .topologyRefreshOptions(clusterTopologyRefreshOptions)
            .build();

    LettuceClientConfiguration clientConfig = LettucePoolingClientConfiguration.builder()
            .poolConfig(genericObjectPoolConfig(redisProperties.getJedis().getPool()))
            .clientOptions(clientOptions)
            .commandTimeout(redisProperties.getTimeout()) //默认RedisURI.DEFAULT_TIMEOUT 60
            .build();

    List<String> clusterNodes = redisProperties.getCluster().getNodes();
    Set<RedisNode> nodes = new HashSet<RedisNode>();
    clusterNodes.forEach(address -> nodes.add(new RedisNode(address.split(":")[0].trim(), Integer.valueOf(address.split(":")[1]))));

    RedisClusterConfiguration clusterConfiguration = new RedisClusterConfiguration();
    clusterConfiguration.setClusterNodes(nodes);
    clusterConfiguration.setPassword(RedisPassword.of(redisProperties.getPassword()));
    clusterConfiguration.setMaxRedirects(redisProperties.getCluster().getMaxRedirects());

    LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(clusterConfiguration, clientConfig);
    // 是否允许多个线程操作同一个缓存连接，默认true，false 每个操作都将创建新的连接
    // lettuceConnectionFactory.setShareNativeConnection(false); 
    // 重置底层共享连接, 在接下来的访问时初始化
    // lettuceConnectionFactory.resetConnection(); 
    return lettuceConnectionFactory;
}
```

