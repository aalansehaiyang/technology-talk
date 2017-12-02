## 技术心得

---

有人认为编程是一门技术活，要有一定的天赋，非天资聪慧者不能及也。其实不然，笔者虽是计算机专业出身，但工作年限并不长，对于技术这碗饭有一些心得体会，大多数人成为某领域顶级专家可能会有些难度，但应对日常工作，成长为资深研发工程师、技术专家、甚至成为小团队的Team Leader，其实并不难。

**多读书、多看报，多研究常用开源框架的源码，比如：github.com，这里汇集了全球工程师的智慧！**

言归正传，下文会列举工作中常用的一些技术，以及如何锻炼提升自己的架构能力。

由于每块技术市场上基本都有对应的网络资料或书籍，所以本文只是少篇幅列举工作中用到的核心知识点，抛砖引玉，属于进阶型，不适用初学者。

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

*	[连接池](data-base/数据库连接池.md)
* 	[事务](data-base/transaction.md)
* 	[分库分表](data-base/分库分表.md)
* 	[id生成器](data-base/id生成器.md)
* 	[读写分离](http://blog.csdn.net/itomge/article/details/6909240)
* 	[SQL调优](data-base/sql-optimize.md)
* 	[其它](data-base/other.md)


### web容器/协议/网络

* [负载均衡](web/load-balance.md)
* 服务器
	* [Nginx](web/Nginx.md)
	* [Tomcat](web/tomcat.md)
* 协议
	* [HTTP 协议](web/http协议.md)
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
* [Javassist](http://blog.csdn.net/itomge/article/details/7671294)


### 中间件

*	RPC框架
	* [dubbo](middle-software/dubbo.md)
	* [dubbox](https://www.oschina.net/p/dubbox)
	* [motan](https://github.com/weibocom/motan)
	* [Thrift](https://github.com/apache/thrift)
	* [RPC框架性能比较](http://mp.weixin.qq.com/s/iw9-UaZZl3gCqKAw2Mxz6A)

*   MQ消息
	* [ActiveMQ](https://github.com/apache/activemq)
	* [RabbitMQ](middle-software/RabbitMQ.md)
	* [Kafka](middle-software/kafka.md)
	* [RocketMQ](https://github.com/apache/incubator-rocketmq)

*   缓存
	* [redis](open-source-framework/redis.md)
	* [codis]()
	* [memcache](http://blog.csdn.net/itomge/article/details/8035197)	

*   搜索
	* [Elasticsearch](middle-software/elasticsearch.md)

*   分布式数据框架
	* [cobar](middle-software/cobar.md)
	* [Mycat](middle-software/mycat.md)
	* [tsharding](middle-software/tsharding.md)
	* [tddl](https://github.com/alibaba/tb_tddl)
	* [sharding-jdbc](https://www.slahser.com/2016/06/25/%E5%BD%93%E5%BD%93%E7%9A%84sharding-jdbc%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/)

*	分布式协调服务
	* [zookeeper](middle-software/zookeeper.md)
	
*   大数据
	* [Hbase](middle-software/Hbase.md)
	* [Spark](middle-software/Spark.md)
	* [Hadoop](middle-software/Hadoop.md)
	* [Hive](middle-software/Hive.md)
	* [other框架](middle-software/big-data.md)
	
*   配置管理

	* [super-diamond](other/super-diamond源码分析.md)
	* [disconf](https://www.oschina.net/p/disconf)
	* [apollo](middle-software/apollo.md)

*   分布式文件系统
	* [FastDFS](middle-software/FastDFS.md)

*  其它
	* [数据库binlog的增量订阅&消费组件](https://github.com/alibaba/canal)
	* [数据库同步系统](https://github.com/alibaba/otter)

### 系统架构 

* [架构经验](system-architecture/architecture-experience.md)
* [经典案例](system-architecture/architecture-good-case.md)
* [通用技术方案选型](system-architecture/technology-selection.md)
* [编码前3000问](system-architecture/编码前3000问.md)


### 项目管理

* [论需求调研的重要性](project-management/论需求调研的重要性.md)
* [项目管理](project-management/项目管理案例.md)
* [代码管理](project-management/code.md)
* [测试相关](project-management/test.md)


### 运维

*	[快速排查线上问题](ops/online-question.md)
*	[linux常用命令](ops/linux-commands.md)
*	[本地代码调试](ops/本地代码调试.md)
* 	[Docker](ops/docker.md)

### 个人成长

*   [Tom的读书单](other/book.md)
*   [个人成长与职业规划](other/person.md)
*   [学习网站](other/study.md)
*   [程序员素养](project-management/程序员素养.md)

### 其它

*	[常用软件工具](other/tool.md)
*	[一致性hash算法](other/一致性hash.md)
*   面试
	* [java面试题](other/java-interview.md)
	* [大数据面试题](other/bigdata-interview.md)
*	[回车与换行的区别](other/回车与换行的区别.md)
*   [github上fork项目后，如何同步更新后面提交](http://blog.csdn.net/qq1332479771/article/details/56087333)

### 写在后面

**不知不觉，这个项目已经更新两年了。如果喜欢请点击右上角 star 收藏；如果因为读里面的文章，开阔了视野，提升了技术能力并升职加薪，也欢迎打赏表扬，你的赞赏会激励作者一直更新下去**


![image](basic-knowledge/img/26.png)