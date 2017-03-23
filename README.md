## 技术心得

---

有人认为编程是一门技术活，要有一定的天赋，非天资聪慧者不能及也。其实不然，笔者虽是计算机专业出身，但工作年限并不长，对于技术这碗饭有一些心得体会，大多数人成为某领域专家可能会有些难度，但应付日常工作，甚至成为团队骨干，其实并不难。

**多读书、多看报，多研究常用开源框架的源码，比如：github.com，这里汇集了全球工程师的智慧！**

言归正传，下文会列举工作中常用的一些技术，以及如何锻炼提升自己的架构能力。

由于每块技术市场上基本都有对应的网络资料或书籍，所以本文只是少篇幅列举工作中用到的核心知识点，抛砖引玉，属于进阶型，不适用初学者。

### 基础知识
* 	[java](basic-knowledge/java.md)
*  	[spring](basic-knowledge/spring.md)
*  	[springboot](basic-knowledge/springboot.md)
*	[ibatis](basic-knowledge/ibatis.md)
*	[设计模式](basic-knowledge/常用的设计模式.md)
*	[java日志](basic-knowledge/Log4j.md)


### 数据库
目前使用最多还是mysql，虽然单机性能比不上oracle，但免费开源，单机成本低且借助于分布式集群，可以有强大的输出能力。

*	[连接池](data-base/数据库连接池.md)
* 	[乐观锁&悲观锁](data-base/锁机制.md)
* 	[分库分表](data-base/分库分表.md)
* 	[id生成器](data-base/id生成器.md)
* 	[mysql中bigint、int、mediumint、smallint 和 tinyint的取值范围](data-base/bigint类型.md)
* 	[DAO层接口性能监控](data-base/DAO层接口性能监控.md)
* 	[读写分离](http://blog.csdn.net/itomge/article/details/6909240)
* 	[sql技巧](data-base/sql技巧.md)

### web容器/协议/网络

* [负载均衡之LVS](system-architecture/LVS.md)
* [Nginx](web/Nginx.md)
* [tomcat](http://tomcat.apache.org/)
* [http协议](web/http协议.md)
* [CDN](system-architecture/CDN.md)


### 常用三方工具包

* [Google Guava](open-source-framework/Goole-Guava.md)
* [fastJson](open-source-framework/fastJson.md)
* [log4J](http://blog.csdn.net/itomge/article/details/17913607)
* [commons-codec](open-source-framework/commons-codec.md)
* [commons-lang3](open-source-framework/commons-lang3.md)
* [commons-io](open-source-framework/commons-io.md)
* [Quartz](open-source-framework/Quartz.md)
* [HttpClient](open-source-framework/HttpClient.md)
* [Javassist](http://blog.csdn.net/itomge/article/details/7671294)



### 系统架构 

* [架构经验](system-architecture/架构经验.md)
* [经典案例](system-architecture/经典案例.md)
* [编码前3000问](system-architecture/编码前3000问.md)
* [性能优化之Qps](system-architecture/性能优化之Qps.md)
* [cache相关](system-architecture/cache相关.md)
* [分布式锁](system-architecture/分布式锁.md)

### 中间件

*	RPC框架
	* [dubbo](middle-software/dubbo.md)
	* [dubbox](https://www.oschina.net/p/dubbox)
	* [Thrift](https://github.com/apache/thrift)

*   MQ消息
	* [kafka](middle-software/kafka.md)
	* [ActiveMQ](https://github.com/apache/activemq)
	* [RocketMQ](https://github.com/apache/incubator-rocketmq)

*   缓存
	* [redis](open-source-framework/redis.md)
	* [memcache](http://blog.csdn.net/itomge/article/details/8035197)

*   搜索
	* [Elasticsearch](middle-software/elasticsearch.md)

*   分布式数据框架
	* [cobar](http://hualong.iteye.com/blog/2102798)
	* [tsharding](https://www.oschina.net/p/TSharding-Client)
	* [tddl](https://github.com/alibaba/tb_tddl)

*   大数据
	* [Hbase](middle-software/Hbase.md)
	* [MogonDB](middle-software/MogonDB.md)
	* [Storm](middle-software/Storm.md)
	* [Spark](middle-software/Spark.md)
	* [Hadoop](middle-software/Hadoop.md)
	* [Hive](middle-software/Hive.md)
	
*   配置管理

	* [super-diamond](other/super-diamond源码分析.md)
	* [disconf](https://www.oschina.net/p/disconf)
	

*  其它
	* [zookeeper](middle-software/zookeeper.md)
	* [FastDFS(分布式文件系统)](https://www.oschina.net/p/fastdfs)


### 运维

*	[快速排查线上问题](ops/online-question.md)
*	[linux常用命令](ops/linux常用命令.md)
*	[本地代码调试](ops/本地代码调试.md)


### 项目管理

* [程序员素养](project-management/程序员素养.md)
* [git常用命令](project-management/git常用命令.md)
* [代码规范](project-management/代码规范.md)


### 其它

*   [读书单](other/book.md)
*	[HTTPS 抓包工具（charles）](http://blog.vetcafe.net/2013/12/charlesproxyiphonehttps.html)
*	[一致性hash算法](other/一致性hash.md)
*	[Lombok安装](http://www.blogjava.net/fancydeepin/archive/2012/07/12/382933.html)
*	[mysql数据库binlog的增量订阅&消费组件](https://github.com/alibaba/canal)
*	[分布式数据库同步系统](https://github.com/alibaba/otter)
*	[java面试题](other/java-interview.md)

