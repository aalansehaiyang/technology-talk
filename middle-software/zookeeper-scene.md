## zookeeper适用场景

---

* dubbo

做为其注册中心，网上资料比较多，就不多描述，可自行baidu。

* canal

主要用于其主备切换。

出于容灾考虑，往往会配置两个Canal Server负责一个mysql数据库实例的数据增量复制。为了减少Canal Server 的dump请求对mysql master带来的性能影响，要求不同的Canal Server上的instance在同一时刻只能有一个处于Running状态，其他的instance处于Standby状态。具体步骤：

a）尝试启动。所有Canal Server上的instance都会向zk尝试创建一个临时节点，哪个Canal Server创建成功了，那么就让哪个Server启动

b）启动instance。将自己的信息写入该节点。其它的Canal Server对该节点注册Watch监听。

c）主备切换。如果服务节点与zk的会话失效，临时节点会被删除，从而所有的实例会重新竞争上岗，从而实现主备切换。但有一个问题，服务节点可能存在假死情况，网络出现闪断，导致zk认为其会话失效，从而释放Running节点，但此时Cannal Server对应的JVM并没未退出。解决策略：

状态为Standby的Cannal Sever在收到Running节点释放通知后，会延迟一段时间（通常5秒）抢占Running节点，而原本处于Running状态的instance可以不需要等待延迟，直接重新取得Running节点。

更多资料可参考《从Paxos到ZooKeeper》P219

* otter

* hbase

* Hadoop

* Kafka

* 分布式锁

* 分布式协调/通知

* 集群管理

* master选举

分布式高并发情况下创建节点一定是全局唯一性，zk会保证客户端无法重复创建一个已经存在的数据节点。

客户端集群每天定时往zk上创建一个临时节点，例如 /master-selection/2017-10-20/binding，抢节点时，只有一个客户端创建成功，那么创建节点的客户端就成了master。其他客户端在/master-selection/2017-10-20上注册一个Watcher事件，用于监控Master机器是否存活，一旦发现当前Master挂了，其余的客户端会重新进行Master选举。










