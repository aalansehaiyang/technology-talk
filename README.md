# 程序员技术导航


## 前言

有人认为编程是一门技术活，要有一定的天赋，非天资聪慧者不能及也。

其实不然，笔者计算机专业出身，对于技术这碗饭有一些心得体会，大多数人成为某领域顶级专家可能会有些难度，但应对日常工作，**成长为资深研发工程师、技术专家、甚至成为小团队的Team Leader，并不难**

**多读书、多看报，多研究开源框架源码，比如：github.com，这里汇集了全球工程师的智慧！**

言归正传，本文会列举工作中常用的一些技术，以及如何锻炼提升自己的架构能力。

由于每块技术市场上基本都有对应的网络资料或书籍，所以本文只是少篇幅列举工作中用到的核心知识点，抛砖引玉，属于进阶型，不适用初学者。


## 主流中间件

### Redis

* [亿级系统的Redis缓存如何设计](docs/md/middleware/redis/亿级系统的Redis缓存如何设计.md)
* [什么是布隆过滤器？如何解决高并发缓存穿透问题？](docs/md/middleware/redis/什么是布隆过滤器？如何解决高并发缓存穿透问题？.md)
* [为什么 Redis Cluster 是16384个槽位?](docs/md/middleware/redis/为什么Redis%20Cluster是16384个槽位.md)
* [Redis主节点的Key已过期，但Client访问从节点依然可以读到过期数据， 为什么？](docs/md/middleware/redis/Redis主节点的Key已过期，但Client访问从节点依然可以读到过期数据.md)
* [Redis 宕机，数据丢了，老板要辞退我](docs/md/middleware/redis/Redis%20宕机，数据丢了，老板要辞退我.md)
* [Redis 大长图一文打尽 Redis 核心技术，并配有每个知识点的详解...](docs/md/middleware/redis/2米的大长图一文打尽%20Redis%20核心技术.md)
* [Redis主节点宕机，要如何处理？](docs/md/middleware/redis/Redis主节点宕机，要如何处理？.md)
* [秒杀活动技术方案，Redis申请32个G，被技术总监挑战了](docs/md/middleware/redis/秒杀活动技术方案，Redis申请32个G，被技术总监挑战了.md)
* [一下说出了 Redis 16 个常见使用场景，惊呆面试官](docs/md/middleware/redis/一下说出了%20Redis%2016%20个常见使用场景，惊呆面试官.md)
* [Redis Cluster集群，当master宕机，主从切换，客户端报错 timed out](docs/md/middleware/redis/Redis%20Cluster集群，当master宕机，主从切换，客户端报错%20timed%20out.md)
* [如何解决 Redis 数据倾斜、热点等问题](docs/md/middleware/redis/如何解决%20Redis%20数据倾斜、热点等问题.md)



### MySQL

* [mysql 一棵 B+ 树能存多少条数据？](docs/md/middleware/mysql/mysql%20一棵%20B+%20树能存多少条数据？.md)
* [一张千万级的数据表，删除了一半的数据，你觉得B+树索引文件会不会变小？](docs/md/middleware/mysql/一张千万级的数据表，删除了一半的数据，你觉得B+树索引文件会不会变小？.md)
* [SQL 语句明明命中了索引，为什么执行很慢？](docs/md/middleware/mysql/SQL%20语句明明命中了索引，为什么执行很慢？.md)
* [跑了4个实验，实战讲解 MySQL的行锁、间隙锁...​](docs/md/middleware/mysql/跑了4个实验，实战讲解%20MySQL的行锁、间隙锁.md)
* [讲一讲 MySQL 数据备份杀手锏 binlog](docs/md/middleware/mysql/讲一讲%20MySQL%20数据备份杀手锏%20binlog.md)
* [拉取 binlog，自动同步数据](docs/md/middleware/mysql/拉取%20binlog，自动同步数据.md)
* [MySQL 主备延迟有哪些坑？主备切换策略](docs/md/middleware/mysql/MySQL%20主备延迟有哪些坑？主备切换策略.md)
* [MySQL 主从延迟 7 种解决方案](docs/md/middleware/mysql/%20MySQL%20主从延迟%207%20种解决方案.md)
* [SQL 优化有哪些技巧？](docs/md/middleware/mysql/SQL%20优化有哪些技巧.md)


### MQ 消息队列

* [聊聊 Kafka 那点破事](docs/md/middleware/mq/聊聊%20Kafka%20那点破事.md)
* [Kafka 如何解决消息不丢失？](docs/md/middleware/mq/Kafka%20如何解决消息不丢失？.md)
* [如何保证 MQ消息是有序的？](md/middleware/mq/如何保证%20MQ消息是有序的？.md)
* [关于消息队列，面试官喜欢考察哪些问题？](docs/md/middleware/mq/关于消息队列，面试官一般都会问哪些.md)



### 基础知识
* 	[java](basic-knowledge/java.md)
*  	[spring](basic-knowledge/spring.md)
*  	[spring boot](basic-knowledge/springboot.md)
*  	[spring cloud](basic-knowledge/springcloud.md)
*	[ibatis](basic-knowledge/ibatis.md)
*	[设计模式](basic-knowledge/常用的设计模式.md)
*	[Log日志](basic-knowledge/Log4j.md)


### 数据库
目前使用最多还是mysql，虽然单机性能比不上oracle，但免费开源，单机成本低且借助于分布式集群，可以有强大的输出能力。

*	[连接池](data-base/database-connection-pool.md)
* 	[事务](data-base/transaction.md)
* 	[分库分表](data-base/分库分表.md)
* 	[全局表 ID生成器](data-base/id-generate.md)
* 	[读写分离](http://blog.csdn.net/itomge/article/details/6909240)
* 	[SQL调优](data-base/sql-optimize.md)
* 	[其它](data-base/other.md)


### web容器/协议/网络

* [负载均衡](web/load-balance.md)
* 服务器
	* [Nginx](web/Nginx.md)
	* [Tomcat](web/tomcat.md)
* 协议
	* [HTTP 协议](web/http.md)
	* [TCP 协议](web/tcp.md)
* [CDN](web/CDN.md)
* [其它](web/other.md)


### 常用三方工具包

* [Google Guava](open-source-framework/Goole-Guava.md)
* [fastJson](open-source-framework/fastJson.md)
* [log4J](http://blog.csdn.net/itomge/article/details/17913607)
* [commons-codec](open-source-framework/commons-codec.md)
* [commons-lang3](open-source-framework/commons-lang3.md)
* [commons-io](open-source-framework/commons-io.md)
* [Quartz](open-source-framework/Quartz.md)
* [HttpClient](open-source-framework/HttpClient.md)
* [okhttp](open-source-framework/okhttp.md)
* [Javassist](open-source-framework/Javassist.md)
* [lombok](open-source-framework/lombok.md)


### 中间件

*	RPC框架
	* [dubbo](middle-software/dubbo.md)
	* [dubbox](https://www.oschina.net/p/dubbox)
	* [motan](https://github.com/weibocom/motan)
	* [Thrift](https://github.com/apache/thrift)
	* [RPC框架性能比较](middle-software/rpc-compare.md)

*   MQ消息
	* [ActiveMQ](https://github.com/apache/activemq)
	* [RabbitMQ](middle-software/RabbitMQ.md)
	* [Kafka](middle-software/kafka.md)
	* [RocketMQ](middle-software/RocketMQ.md)	
	* [MQ框架性能比较](middle-software/mq-compare.md)

*   分布式缓存
	* [redis](open-source-framework/redis.md)
	* [memcache](http://blog.csdn.net/itomge/article/details/8035197)

*   本地缓存
	* [Guava](middle-software/guava.md)
	* [Ehcache](middle-software/ehcache.md)
	 	
*   搜索
	* [Elasticsearch](middle-software/elasticsearch.md)

*   分布式数据框架
	* [cobar](middle-software/cobar.md)
	* [Mycat](middle-software/mycat.md)
	* [tsharding](middle-software/tsharding.md)
	* [tddl](https://github.com/alibaba/tb_tddl)
	* [sharding-jdbc](middle-software/sharding-jdbc.md)
	* [dbsplit](https://gitee.com/robertleepeak/dbsplit)

*	分布式协调服务
	* [zookeeper](middle-software/zookeeper.md)
		
*   配置管理

	* [super-diamond](other/super-diamond源码分析.md)
	* [disconf](https://www.oschina.net/p/disconf)
	* [apollo](middle-software/apollo.md)

*   分布式文件系统
	* [FastDFS](middle-software/FastDFS.md)

*   分布式任务调度框架

	* [Elastic-Job](https://github.com/elasticjob/elastic-job)
	* [详解当当网的分布式作业框架elastic-job](http://www.infoq.com/cn/articles/dangdang-distributed-work-framework-elastic-job)
	* [TBSchedule](http://blog.csdn.net/taosir_zhang/article/details/50728362)
	* [xxl-job](https://github.com/xuxueli/xxl-job)

*   大数据
	* [Hbase](middle-software/Hbase.md)
	* [Spark](middle-software/Spark.md)
	* [Hadoop](middle-software/Hadoop.md)
	* [Hive](middle-software/Hive.md)
	* [other框架](middle-software/big-data.md)	

*  其它
	* [数据库binlog的增量订阅&消费组件](https://github.com/alibaba/canal)
	* [数据库同步系统](https://github.com/alibaba/otter)
	* [TCC-Transaction](middle-software/TCC-Transaction.md)
	* [Netty](middle-software/Netty.md)
	* [OpenResty](middle-software/openresty.md)

### 系统架构 

* [架构经验](system-architecture/architecture-experience.md)
* [经典案例](system-architecture/architecture-good-case.md)
* [通用技术方案选型](system-architecture/technology-selection.md)
* [编码前3000问](system-architecture/编码前3000问.md)
* [软硬件性能](system-architecture/software-performance.md)
* [技术大纲](system-architecture/knowledge-outline.md)


### 项目管理

* [论需求调研的重要性](project-management/论需求调研的重要性.md)
* [项目管理](project-management/project-management.md)
* [代码管理](project-management/code.md)
* [测试相关](project-management/test.md)


### 运维

*	[快速排查线上问题](ops/online-question.md)
*	[linux常用命令](ops/linux-commands.md)
*	[本地代码调试](ops/本地代码调试.md)
* 	[Docker](ops/docker.md)

### 个人成长

*   [学习网站](other/study.md)
*   [Tom哥的读书单](other/book.md)
*   [个人成长与职业规划](other/person.md)
*   [程序员素养](other/programer.md)


### 其它

*	[常用软件工具](other/tool.md)
*	[一致性hash算法](other/一致性hash.md)
*   面试
	* [java面试题](other/java-interview.md)
	* [大数据面试题](other/bigdata-interview.md)
*	[回车与换行的区别](other/回车与换行的区别.md)
*   [github上fork项目后，如何同步更新后面提交](http://blog.csdn.net/qq1332479771/article/details/56087333)
* 	[其它](other/other.md)


### 写在最后


作者 **Tom哥**，计算机研究生，**阿里 P7 技术专家**，拿过 百度、华为、中兴、腾讯 等6家大厂offer，出过**专利**。

多次参加**淘宝双11**大促活动，架构经验丰富。作为团队负责人，面试过 **500多**位候选人，如果你想去**一线大厂**，关注下方公众号回复「 **大厂** 」，领取大厂面试资料，成为offer收割机


<img src="docs/.vuepress/public/images/about/me/1.png" width=400>